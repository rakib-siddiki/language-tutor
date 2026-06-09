const { workspaceRoot } = require('@nx/devkit');

module.exports = {
  resolver: '@nx/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageReporters: ['html'],
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc-node/jest',
      {
        swcrc: true,
        swcrcRoots: [workspaceRoot],
      },
    ],
  },
  moduleNameMapper: {
    '@language-tutor/shared-types': '<rootDir>/../../libs/shared-types/src/index.ts',
    '@language-tutor/ui': '<rootDir>/../../libs/ui/src/index.ts',
  },
};
