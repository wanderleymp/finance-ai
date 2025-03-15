module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testRegex: '.*\.(test|spec)\.ts$',
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
