import isTestEnvironment from '../isTestEnvironment';

describe('isTestEnvironment', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns true when NODE_ENV is "test"', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(isTestEnvironment()).toBe(true);
  });

  it('returns true when CI is defined', () => {
    process.env = {
      ...originalEnv,
      CI: true,
      JEST_WORKER_ID: undefined,
      NODE_ENV: undefined,
    };
    expect(process.env.CI).toBe(true);
    expect(isTestEnvironment()).toBe(true);
  });

  it('returns true when JEST_WORKER_ID is defined', () => {
    process.env = {
      ...originalEnv,
      CI: false,
      JEST_WORKER_ID: '123',
      NODE_ENV: undefined,
    };
    expect(isTestEnvironment()).toBe(true);
  });

  it('returns false when NODE_ENV is not "test" and JEST_WORKER_ID is undefined', () => {
    process.env = {
      ...originalEnv,
      CI: false,
      JEST_WORKER_ID: undefined,
      NODE_ENV: 'development',
    };
    expect(isTestEnvironment()).toBe(false);
  });
});
