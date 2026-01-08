import { isScannerIntegrationAllowed } from '../utils';

describe('isScannerIntegrationAllowed', () => {
  afterEach(() => {
    window.featureFlags['medical-mass-scanning'] = false;
    window.featureFlags['scanner-integration'] = false;
    window.organisationSport = '';
  });

  describe('when the medical-mass-scanning feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['medical-mass-scanning'] = true;
      window.featureFlags['scanner-integration'] = false;
      window.organisationSport = '';
    });

    it('returns true', () => {
      expect(isScannerIntegrationAllowed()).toBeTruthy();
    });
  });

  describe('when the scanner-integration feature flag is enabled and the organisation sport is nfl', () => {
    beforeEach(() => {
      window.featureFlags['scanner-integration'] = true;
      window.organisationSport = 'nfl';
    });

    it('returns true', () => {
      expect(isScannerIntegrationAllowed()).toBeTruthy();
    });
  });

  describe('when the scanner-integration feature flag is disable and the organisation sport is nfl', () => {
    beforeEach(() => {
      window.featureFlags['scanner-integration'] = false;
      window.organisationSport = 'nfl';
    });
    it('returns false', () => {
      expect(isScannerIntegrationAllowed()).toBeFalsy();
    });
  });

  describe('when the scanner-integration feature flag is enabled and the organisation sport is not nfl', () => {
    beforeEach(() => {
      window.featureFlags['scanner-integration'] = true;
      window.organisationSport = 'rugby';
    });

    it('returns false', () => {
      expect(isScannerIntegrationAllowed()).toBeFalsy();
    });
  });
});
