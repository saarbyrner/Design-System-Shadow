import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { getDetailsTabTitles, getDetailsTabContent } from '..';

['Athlete', 'Staff'].forEach((permissionGroup) => {
  describe(`when ${permissionGroup}`, () => {
    test('it returns the correct titles', () => {
      expect(
        getDetailsTabTitles({
          permissionGroup,
          isRegistrationExternallyManaged: false,
        })
      ).toHaveLength(2);
    });
    test('it returns the correct content', () => {
      expect(
        getDetailsTabContent({
          permissionGroup,
          isRegistrationExternallyManaged: false,
        })
      ).toHaveLength(2);
    });
  });
});

Object.values(RegistrationStatusEnum).forEach((status) => {
  describe(`when ${status}`, () => {
    test('it returns the correct titles', () => {
      expect(
        getDetailsTabTitles({
          permissionGroup: 'Athlete',
          status,
          isRegistrationExternallyManaged: false,
        })
      ).toHaveLength(status === RegistrationStatusEnum.INCOMPLETE ? 1 : 2);
    });
    test('it returns the correct content', () => {
      expect(
        getDetailsTabContent({
          permissionGroup: 'Athlete',
          status,
          isRegistrationExternallyManaged: false,
        })
      ).toHaveLength(status === RegistrationStatusEnum.INCOMPLETE ? 1 : 2);
    });
  });
});

describe('when isRegistrationExternallyManaged is true', () => {
  test('it returns the correct titles', () => {
    expect(
      getDetailsTabTitles({
        permissionGroup: 'Athlete',
        status: RegistrationStatusEnum.APPROVED,
        isRegistrationExternallyManaged: true,
      })
    ).toHaveLength(1);
  });
  test('it returns the correct content', () => {
    expect(
      getDetailsTabContent({
        permissionGroup: 'Athlete',
        status: RegistrationStatusEnum.APPROVED,
        isRegistrationExternallyManaged: true,
      })
    ).toHaveLength(1);
  });
});
