# schema-tote

**Canonical URL:**  
[https://alexstevovich.com/a/schema-tote-nodejs](https://alexstevovich.com/a/schema-tote-nodejs)

**Software URL:**  
[https://midnightcitylights.com/software/schema-tote-nodejs](https://midnightcitylights.com/software/schema-tote-nodejs)

A registry and accessor for JSON-LD schema definitions and structured metadata.  
`schema-tote` provides a unified way to load, query, and extract schema references for websites or data-driven frameworks.

---

## Installation

```sh
npm install schema-tote
```

## Example

```js
import SchemaTote from 'schema-tote';

// Initialize
const tote = new SchemaTote();

// Load a JSON file (array of wrapper entries)
tote.loadFromFile('./data/schema.json');

// 🔹 Retrieve full wrapper entries
console.log(tote.getAll()); // all entries with id, tags, and schema metadata
console.log(tote.getById('home')); // full wrapper by id
console.log(tote.getBySchemaId('https://example.com/#organization')); // wrapper by schema @id
console.log(tote.getAllBySchemaType('Organization')); // wrappers by @type
console.log(tote.getAllByType('core')); // wrappers by type
console.log(tote.getAllByTag('featured')); // wrappers by tag

// 🔹 Retrieve only the inner schema objects
console.log(tote.getSchemaById('home')); // returns just the schema node
console.log(tote.getSchemaBySchemaId('https://example.com/#organization'));
console.log(tote.getAllSchemas()); // all schemas
console.log(tote.getAllSchemasByType('Organization')); // only schemas of given @type
console.log(tote.getAllSchemasByTag('featured')); // schemas filtered by tag

// 🔹 Retrieve minimal references
console.log(tote.getRefById('home'));
console.log(tote.getRefBySchemaId('https://example.com/#person'));

/*
[
    {
        "id": "home",
        "type": "core",
        "tags": ["featured"],
        "schema": {
            "@type": "WebPage",
            "@id": "https://example.com/#home",
            "name": "Home"
        }
    },
    {
        "id": "organization",
        "type": "core",
        "tags": ["brand"],
        "schema": {
            "@type": "Organization",
            "@id": "https://example.com/#organization",
            "name": "Example Inc."
        }
    }
]
*/

// Example schema-only results:
[
    {
        '@type': 'WebPage',
        '@id': 'https://example.com/#home',
        name: 'Home',
    },
    {
        '@type': 'Organization',
        '@id': 'https://example.com/#organization',
        name: 'Example Inc.',
    },
];
```

## Methods

### `loadFromFile(filePath)`

Reads a `.json` file containing an array of schema entries and appends them to the tote.  
Each entry should be a wrapper object containing `{ id, type, tags, schema }`.

### `reloadFromFile(filePath)`

Clears all previously loaded data and reloads from disk.

---

## Retrieval

> Retrieval methods come in two forms:
>
> - **Wrapper getters** return the full entry with metadata (`id`, `type`, `tags`, and `schema`).
> - **Schema getters** return only the inner JSON-LD schema object itself.

| Method                     | Returns          | Description                                                            |
| -------------------------- | ---------------- | ---------------------------------------------------------------------- |
| `getAll()`                 | `Array<Object>`  | Returns all wrapper entries.                                           |
| `getById(id)`              | `Object \| null` | Returns a wrapper by its top-level `id`.                               |
| `getBySchemaId(schemaId)`  | `Object \| null` | Returns a wrapper by its inner schema’s `@id`.                         |
| `getAllBySchemaType(type)` | `Array<Object>`  | Returns all wrapper entries whose inner schema has the given `@type`.  |
| `getAllByType(type)`       | `Array<Object>`  | Returns all wrapper entries with the specified top-level `type`.       |
| `getAllByTag(tag)`         | `Array<Object>`  | Returns all wrapper entries containing a given tag (case-insensitive). |

---

## Schema Accessors

> These functions directly return **only the inner schema** objects  
> instead of their outer wrapper metadata.

| Method                          | Returns          | Description                                                                                       |
| ------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `getSchemaById(id)`             | `Object \| null` | Returns the schema object for the given top-level `id`.                                           |
| `getSchemaBySchemaId(schemaId)` | `Object \| null` | Returns the schema object for the given schema `@id`.                                             |
| `getAllSchemas()`               | `Array<Object>`  | Returns all inner schema objects, stripping away wrapper data.                                    |
| `getAllSchemasByType(type)`     | `Array<Object>`  | Returns all schema objects whose `@type` matches the provided type.                               |
| `getAllSchemasByTag(tag)`       | `Array<Object>`  | Returns all schema objects belonging to wrappers tagged with the provided tag (case-insensitive). |

---

## References

> Reference helpers return a minimal schema reference containing only  
> `@type` and `@id`, suitable for lightweight linking between schemas.

| Method                       | Returns                                    | Description                                                 |
| ---------------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| `getRefById(id)`             | `{"@type": string, "@id": string} \| null` | Returns a minimal reference for the schema found by `id`.   |
| `getRefBySchemaId(schemaId)` | `{"@type": string, "@id": string} \| null` | Returns a minimal reference for the schema with that `@id`. |

## License

Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
