// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type {
  UserType,
  User,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type {
  TabTitleConfig,
  TabConfig,
} from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import TabRegistration from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabRegistration';
import TabRosterHistory from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabRosterHistory';

import {
  REGISTRATIONS_GRID_HASHES,
  TAB_HASHES,
  GRID_TYPES,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

export const getDetailsTabTitles = ({
  permissionGroup,
}: {
  permissionGroup: string,
}): Array<TabTitleConfig> => {
  return [
    {
      isPermitted: true,
      label: i18n.t(`{{user}} information`, {
        user: permissionGroup,
        interpolation: { escapeValue: false },
      }),
      value: TAB_HASHES.information,
    },
    {
      isPermitted: false,
      label: i18n.t('Roster history'),
      value: TAB_HASHES.rosterHistory,
    },
  ].filter((tab) => tab.isPermitted);
};

export const getDetailsTabContent = ({
  currentUserType,
  profile,
}: {
  currentUserType: UserType,
  profile: User,
}): Array<TabConfig> => {
  const label = i18n.t(`{{user}} information`, {
    user: profile.permission_group,
    interpolation: { escapeValue: false },
  });
  const gridParam = {
    grid: REGISTRATIONS_GRID_HASHES[profile.permission_group],
  };

  return [
    {
      isPermitted: true,
      label,
      value: TAB_HASHES.information,
      content: (
        <TabRegistration
          currentUserType={currentUserType}
          gridQueryParams={gridParam}
          title={label}
        />
      ),
    },
    {
      isPermitted: false,
      label: i18n.t('Roster history'),
      value: TAB_HASHES.rosterHistory,
      content: (
        <TabRosterHistory
          currentUserType={currentUserType}
          gridQueryParams={{
            grid: GRID_TYPES.ROSTER_HISTORY,
          }}
          filterOverrides={{
            id: profile.id,
          }}
        />
      ),
    },
  ].filter((tab) => tab.isPermitted);
};

export const getProfileTabTitles = ({
  currentUserType,
}: {
  currentUserType: UserType,
}): Array<TabTitleConfig> => {
  return [
    {
      isPermitted: true,
      label: i18n.t(`{{userType}} details`, {
        userType: currentUserType,
      }),
      value: i18n.t(`{{userType}} details`, {
        userType: currentUserType,
      }),
    },
    {
      isPermitted: true,
      label: i18n.t('Requirements'),
      value: 'requirements',
    },
  ].filter((tab) => tab.isPermitted);
};

export const getProfileTabContent = ({
  currentUserType,
}: {
  currentUserType: UserType,
}): Array<TabConfig> => {
  return [
    {
      isPermitted: true,
      label: i18n.t(`{{userType}} details`, {
        userType: currentUserType,
      }),
      value: i18n.t(`{{userType}}_details`, {
        userType: currentUserType,
      }),
      content: <h1>Profile Details</h1>,
    },
    {
      isPermitted: true,
      label: i18n.t('Requirements'),
      value: TAB_HASHES.requirements,
      content: <h1>Requirements</h1>,
    },
  ].filter((tab) => tab.isPermitted);
};
