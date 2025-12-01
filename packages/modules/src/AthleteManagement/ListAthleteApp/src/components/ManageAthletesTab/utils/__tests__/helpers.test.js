import {
  associationAdminColumns,
  generateAthletePageHref,
  getMuiCols,
  nonAssociationAdminColumns,
  availabilityStatus,
} from '../helpers';

describe('helpers', () => {
  describe('generateAthletePageHref', () => {
    beforeEach(() => {
      window.featureFlags['form-based-athlete-profile'] = false;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('should create default href properly', () => {
      expect(generateAthletePageHref(1)).toEqual('/settings/athletes/1/edit');
    });

    it('should create new athlete profile href properly if form-based-athlete-profile FF is on', () => {
      window.featureFlags['form-based-athlete-profile'] = true;

      expect(generateAthletePageHref(1)).toEqual('/athletes/1/profile');
    });
  });

  describe('getMuiCols', () => {
    it('should return association admin columns', () => {
      expect(getMuiCols(true)).toEqual(associationAdminColumns);
    });

    it('should return non association admin columns', () => {
      expect(getMuiCols(false)).toEqual(nonAssociationAdminColumns);
    });

    it('should return association admin columns when canManageGameStatus is true', () => {
      const associationAdminColumnsWithStatus = [
        ...associationAdminColumns,
        availabilityStatus,
      ];
      expect(getMuiCols(true, false, true)).toEqual(
        associationAdminColumnsWithStatus
      );
    });

    it('should return non association admin columns when canManageGameStatus is true', () => {
      const nonAssociationAdminColumnsWithStatus = [
        ...nonAssociationAdminColumns,
        availabilityStatus,
      ];
      expect(getMuiCols(false, false, true)).toEqual(
        nonAssociationAdminColumnsWithStatus
      );
    });
  });
});
