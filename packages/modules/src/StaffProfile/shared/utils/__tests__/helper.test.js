import { generateFreshUserPermissions } from '@kitman/modules/src/StaffProfile/shared/utils/helpers';
import { data } from '@kitman/services/src/services/permissions/redux/services/mocks/data/fetchPermissionsDetails';

describe('StaffProfile Helper Utils', () => {
  describe('generateFreshUserPermissions', () => {
    it('generateFreshUserPermissions - general test', () => {
      const dummyModules = [data.modules[0], data.modules[1]];
      const dummySelectedPermissionGroup = data.permission_groups[0];

      const result = generateFreshUserPermissions(
        dummyModules,
        dummySelectedPermissionGroup
      );

      expect(result.alerts['add-alerts']).toEqual(false);
      expect(result.alerts['delete-alerts']).toEqual(false);
      expect(result.alerts['edit-alerts']).toEqual(false);
      expect(result.alerts['view-alerts']).toEqual(true);

      expect(result.analysis['analysis-athlete-view']).toEqual(true);
      expect(result.analysis['analysis-injury-view']).toEqual(true);
      expect(result.analysis['analysis-squad-view']).toEqual(true);
      expect(result.analysis['biomechanical-analysis']).toEqual(false);
      expect(result.analysis['graph-builder']).toEqual(true);
      expect(result.analysis['graph-viewer']).toEqual(true);
      expect(result.analysis['analytical-dashboard-manager']).toEqual(true);
      expect(result.analysis['analytical-dashboard-viewer']).toEqual(true);
    });

    it('generateFreshUserPermissions - no permission test', () => {
      const dummyModules = [data.modules[0], data.modules[1]];
      const dummySelectedPermissionGroup = {
        ...data.permission_groups[0],
        permissions: [],
      };

      const result = generateFreshUserPermissions(
        dummyModules,
        dummySelectedPermissionGroup
      );

      expect(result.alerts['add-alerts']).toEqual(false);
      expect(result.alerts['delete-alerts']).toEqual(false);
      expect(result.alerts['edit-alerts']).toEqual(false);
      expect(result.alerts['view-alerts']).toEqual(false);

      expect(result.analysis['analysis-athlete-view']).toEqual(false);
      expect(result.analysis['analysis-injury-view']).toEqual(false);
      expect(result.analysis['analysis-squad-view']).toEqual(false);
      expect(result.analysis['biomechanical-analysis']).toEqual(false);
      expect(result.analysis['graph-builder']).toEqual(false);
      expect(result.analysis['graph-viewer']).toEqual(false);
      expect(result.analysis['analytical-dashboard-manager']).toEqual(false);
      expect(result.analysis['analytical-dashboard-viewer']).toEqual(false);
    });
  });
});
