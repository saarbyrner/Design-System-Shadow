/* eslint-disable global-require */
import { defaultSetup } from '../authentification_redirection';

jest.mock('@kitman/common/src/variables/isConnectedToStaging');

describe('authentification_redirection', () => {
  describe('defaultSetup', () => {
    describe('statusCode', () => {
      describe('401', () => {
        let originalEnv;

        beforeEach(() => {
          originalEnv = process.env;

          Object.defineProperty(window, 'location', {
            value: {
              href: '',
              pathname: '',
              port: '3002',
              hostname: 'hostname',
            },
            configurable: true,
            writable: true,
          });

          jest.clearAllMocks();
        });

        afterEach(() => {
          process.env = originalEnv;
        });

        it('redirects a user to the back end’s login page if he isn’t authenticated, it’s a development environment and the port is 3002', () => {
          process.env = { ...originalEnv, NODE_ENV: 'development' };

          defaultSetup.statusCode[401]();

          expect(window.location.href).toEqual(
            'http://hostname:8081/auth/sign_in'
          );
        });

        it('redirects a user to the local SPA’s login page if he isn’t authenticated', () => {
          defaultSetup.statusCode[401]();
          expect(window.location.href).toEqual('/auth/sign_in');
        });

        it('doesn’t redirect a user to the local SPA’s login page if he isn’t authenticated and connected to a custom target URL', async () => {
          // Need to re-import via `require` because isConnectedToStaging is a
          // wrapper around a value from process.env.
          require('@kitman/common/src/variables/isConnectedToStaging').isConnectedToStaging = true;

          defaultSetup.statusCode[401]();

          expect(window.location.href).toEqual('');
        });

        it('redirects a user to the local SPA’s login page if he isn’t authenticated and isn’t connected to a custom target URL', () => {
          // Need to re-import via `require` because isConnectedToStaging is a
          // wrapper around a value from process.env.
          require('@kitman/common/src/variables/isConnectedToStaging').isConnectedToStaging = false;

          defaultSetup.statusCode[401]();

          expect(window.location.href).toEqual('/auth/sign_in');
        });
      });
    });
  });
});
