const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

delete compilerOptions.paths['dist/*'];

module.exports = {
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],
    preset: 'ts-jest/presets/js-with-ts',
    // gitlab CI only accepts JUnit-style testing reports, so output to a junit file in addition to default reporting
    reporters: ['default', 'jest-junit'],
    setupFilesAfterEnv: ['<rootDir>jest/setupTests.js'],
};
