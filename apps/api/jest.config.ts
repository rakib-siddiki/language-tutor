import type { Config } from 'jest';
import { resolve } from 'path';

const config: Config = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['@swc-node/jest', { swcrc: false }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '../../coverage/apps/api',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@language-tutor/shared-types': resolve(__dirname, '../../libs/shared-types/src/index.ts'),
  },
};

export default config;
