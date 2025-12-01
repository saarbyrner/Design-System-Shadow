// @flow

// Tested indirectly in packages/profiler/src/routes/__tests__/NoRoute.test.js.
export default () => {
  if (
    process.env.NODE_ENV === 'development' &&
    window.location.port === '3002'
  ) {
    /*
     * In developement, the Rails application is located on another port: '8081'
     */
    window.location.port = '8081';
  } else {
    /*
     * In production, reloading the page redirects to the Rails application as
     * it reaches the server instead of react-router.
     */
    window.location.reload();
  }
};
