import {
  setInjurySurveillancePermissions,
  defaultInjurySurveillancePermissions,
  defaultLogicBuilderPermissions,
  setLogicBuilderPermissions,
} from '..';

describe('Logic Builder Permissions', () => {
  describe('defaultInjurySurveillancePermissions', () => {
    it('has the correct default permissions for logic builder module', () => {
      expect(defaultInjurySurveillancePermissions).toEqual({
        canAdmin: false,
      });
    });
  });
  describe('setInjurySurveillancePermissions', () => {
    it('returns the correct default permissions for logic builder module', () => {
      const result = setInjurySurveillancePermissions();
      expect(result).toEqual(defaultInjurySurveillancePermissions);
    });

    it('returns the correct permissions when injury-surveillance-admin', () => {
      const result = setInjurySurveillancePermissions([
        'injury-surveillance-admin',
      ]);
      expect(result.canAdmin).toEqual(true);
    });
  });

  describe('defaultLogicBuilderPermissions', () => {
    it('has the correct default permissions for logic builder module', () => {
      expect(defaultLogicBuilderPermissions).toEqual({
        canAdmin: false,
      });
    });
  });
  describe('setLogicBuilderPermissions', () => {
    it('returns the correct default permissions for logic builder module', () => {
      const result = setLogicBuilderPermissions();
      expect(result).toEqual(defaultLogicBuilderPermissions);
    });

    it('returns the correct permissions when logic-builder-medical-admin', () => {
      const result = setLogicBuilderPermissions([
        'logic-builder-medical-admin',
      ]);
      expect(result.canAdmin).toEqual(true);
    });
  });
});
