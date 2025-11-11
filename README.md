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

// Load a JSON file (array of entries)
tote.loadFromFile('./data/schema.json');

// Get all entries
console.log(tote.getAll());

// Find specific entries
console.log(tote.getById('home'));
console.log(tote.getBySchemaId('https://example.com/#organization'));
console.log(tote.getAllBySchemaType('Organization'));
console.log(tote.getAllByType('core'));
console.log(tote.getAllByTag('featured'));

// Get compact references
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
```

## Methods

### `loadFromFile(filePath)`

Reads a `.json` file containing an array of schema entries and appends them to the tote.

### `reloadFromFile(filePath)`

Clears existing data and reloads entries from disk.

---

## Retrieval

| Method                     | Returns          | Description                                                 |
| -------------------------- | ---------------- | ----------------------------------------------------------- |
| `getAll()`                 | `Array<Object>`  | Returns all entries.                                        |
| `getById(id)`              | `Object \| null` | Gets an entry by its top-level `id`.                        |
| `getBySchemaId(schemaId)`  | `Object \| null` | Finds an entry by its schema’s `@id`.                       |
| `getAllBySchemaType(type)` | `Array<Object>`  | Returns all entries whose schema has a given `@type`.       |
| `getAllByType(type)`       | `Array<Object>`  | Returns all entries with the specified top-level `type`.    |
| `getAllByTag(tag)`         | `Array<Object>`  | Returns entries tagged with a given tag (case-insensitive). |

---

## References

| Method                       | Returns                                    | Description                                                |
| ---------------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| `getRefById(id)`             | `{"@type": string, "@id": string} \| null` | Returns a minimal schema ref for an entry by `id`.         |
| `getRefBySchemaId(schemaId)` | `{"@type": string, "@id": string} \| null` | Returns a minimal schema ref for an entry by schema `@id`. |

---

## Use Cases

- Generate structured data for SEO and open-graph pipelines.
- Manage site-wide schema objects for pages, brands, or products.
- Feed JSON-LD into templating systems or static-site generators.
- Maintain a consistent registry of entities across multiple schemas.

## License

Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
