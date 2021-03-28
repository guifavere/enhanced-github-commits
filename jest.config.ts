import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts'],
  setupFilesAfterEnv: ['../jest.setup.ts'],
  globals: {
    chrome: true,
  },
  rootDir: './__tests__',
  testPathIgnorePatterns: ['.cache', 'build', 'node_modules'],
  transformIgnorePatterns: ['node_modules/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};

export default config;
