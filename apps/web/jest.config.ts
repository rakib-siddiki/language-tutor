import { resolve } from 'path';

export default {
  displayName: 'web',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/web',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': resolve(__dirname, 'src/$1'),
    '@language-tutor/shared-types': resolve(__dirname, '../../libs/shared-types/src/index.ts'),
    '@language-tutor/ui': resolve(__dirname, '../../libs/ui/src/index.ts'),
  },
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
};
