// @flow

// eslint-disable-next-line import/no-mutable-exports
export let isConnectedToStaging = false;
// If isConnectedToStaging would be defined as
// const isConnectedToStaging = Boolean(process.env.REACT_APP_TARGET);
// it would be evaluated on this file import causing Capybara tests to fail.
// Optionally chaining its value, like process?.env..., could help, but in our
// production gulp build file webpack is configured in the way so it replaces
// literal string ‘process.env.REACT_APP_TARGET’ with ‘''’ by exact match,
// meaning any discrepancies from the literal string prevent the replacement
// and hence leave a reference to `process` as-is causing an error since it’s
// not available in browsers.
try {
  isConnectedToStaging = Boolean(process.env.REACT_APP_TARGET);
  // eslint-disable-next-line no-empty
} catch {}
