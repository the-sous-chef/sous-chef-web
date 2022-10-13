const path = require('path');

module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2022: true,
    },
    extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
    ],
    ignorePatterns: ['.eslintrc.cjs'],
    overrides: [
        {
            files: ['*.js', '*.cjs', 'vite.*', 'vitest.config.ts', 'vitest/**/*'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
                'import/no-named-default': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaVersion: 13,
        ecmaFeatures: {
            jsx: true,
        },
        project: path.resolve(__dirname, 'tsconfig.json'),
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import', 'react', 'prettier'],
    rules: {
        'import/extensions': [
            'error',
            {
                json: 'always',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'import/prefer-default-export': 'off',
        // indent: 'off',
        // Override airbnb's max line length rule to:
        // - increase the line length limit to 120
        // - Set tab width to 4 spaces
        // - also ignore import statements and class inheritance
        // 'max-len': [
        //     'error',
        //     120,
        //     4,
        //     {
        //         ignorePattern: '^import [^,]+ from |^export | implements',
        //         ignoreUrls: true,
        //         ignoreComments: false,
        //         ignoreRegExpLiterals: true,
        //         ignoreStrings: true,
        //         ignoreTemplateLiterals: true,
        //     },
        // ],
        'newline-after-var': ['error', 'always'],
        'no-confusing-arrow': ['error', { allowParens: false }],
        'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
        'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
        'react/jsx-sort-props': [
            'error',
            {
                callbacksLast: true,
                ignoreCase: true,
                noSortAlphabetically: false,
                shorthandFirst: true,
            },
        ],
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        // '@typescript-eslint/indent': ['error', 4],
    },
    settings: {
        react: {
            pragma: 'React',
            version: 'detect',
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
            typescript: {
                alwaysTryTypes: true,
                project: path.resolve(__dirname, 'tsconfig.json'),
            },
        },
    },
};
