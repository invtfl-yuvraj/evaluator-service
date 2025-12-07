import path from 'node:path';
import { fileURLToPath } from 'node:url';

import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  // 1) Ignore build + deps
  {
    ignores: ['dist', 'node_modules'],
  },

  // 2) Main config for TypeScript source files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.ts', '.d.ts'],
        },
      },
    },
    rules: {
      // ---------- Core cleanliness ----------
      'no-console':
        process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger':
        process.env.NODE_ENV === 'production' ? 'error' : 'warn',

      // You wanted these as \"warn\"
      'no-var': 'warn',
      'prefer-const': [
        'warn',
        {
          destructuring: 'all',
        },
      ],
      'prefer-arrow-callback': 'warn',

      // ---------- TypeScript rules ----------
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false, // allows async Express handlers
          },
        },
      ],

      // ---------- Import rules ----------
      'import/order': 'off', // use simple-import-sort instead
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'warn',

      // ---------- Import sorting ----------
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // 1. Node builtins
            ['^node:', '^(fs|path|http|https|crypto|os|stream|events)(/|$)'],
            // 2. Packages
            ['^react', '^@?\\w'],
            // 3. Internal aliases (if you add TS paths later)
            ['^@src(/.*|$)', '^@app(/.*|$)', '^@.*'],
            // 4. Parent imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // 5. Same-folder imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // 6. Styles (if any)
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',

      // ---------- Style rules (align with Prettier) ----------
      // Semicolons required
      semi: ['error', 'always'],

      // 2-space indentation
      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
        },
      ],

      'space-before-blocks': ['error', 'always'],
      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],
      'space-infix-ops': 'error',

      // ---------- Prettier integration ----------
      'prettier/prettier': [
        'warn',
        {
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'all',
          printWidth: 100,
        },
      ],
    },
  },

  // 3) Test files override (optional)
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
];
