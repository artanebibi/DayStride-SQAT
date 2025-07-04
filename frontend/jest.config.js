export default {
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.js',
        // '<rootDir>/tests/integration/in-the-small/setupTests.js' // MSW setup
    ],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest'
    },
    moduleNameMapper: {
        '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/tests/unit/mocks/fileMock.js' // Mocks static imports (like images) so Jest doesnt crash when parsing non-JS modules
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};