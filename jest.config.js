/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/setupTest.ts"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/__tests__/**/*.spec.ts"],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'src/__tests__/coverage',
  coverageReporters: ['text-summary', 'lcov', 'text', 'json-summary'],
  setupFiles: ['reflect-metadata'],
  collectCoverageFrom: [
    'src/modules/users/useCases/**/*UseCase.ts',
    'src/modules/statements/useCases/**/*UseCase.ts',
  ]
};
