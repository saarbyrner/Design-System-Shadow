// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { RegistrationPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  TAB_HASHES,
  GRID_TYPES,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import TabContainer from '@kitman/modules/src/LeagueOperations/shared/components/TabsContainer';

import TabAthleteList from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabAthleteList';
import TabUserList from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabUserList';
import { TabSquadDetailsTranslated as TabSquadDetails } from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabSquadDetails';
import type { TabConfig } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';

const SquadTabs = ({
  registrationPermissions,
  squadId,
  currentUserType,
}: {
  registrationPermissions: RegistrationPermissions,
  squadId: number,
  currentUserType: UserType,
}) => {
  const tabs: Array<TabConfig> = [
    {
      isPermitted: registrationPermissions.organisation.canView,
      label: i18n.t('Team Details'),
      value: TAB_HASHES.teamDetails,
      content: <TabSquadDetails />,
    },
    {
      isPermitted: registrationPermissions?.athlete?.canView,
      label: i18n.t('Players'),
      value: TAB_HASHES.players,
      content: (
        <TabAthleteList
          currentUserType={currentUserType}
          filterOverrides={{
            squad_ids: [squadId],
          }}
          gridQueryParams={{
            grid: GRID_TYPES.ATHLETE,
          }}
          gridName={`squad(${squadId})RegistrationAthleteList`}
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
          currentUserType={currentUserType}
          gridQueryParams={{
            grid: GRID_TYPES.STAFF,
          }}
          filterOverrides={{
            squad_id: squadId,
          }}
          gridName={`squad(${squadId})RegistrationStaffList`}
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

export default SquadTabs;
