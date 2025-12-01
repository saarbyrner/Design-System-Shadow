import * as Sentry from '@sentry/browser';
import * as LDClient from 'launchdarkly-js-client-sdk';
import {
  setupFeatureFlagTracking,
  updateFeatureFlagSetupWithUser,
} from '../featureFlagTracking';
import isTestEnvironment from '../isTestEnvironment';

jest.mock('@sentry/browser');
jest.mock('launchdarkly-js-client-sdk');
jest.mock('../isTestEnvironment');

describe('Feature Flag Tracking', () => {
  let consoleErrorSpy;

  const initLDClient = (opts = {}) => {
    const mockClient = {
      on: jest.fn((event, callback) => {
        if (event === 'ready') callback();
      }),
      allFlags: opts.throwError
        ? jest.fn().mockImplementation(() => {
            throw new Error('something went wrong');
          })
        : jest.fn().mockReturnValue(opts.flags ?? {}),
      variation: jest.fn().mockReturnValue(!!opts.variation),
    };

    LDClient.initialize.mockReturnValue(mockClient);
    return mockClient;
  };

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    isTestEnvironment.mockReturnValue(false);
    global.window = {
      Sentry: {
        captureException: jest.fn(),
      },
    };
    Sentry.captureException.mockImplementation((error) => {
      if (window.Sentry?.captureException) {
        window.Sentry.captureException(error);
      }
    });
  });

  afterEach(() => {
    global.window.featureFlags = undefined;
    global.window.FFClient = undefined;
    global.window.featureFlagContext = undefined;
    global.window.launchDarklyClientSideId = undefined;
    global.window.mixpanel = undefined;
    consoleErrorSpy.mockRestore();
    LDClient.initialize.mockReset();
  });

  describe('setupFeatureFlagTracking', () => {
    it('sets up the initial window.getFlag method', () => {
      setupFeatureFlagTracking();
      expect(typeof window.getFlag).toBe('function');
    });

    it('returns the feature flag from window.featureFlags if present', () => {
      global.window.featureFlags = { testFlag: true };
      setupFeatureFlagTracking();
      const result = window.getFlag('testFlag');
      expect(result).toBe(true);
    });

    it('returns fallback value if flag is not present', () => {
      setupFeatureFlagTracking();
      const result = window.getFlag('nonExistentFlag', false);
      expect(result).toBe(false);
    });

    it('returns undefined if flag is not present and no fallback provided', () => {
      setupFeatureFlagTracking();
      const result = window.getFlag('nonExistentFlag');
      expect(result).toBeUndefined();
    });
  });

  describe('updateFeatureFlagSetupWithUser', () => {
    it('does nothing if "use-frontend-ff-sdk" is false', () => {
      global.window.featureFlags = { 'use-frontend-ff-sdk': false };
      updateFeatureFlagSetupWithUser();
      expect(LDClient.initialize).not.toHaveBeenCalled();
    });

    it('throws error if launchDarklyClientSideId is missing', () => {
      global.window.featureFlags = { 'use-frontend-ff-sdk': true };

      expect(() => {
        updateFeatureFlagSetupWithUser();
      }).toThrow('[LaunchDarkly] Missing client side id');
    });

    it('throws error if featureFlagContext is missing', () => {
      global.window.featureFlags = { 'use-frontend-ff-sdk': true };
      global.window.launchDarklyClientSideId = '123456789';

      expect(() => {
        updateFeatureFlagSetupWithUser();
      }).toThrow('[LaunchDarkly] Missing context');
    });

    it('initializes LaunchDarkly client with proper context', () => {
      const mockClient = initLDClient({
        flags: { testFlag: true },
        variation: true,
      });

      global.window.featureFlags = { 'use-frontend-ff-sdk': true };
      global.window.launchDarklyClientSideId = '123456789';
      global.window.featureFlagContext = { kind: 'user', key: '123' };

      updateFeatureFlagSetupWithUser();

      expect(LDClient.initialize).toHaveBeenCalledWith('123456789', {
        kind: 'user',
        key: '123',
      });

      global.window.FFClient = mockClient;
      mockClient.on.mock.calls[0][1]();

      expect(typeof window.getFlag).toBe('function');
    });

    it('doesn’t initialize LaunchDarkly if it’s already initialized', () => {
      global.window.featureFlags = { 'use-frontend-ff-sdk': true };
      global.window.launchDarklyClientSideId = '123456789';
      global.window.featureFlagContext = { kind: 'user', key: '123' };
      global.window.FFClient = {
        on: jest.fn(),
      };

      updateFeatureFlagSetupWithUser();

      expect(LDClient.initialize).not.toHaveBeenCalled();
    });

    it('captures exceptions when initialization fails', () => {
      global.window.featureFlags = { 'use-frontend-ff-sdk': true };
      global.window.launchDarklyClientSideId = '123456789';
      global.window.featureFlagContext = { kind: 'user', key: '123' };

      LDClient.initialize.mockImplementation(() => {
        throw new Error('Initialization error');
      });

      updateFeatureFlagSetupWithUser();

      expect(Sentry.captureException).toHaveBeenCalledWith(
        new Error('Initialization error')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error initializing LaunchDarkly:',
        new Error('Initialization error')
      );
    });
  });

  describe('getFlag behavior after initialization', () => {
    beforeEach(() => {
      isTestEnvironment.mockReturnValue(false);
      global.window.featureFlags = {
        'use-frontend-ff-sdk': true,
        testFlag: true,
      };
      global.window.launchDarklyClientSideId = '123456789';
      global.window.featureFlagContext = { kind: 'user', key: '123' };
    });
    describe('Mixpanel tracking for flag mismatches', () => {
      beforeEach(() => {
        global.window.mixpanel = {
          track: jest.fn(),
        };
      });

      it('tracks "LaunchDarkly: Flag Mismatch" when SDK and local values differ', () => {
        const mockClient = initLDClient({
          flags: { testFlag: false }, // sdkValue
          variation: false,
        });
        updateFeatureFlagSetupWithUser();

        global.window.FFClient = mockClient;
        mockClient.on.mock.calls[0][1]();

        const result = window.getFlag('testFlag', false);
        expect(result).toBe(false); // sdkValue is used

        expect(window.mixpanel.track).toHaveBeenCalledWith(
          'LaunchDarkly: Flag Mismatch',
          {
            featureFlagName: 'testFlag',
            sdkValue: false,
            localValue: true,
            context: { kind: 'user', key: '123' },
          }
        );
      });

      it('tracks "LaunchDarkly: Client side SDK may not be enabled" when SDK flag is missing', () => {
        const mockClient = initLDClient({
          flags: { anotherFlag: true }, // testFlag is missing
          variation: false,
        });
        updateFeatureFlagSetupWithUser();

        global.window.FFClient = mockClient;
        mockClient.on.mock.calls[0][1]();

        window.getFlag('testFlag', false);

        expect(window.mixpanel.track).toHaveBeenCalledWith(
          'LaunchDarkly: Client side SDK may not be enabled',
          {
            featureFlagName: 'testFlag',
            sdkValue: undefined,
            localValue: true,
            context: { kind: 'user', key: '123' },
          }
        );
      });

      it('does not track mismatch if mixpanel tracking is disabled via feature flag', () => {
        global.window.featureFlags['disable-mixpanel-tracking'] = true;
        const mockClient = initLDClient({
          flags: { testFlag: false },
          variation: false,
        });
        updateFeatureFlagSetupWithUser();

        global.window.FFClient = mockClient;
        mockClient.on.mock.calls[0][1]();

        window.getFlag('testFlag', false);

        expect(window.mixpanel.track).not.toHaveBeenCalled();
      });
    });
    it('falls back to window.featureFlags in test environment', () => {
      isTestEnvironment.mockReturnValue(true);
      const mockClient = initLDClient({
        flags: { testFlag: false },
        variation: false,
      });

      updateFeatureFlagSetupWithUser();

      global.window.FFClient = mockClient;
      mockClient.on.mock.calls[0][1]();

      const result = window.getFlag('testFlag', false);
      expect(result).toBe(true);
    });

    it('captures exceptions when error occurs fetching all flags', () => {
      const mockClient = initLDClient({ throwError: true });

      updateFeatureFlagSetupWithUser();

      global.window.FFClient = mockClient;
      mockClient.on.mock.calls[0][1]();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[LaunchDarkly] Error fetching flags',
        new Error('something went wrong')
      );
      expect(Sentry.captureException).toHaveBeenCalledWith(
        new Error('something went wrong')
      );
    });

    it('does not throw error or track if mixpanel is not available', () => {
      global.window.mixpanel = undefined;
      const mockClient = initLDClient({
        flags: { testFlag: false },
        variation: false,
      });
      updateFeatureFlagSetupWithUser();

      global.window.FFClient = mockClient;
      mockClient.on.mock.calls[0][1]();

      expect(() => window.getFlag('testFlag', false)).not.toThrow();
    });
  });
});
