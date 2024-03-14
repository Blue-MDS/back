module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/', 
    '/tests/',
    'src/index.js',
    'src/.*/route\\.js',
  ],
  collectCoverageFrom: ['src/**/*.js'],
  testMatch: ['**/tests/**/*.test.js']
};
