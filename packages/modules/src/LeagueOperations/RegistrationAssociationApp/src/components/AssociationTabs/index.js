// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { RegistrationPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

import {
  USER_TYPES,
  TAB_HASHES,
  GRID_TYPES,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import TabAthleteList from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabAthleteList';
import TabUserList from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabUserList';
import TabContainer from '@kitman/modules/src/LeagueOperations/shared/components/TabsContainer';
import TabClubList from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabClubList';

import type { TabConfig } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';

const AssociationTabs = ({
  registrationPermissions,
  currentUserType,
}: {
  registrationPermissions: RegistrationPermissions,
  currentUserType: UserType,
}) => {
  const tabs: Array<TabConfig> = [
    {
      isPermitted:
        registrationPermissions?.organisation?.canView &&
        currentUserType === USER_TYPES.ASSOCIATION_ADMIN,
      label: i18n.t('Clubs'),
      value: TAB_HASHES.clubs,
      content: (
        <TabClubList
          gridQueryParams={{
            grid: GRID_TYPES.ORGANISATION,
          }}
          currentUserType={currentUserType}
          gridName="associationRegistrationClubList"
          enableFiltersPersistence
        />
      ),
    },
    {
      isPermitted: registrationPermissions?.athlete?.canView,
      label: i18n.t('Players'),
      value: TAB_HASHES.players,
      content: (
        <TabAthleteList
          gridQueryParams={{
            grid: GRID_TYPES.ATHLETE,
          }}
          currentUserType={currentUserType}
          gridName="associationRegistrationAthleteList"
          enableFiltersPersistence
        />
      ),
    },
    {
      isPermitted: registrationPermissions?.staff?.canView,
      label: i18n.t('Staff'),
      value: TAB_HASHES.staff,
      content: (
        <TabUserList
          gridQueryParams={{
            grid: GRID_TYPES.STAFF,
          }}
          currentUserType={currentUserType}
          gridName="associationRegistrationStaffList"
          enableFiltersPersistence
        />
      ),
    },
  ].filter((tab) => tab.isPermitted);

  return (
    <TabContainer
      titles={tabs.map(({ isPermitted, label, value }) => ({
        isPermitted,
        label,
        value,
      }))}
      content={tabs}
    />
  );
};

export default AssociationTabs;
