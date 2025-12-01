/* eslint-disable flowtype/require-valid-file-annotation */

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
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
    '@babel/plugin-syntax-dynamic-import',
    '@emotion/babel-plugin',
    '@babel/plugin-proposal-optional-chaining',
  ],
};
