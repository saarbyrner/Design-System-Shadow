import {
  USER_TYPES,
  TAB_HASHES,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import {
  getDetailsTabTitles,
  getDetailsTabContent,
  getProfileTabTitles,
  getProfileTabContent,
} from '..';

const DETAILS_TAB_TITLES = {
  athlete: {
    details: {
      isPermitted: true,
      label: 'Athlete information',
      value: TAB_HASHES.information,
    },
    rosterHistory: {
      isPermitted: true,
      label: 'Roster history',
      value: TAB_HASHES.rosterHistory,
    },
  },
  staff: {
    details: {
      isPermitted: true,
      label: 'Staff information',
      value: TAB_HASHES.information,
    },
  },
};

const PROFILE_TAB_TITLES = {
  profile: {
    isPermitted: true,
    label: 'association_admin details',
    value: 'association_admin details',
  },
  requirements: {
    isPermitted: true,
    label: 'Requirements',
    value: TAB_HASHES.requirements,
  },
};

const DETAILS_TAB_CONTENT = {
  athlete: {
    details: {
      content: expect.any(Object),
      isPermitted: true,
      label: 'Athlete information',
      value: TAB_HASHES.information,
    },
    rosterHistory: {
      content: expect.any(Object),
      isPermitted: true,
      label: 'Roster history',
      value: TAB_HASHES.rosterHistory,
    },
  },
  staff: {
    details: {
      content: expect.any(Object),
      isPermitted: true,
      label: 'Staff information',
      value: TAB_HASHES.information,
    },
  },
};

const PROFILE_TAB_CONTENT = {
  profile: {
    content: expect.any(Object),
    isPermitted: true,
    label: 'association_admin details',
    value: 'association_admin_details',
  },
  requirements: {
    content: expect.any(Object),
    isPermitted: true,
    label: 'Requirements',
    value: TAB_HASHES.requirements,
  },
};

describe('Utils', () => {
  const testDetailsTabTitles = (permissionGroup, expectedTitles) => {
    it(`should return an array of ${permissionGroup} details tab titles`, () => {
      expect(getDetailsTabTitles({ permissionGroup })).toEqual(expectedTitles);
    });
  };

  const testDetailsTabContent = (permissionGroup, expectedContent) => {
    it(`should return an array of ${permissionGroup} details tab content`, () => {
      expect(
        getDetailsTabContent({
          currentUserType: 'association_admin',
          profile: {
            id: 1,
            permission_group: permissionGroup,
          },
        })
      ).toEqual(expectedContent);
    });
  };

  describe('getDetailsTabTitles', () => {
    testDetailsTabTitles('Athlete', [DETAILS_TAB_TITLES.athlete.details]);
    testDetailsTabTitles('Staff', [DETAILS_TAB_TITLES.staff.details]);
  });

  describe('getDetailsTabContent', () => {
    testDetailsTabContent('Athlete', [DETAILS_TAB_CONTENT.athlete.details]);
    testDetailsTabContent('Staff', [DETAILS_TAB_CONTENT.staff.details]);
  });

  describe('getProfileTabTitles', () => {
    it('should return an array of profile tab titles', () => {
      expect(
        getProfileTabTitles({ currentUserType: USER_TYPES.ASSOCIATION_ADMIN })
      ).toEqual([PROFILE_TAB_TITLES.profile, PROFILE_TAB_TITLES.requirements]);
    });
  });

  describe('getProfileTabContent', () => {
    it('should return an array of TabConfig', () => {
      expect(
        getProfileTabContent({ currentUserType: USER_TYPES.ASSOCIATION_ADMIN })
      ).toEqual([
        PROFILE_TAB_CONTENT.profile,
        PROFILE_TAB_CONTENT.requirements,
      ]);
    });
  });
});
