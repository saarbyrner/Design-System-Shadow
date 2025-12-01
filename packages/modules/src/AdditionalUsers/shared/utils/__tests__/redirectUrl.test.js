import { redirectUrl } from '..'; // Update with correct path

describe('redirectUrl', () => {
  describe('side-nav-update is true', () => {
    beforeEach(() => {
      window.featureFlags['side-nav-update'] = true;
    });
    describe('league-ops-additional-users is true', () => {
      beforeEach(() => {
        window.featureFlags['league-ops-additional-users'] = true;
      });
      it('should return "/administration/additional-users when any user type is passed in"', () => {
        const resultOne = redirectUrl('scout');
        expect(resultOne).toBe('/administration/additional_users');
        const resultTwo = redirectUrl('official');
        expect(resultTwo).toBe('/administration/additional_users');
      });
    });

    describe('league-ops-additional-users is false', () => {
      beforeEach(() => {
        window.featureFlags['league-ops-additional-users'] = false;
      });
      it('should return "/administration/scouts" when userType is "scout"', () => {
        const result = redirectUrl('scout');
        expect(result).toBe('/administration/scouts');
      });

      it('should return "/administration/official" when userType is "official"', () => {
        const result = redirectUrl('official');
        expect(result).toBe('/administration/officials');
      });
    });
  });
});
