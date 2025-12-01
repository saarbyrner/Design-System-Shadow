/* eslint-disable no-console */
// @flow
// Documentation: https://kitmanlabs.atlassian.net/wiki/spaces/ENG/pages/352125059/WIP+Feature+Flag+Tracking+and+Management

import * as LDClient from 'launchdarkly-js-client-sdk';
import * as Sentry from '@sentry/browser';

import isTestEnvironment from './isTestEnvironment';
import { type FeatureFlagNames } from './featureFlags';

interface SentryWrapper {
  captureException: (error: any) => void;
}

const getSentryWrapper = (): SentryWrapper => ({
  captureException: (error) => {
    Sentry?.captureException?.(error);
  },
});

export const setupFeatureFlagTracking = () => {
  // We do a first setup here, in case window.getFlag is called before everything is setup to prevent errors
  window.getFlag = (featureFlagName, fallback) => {
    return window.featureFlags?.[featureFlagName] ?? fallback;
  };
};

export const updateFeatureFlagSetupWithUser = () => {
  if (!window.featureFlags?.['use-frontend-ff-sdk']) {
    return;
  }

  if (!window.launchDarklyClientSideId) {
    throw new Error('[LaunchDarkly] Missing client side id');
  }

  if (!Object.keys(window.featureFlagContext ?? {}).length) {
    throw new Error('[LaunchDarkly] Missing context');
  }

  const sentry = getSentryWrapper();

  // LDClient may be already initialized, e.g. during HMR-initiated page refresh.
  if (!window.FFClient) {
    try {
      window.FFClient = LDClient.initialize(
        window.launchDarklyClientSideId,
        window.featureFlagContext
      );
    } catch (error) {
      sentry.captureException(error);
      console.error('Error initializing LaunchDarkly:', error);
      return;
    }
  }

  window.FFClient.on('ready', () => {
    console.log('[LaunchDarkly] LaunchDarkly client ready (Profiler)');
    const client = window.FFClient;
    let flags;

    try {
      // We read the value from the SDK without triggering a tracking event
      flags = client.allFlags();
    } catch (error) {
      console.error('[LaunchDarkly] Error fetching flags', error);
      sentry.captureException(error);
      return;
    }

    window.getFlag = (
      featureFlagName: FeatureFlagNames,
      fallback?: boolean
    ) => {
      if (isTestEnvironment()) {
        return window.featureFlags?.[featureFlagName] ?? fallback;
      }

      const localValue = window.featureFlags?.[featureFlagName];
      let sdkValue = flags?.[featureFlagName];

      if (sdkValue !== localValue) {
        if (
          typeof window.mixpanel?.track === 'function' &&
          !window.featureFlags?.['disable-mixpanel-tracking']
        ) {
          if ([null, undefined].includes(sdkValue)) {
            window.mixpanel.track(
              'LaunchDarkly: Client side SDK may not be enabled',
              {
                featureFlagName,
                sdkValue,
                localValue,
                context: window.featureFlagContext,
              }
            );
          } else {
            window.mixpanel.track('LaunchDarkly: Flag Mismatch', {
              featureFlagName,
              sdkValue,
              localValue,
              context: window.featureFlagContext,
            });
          }
        }
      }

      // We get the value from the SDK, which also triggers a tracking event.
      sdkValue = client?.variation?.(featureFlagName, fallback);
      // When there is a mismatch, we prefer the value from the SDK over the local value.
      return sdkValue;
    };
  });
};
