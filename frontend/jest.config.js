export default {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  moduleNameMapper: {
'\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/tests/unit/data/fileMock.js' // Mocks static imports (like images) so Jest doesnt crash when parsing non-JS modules
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
