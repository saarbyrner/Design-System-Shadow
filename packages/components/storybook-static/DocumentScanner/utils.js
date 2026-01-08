// @flow

export const isScannerIntegrationAllowed = () =>
  (window.featureFlags['scanner-integration'] &&
    window.organisationSport === 'nfl') ||
  window.featureFlags['medical-mass-scanning'];
