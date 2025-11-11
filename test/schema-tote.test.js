import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import SchemaTote from '../src/index.js';

const TMP_DIR = path.join(process.cwd(), 'tmp-schema-tote');
const JSON_FILE = path.join(TMP_DIR, 'schema.json');

// ✅ Mock dataset – same structure SchemaTote expects (wrapper with { id, tags, schema })
const mockData = [
    {
        id: 'example_brand',
        tags: ['core'],
        schema: {
            '@type': 'Brand',
            '@id': 'https://example.com#brand',
            name: 'Example Brand',
            description: 'Primary identity for Example Corp.',
            url: 'https://example.com',
            logo: 'https://example.com/logo.png',
            brandOwner: { '@id': 'https://example.com#john' },
        },
    },
    {
        id: 'john_smith',
        tags: ['core'],
        schema: {
            '@type': 'Person',
            '@id': 'https://example.com#john',
            name: 'John Smith',
            url: 'https://example.com',
            jobTitle: 'Software Engineer',
        },
    },
    {
        id: 'example_website',
        tags: ['core'],
        schema: {
            '@type': 'WebSite',
            '@id': 'https://example.com#website',
            name: 'Example.com',
            url: 'https://example.com',
            creator: { '@id': 'https://example.com#john' },
            inLanguage: 'en-US',
        },
    },
    {
        id: 'example_product',
        tags: ['catalog', 'featured'],
        schema: {
            '@type': 'Product',
            '@id': 'https://example.com/products/widget',
            name: 'Example Widget',
            description: 'A sample product used in documentation.',
            brand: { '@id': 'https://example.com#brand' },
        },
    },
];

let tote;

// ✅ Prepare clean environment for every test
beforeEach(() => {
    fs.mkdirSync(TMP_DIR, { recursive: true });
    fs.writeFileSync(JSON_FILE, JSON.stringify(mockData, null, 4));
    tote = new SchemaTote();
    tote.reloadFromFile(JSON_FILE);
});

// 🧹 Clean up temporary files after all tests
afterAll(() => {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

describe('SchemaTote', () => {
    it('loads valid schema JSON and stores wrapper entries', () => {
        const all = tote.getAll();
        expect(all.length).toBe(4);
        expect(all[0]).toHaveProperty('id');
        expect(all[0]).toHaveProperty('schema');
    });

    it('reloads JSON and clears previous entries', () => {
        const single = [
            {
                id: 'temp_entry',
                schema: {
                    '@type': 'Thing',
                    '@id': 'https://example.com#thing',
                },
            },
        ];
        fs.writeFileSync(JSON_FILE, JSON.stringify(single, null, 4));
        tote.reloadFromFile(JSON_FILE);
        const all = tote.getAll();
        expect(all.length).toBe(1);
        expect(all[0].id).toBe('temp_entry');
    });

    it('throws an error when JSON file is not an array', () => {
        const badPath = path.join(TMP_DIR, 'invalid.json');
        fs.writeFileSync(badPath, JSON.stringify({ not: 'an array' }, null, 4));
        const badTote = new SchemaTote();
        expect(() => badTote.loadFromFile(badPath)).toThrowError(
            /Expected array/,
        );
    });

    it('retrieves a wrapper by id', () => {
        const website = tote.getById('example_website');
        expect(website).not.toBeNull();
        expect(website.schema['@type']).toBe('WebSite');

        const missing = tote.getById('no_such_id');
        expect(missing).toBeNull();
    });

    it('retrieves wrapper by schema @id', () => {
        const brand = tote.getBySchemaId('https://example.com#brand');
        expect(brand).not.toBeNull();
        expect(brand.schema.name).toBe('Example Brand');

        const missing = tote.getBySchemaId('https://notfound.com#x');
        expect(missing).toBeNull();
    });

    it('gets all wrappers by schema @type', () => {
        const brands = tote.getAllBySchemaType('Brand');
        const websites = tote.getAllBySchemaType('WebSite');
        expect(brands.length).toBe(1);
        expect(websites.length).toBe(1);
    });

    it('gets all wrappers by tag (case-insensitive)', () => {
        const coreLower = tote.getAllByTag('core');
        const coreUpper = tote.getAllByTag('CORE');
        const featured = tote.getAllByTag('featured');

        expect(coreLower.length).toBe(coreUpper.length);
        expect(featured.length).toBe(1);
    });

    // 🔹 New Tests for Schema-only accessors

    it('returns only the schema object for a given id', () => {
        const schema = tote.getSchemaById('example_brand');
        expect(schema).not.toBeNull();
        expect(schema['@type']).toBe('Brand');
        expect(schema.name).toBe('Example Brand');
    });

    it('returns only the schema object for a given schema @id', () => {
        const schema = tote.getSchemaBySchemaId('https://example.com#john');
        expect(schema).not.toBeNull();
        expect(schema['@type']).toBe('Person');
    });

    it('returns all schema objects without wrappers', () => {
        const schemas = tote.getAllSchemas();
        expect(schemas.length).toBe(4);
        expect(schemas.every((s) => s['@id'])).toBe(true);
    });

    it('returns all schemas by @type', () => {
        const brands = tote.getAllSchemasByType('Brand');
        const websites = tote.getAllSchemasByType('WebSite');
        expect(brands.length).toBe(1);
        expect(websites[0]['@type']).toBe('WebSite');
    });

    it('returns all schemas by tag', () => {
        const coreSchemas = tote.getAllSchemasByTag('core');
        const featuredSchemas = tote.getAllSchemasByTag('featured');
        expect(coreSchemas.length).toBeGreaterThan(1);
        expect(featuredSchemas.length).toBe(1);
        expect(featuredSchemas[0]['@type']).toBe('Product');
    });

    it('returns minimal ref by top-level id', () => {
        const ref = tote.getRefById('john_smith');
        expect(ref).toEqual({
            '@type': 'Person',
            '@id': 'https://example.com#john',
        });

        const missingRef = tote.getRefById('not_found');
        expect(missingRef).toBeNull();
    });

    it('returns minimal ref by schema @id', () => {
        const ref = tote.getRefBySchemaId('https://example.com#website');
        expect(ref).toEqual({
            '@type': 'WebSite',
            '@id': 'https://example.com#website',
        });

        const missingRef = tote.getRefBySchemaId('https://missing.com#404');
        expect(missingRef).toBeNull();
    });
});
