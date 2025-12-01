// @flow

const isTestEnvironment = () => {
  return !!(
    process.env.NODE_ENV === 'test' ||
    process.env.CI ||
    process.env.JEST_WORKER_ID
  );
};

export default isTestEnvironment;
