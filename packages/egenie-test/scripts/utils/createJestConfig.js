'use strict';

const fs = require('fs');
const chalk = require('chalk');
const paths = require('./paths');

module.exports = (resolve, rootDir) => {
  const config = {
    roots: ['<rootDir>/src'],

    /*
     * The bail config option can be used here to have Jest stop running tests after
     * The first failure.
     */
    bail: false,

    // Indicates whether each individual test should be reported during the run.
    verbose: false,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // The directory where Jest should output its coverage files.
    coverageDirectory: '<rootDir>/coverage/',

    collectCoverageFrom: [],

    setupFiles: fs.existsSync(paths.testsSetup) ? [paths.testsSetup] : [],
    setupFilesAfterEnv: fs.existsSync(paths.testsSetupAfterEnv) ? [paths.testsSetupAfterEnv] : [],
    testMatch: [
      '<rootDir>/src/**/__tests__/*.{js,jsx,ts,tsx}',
      '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    testEnvironment: 'jest-environment-jsdom-fourteen',
    transform: {
      '^.+\\.jsx?$': require.resolve('babel-jest'),
      '^.+\\.tsx?$': require.resolve('ts-jest'),
      '^.+\\.css$': require.resolve('jest-transform-css'),
      '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': resolve('scripts/utils/fileTransform.js'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
      '^.+\\.(less|scss)$',
      '^.+\\.module\\.css$',
    ],
    modulePaths: [],
    moduleNameMapper: {
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.css$': 'identity-obj-proxy',
      '^.+\\.(less|scss)$': 'identity-obj-proxy',
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    moduleFileExtensions: [
      ...paths.moduleFileExtensions,
      'node',
    ].filter((ext) => !ext.includes('mjs')),
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname',
    ],
  };

  if (rootDir) {
    config.rootDir = rootDir;
  }

  const overrides = { ...require(paths.appPackageJson).jest };
  const supportedKeys = [
    'clearMocks',
    'collectCoverageFrom',
    'coveragePathIgnorePatterns',
    'coverageReporters',
    'coverageThreshold',
    'displayName',
    'extraGlobals',
    'globalSetup',
    'globalTeardown',
    'moduleNameMapper',
    'resetMocks',
    'resetModules',
    'restoreMocks',
    'snapshotSerializers',
    'transform',
    'transformIgnorePatterns',
    'watchPathIgnorePatterns',
  ];
  if (overrides) {
    supportedKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        if (Array.isArray(config[key]) || typeof config[key] !== 'object') {
          // for arrays or primitive types, directly override the config key
          config[key] = overrides[key];
        } else {
          // for object types, extend gracefully
          config[key] = {
            ...config[key],
            ...overrides[key],
          };
        }

        delete overrides[key];
      }
    });
    const unsupportedKeys = Object.keys(overrides);
    if (unsupportedKeys.length) {
      const isOverridingSetupFile =
        unsupportedKeys.indexOf('setupFilesAfterEnv') > -1;

      if (isOverridingSetupFile) {
        console.error(
          chalk.red(
            `We detected ${
              chalk.bold('setupFilesAfterEnv')
            } in your package.json.\n\n` +
            `Remove it from Jest configuration, and put the initialization code in ${
              chalk.bold('src/setupTests.js')
            }.\nThis file will be loaded automatically.\n`
          )
        );
      } else {
        console.error(
          chalk.red(
            `${'\nOut of the box, Create React App only supports overriding ' +
            'these Jest options:\n\n'}${
              supportedKeys.map((key) => chalk.bold(`  \u2022 ${key}`)).join('\n')
            }.\n\n` +
            'These options in your package.json Jest configuration ' +
            `are not currently supported by Create React App:\n\n${
              unsupportedKeys.map((key) => chalk.bold(`  \u2022 ${key}`)).join('\n')
            }\n\nIf you wish to override other Jest options, you need to ` +
            `eject from the default setup. You can do so by running ${
              chalk.bold('npm run eject')
            } but remember that this is a one-way operation. ` +
            'You may also file an issue with Create React App to discuss ' +
            'supporting more options out of the box.\n'
          )
        );
      }

      process.exit(1);
    }
  }
  return config;
};
