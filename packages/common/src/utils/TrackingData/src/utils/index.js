// @flow
import mixpanel from 'mixpanel-browser';

import type {
  GroupProperties,
  UserProperties,
} from '@kitman/common/src/hooks/useEventTracking';
import { isConnectedToStaging } from '@kitman/common/src/variables/isConnectedToStaging';

type ProjectToken =
  | '81cd1f9b567d00b5d1d92cf1f2d03852'
  | '579bc0e68ab789cdcd8998e8bb16912f';

const MIXPANEL_STAGING_TK = '81cd1f9b567d00b5d1d92cf1f2d03852';
const MIXPANEL_PRODUCTION_TK = '579bc0e68ab789cdcd8998e8bb16912f';

const isLocalEnvironmentConnectedToStaging =
  process.env.NODE_ENV === 'development' && isConnectedToStaging;
const isStaging =
  window.location.hostname.includes('staging') ||
  isLocalEnvironmentConnectedToStaging;
const isProd = process.env.NODE_ENV === 'production' && !isStaging;
const isTest = process.env.NODE_ENV === 'test'; // needed to unit test these utils

const getIsMixpanelEnabled = () => {
  if (window.featureFlags?.['disable-mixpanel-tracking']) return false;
  return [isStaging, isProd, isTest].some(Boolean);
};

const getProjectToken = (): ProjectToken =>
  isProd ? MIXPANEL_PRODUCTION_TK : MIXPANEL_STAGING_TK;

const getMixpanelApi = () =>
  isLocalEnvironmentConnectedToStaging ||
  window.featureFlags?.['single-page-application']
    ? mixpanel
    : window.mixpanel;

export const mixpanelInit = () => {
  if (getIsMixpanelEnabled()) {
    try {
      getMixpanelApi().init(getProjectToken());
    } catch {
      // Empty catch block as we want this to be non-blocking.
      // Will likely improve this to use sentry in future PR.
    }
  }
};

export const mixpanelIdentify = (userId: string) => {
  if (getIsMixpanelEnabled()) {
    try {
      getMixpanelApi().identify(userId);
    } catch {
      // Empty catch block as we want this to be non-blocking.
      // Will likely improve this to use sentry in future PR.
    }
  }
};

// This function is specific to SPA, as page views are tracked automatically in medinah
export const mixpanelTrackPageView = () => {
  if (
    getIsMixpanelEnabled() &&
    window.featureFlags['single-page-application']
  ) {
    try {
      mixpanel.track_pageview();
    } catch {
      // Empty catch block as we want this to be non-blocking.
      // Will likely improve this to use sentry in future PR.
    }
  }
};

export const mixpanelTrack = (eventName: string, metaData: ?{}) => {
  if (getIsMixpanelEnabled()) {
    try {
      getMixpanelApi().track(eventName, metaData);
    } catch {
      // Empty catch block as we want this to be non-blocking.
      // Will likely improve this to use sentry in future PR.
    }
  }
};

export const mixpanelSetProfileProperties = (
  userProperties: UserProperties
) => {
  if (getIsMixpanelEnabled()) {
    try {
      getMixpanelApi().people.set(userProperties);
    } catch {
      // Empty catch block as we want this to be non-blocking.
      // Will likely improve this to use sentry in future PR.
    }
  }
};

export const mixpanelRegister = (groupProperties: GroupProperties) => {
  if (getIsMixpanelEnabled()) {
    try {
      getMixpanelApi().register(groupProperties);
    } catch {
      // Empty catch block as we want this to be non-blocking.
      // Will likely improve this to use sentry in future PR.
    }
  }
};
