const config = {
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
};

export default config;
