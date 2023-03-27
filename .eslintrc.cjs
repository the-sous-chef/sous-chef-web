/** @type {import('eslint').Linter.Config} */
const path = require('path');

module.exports = {
    extends: ['@thesouschef/eslint-config', '@thesouschef/eslint-config-ts', '@thesouschef/eslint-config-react'],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: path.resolve(__dirname, 'tsconfig.json'),
    },
    rules: {
        'import/extensions': 'never',
    },
    settings: {
        'import/resolver': {
            typescript: {
                project: path.resolve(__dirname, 'tsconfig.json'),
            },
        },
    },
};
