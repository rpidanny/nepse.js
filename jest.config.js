const baseConfig = require('./jest-base')

module.exports = {
  ...baseConfig,
  rootDir: '.',
  roots: ['<rootDir>/test', '<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
  testPathIgnorePatterns: ['<rootDir>/src/__mocks__/*'],
  setupFilesAfterEnv: ['./test/setup-test.js'],
  cacheDirectory: '<rootDir>/.cache/unit',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/node_modules/**', '!**/vendor/**'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/nepse/errors',
    '<rootDir>/src/utils/generic-client/errors',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [['lcov', { projectRoot: './' }], 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}
