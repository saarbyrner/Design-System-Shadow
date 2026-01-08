const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  babel: {
    presets: [
      '@babel/preset-env',
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      ],
      '@babel/preset-flow',
    ],
    plugins: [
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-syntax-dynamic-import',
      '@emotion/babel-plugin',
    ],
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            // Needed for reslove-url-loader
            sourceMap: true,

          },
        },
      ],
      include: [
        path.resolve(__dirname, '../'),
        path.resolve(__dirname, '../../common/src/styles/'),
      ],
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      tty: require.resolve('tty-browserify'),
      os: require.resolve('os-browserify/browser'),
    };

    // Return the altered config
    return config;
  },
  staticDirs: ['../src'],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
    crossOriginIsolated: false,
  },
  features: {
    buildStoriesJson: true,
  },
};
