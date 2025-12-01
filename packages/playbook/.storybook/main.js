import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

const config = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    {
      name: '@storybook/addon-essentials',
      options: {
        // We dont need the actions addon, so disabling it for now
        // as to not confuse things
        actions: false,
      },
    },
    getAbsolutePath('@storybook/addon-onboarding'),
    // We dont use interactions either for now
    // getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-designs'),
  ],
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
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },
  staticDirs: ['./assets'],
  docs: {
    autodocs: 'tag',
  },
  // TODO - uncomment this to embed @kitman/components in this storybook
  // Docs - https://storybook.js.org/docs/react/sharing/storybook-composition
  // refs: {
  //   components: {
  //     title: '@kitman/components',
  //     url: 'http://localhost:8008/',
  //     expanded: false, // Optional, true by default
  //   },
  // },
};
export default config;
