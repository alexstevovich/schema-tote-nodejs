/*
 * schema-tote
 * https://alexstevovich.com/a/schema-tote-nodejs
 *
 * Copyright 2017–2025 Alex Stevovich
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs';

class SchemaTote {
    constructor() {
        this.data = [];
    }

    /** Load a JSON file (expects an array of entries). */
    loadFromFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(content);

        if (!Array.isArray(json)) {
            throw new Error(`[SchemaData] Expected array in ${filePath}`);
        }

        this.data.push(...json);
        return this.data;
    }

    /** Reload from disk (clears previous entries). */
    reloadFromFile(filePath) {
        this.data = [];
        return this.loadFromFile(filePath);
    }

    /** Get all entries. */
    getAll() {
        return this.data;
    }

    /** Get entry by top-level id. */
    getById(id) {
        return this.data.find((d) => d.id === id) || null;
    }

    /** Get schema node by @id. */
    getBySchemaId(schemaId) {
        return (
            this.data.find((d) => d.schema && d.schema['@id'] === schemaId) ||
            null
        );
    }

    /** Get all entries whose schema has the given @type. */
    getAllBySchemaType(schemaType) {
        return this.data.filter(
            (d) => d.schema && d.schema['@type'] === schemaType,
        );
    }

    /** Get all entries by top-level type (e.g. "home", "core"). */
    getAllByType(type) {
        return this.data.filter((d) => d.type === type);
    }

    /** Get all entries containing a given tag. */
    getAllByTag(tag) {
        return this.data.filter(
            (d) =>
                Array.isArray(d.tags) &&
                d.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()),
        );
    }

    /** Return minimal ref of entry by id. */
    getRefById(id) {
        const item = this.getById(id);
        if (!item || !item.schema) return null;
        const s = item.schema;
        return { '@type': s['@type'], '@id': s['@id'] };
    }

    /** Return minimal ref of schema by its @id. */
    getRefBySchemaId(schemaId) {
        const item = this.getBySchemaId(schemaId);
        if (!item || !item.schema) return null;
        const s = item.schema;
        return { '@type': s['@type'], '@id': s['@id'] };
    }
}

export { SchemaTote };
export default SchemaTote;
