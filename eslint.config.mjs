import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default [
    {
        ...js.configs.recommended,
        files: ['**/*.{js,mjs,ts,tsx,jsx}'],
        ignores: ['node_modules', 'dist', 'build', '.internal'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                console: true,
                process: true,
            },
        },
        plugins: {
            prettier: prettierPlugin,
            import: importPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            'prettier/prettier': 'error',

            // import plugin rules:
            'import/no-unresolved': 'error',
            'import/named': 'error',
            'import/default': 'error',
            'import/no-duplicates': 'warn',
            'import/order': [
                'warn',
                {
                    groups: [['builtin', 'external', 'internal']],
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
        },
    },
];
