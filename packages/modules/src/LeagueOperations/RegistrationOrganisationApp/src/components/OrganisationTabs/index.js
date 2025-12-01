/* eslint-disable camelcase */
// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type {
  RegistrationPermissions,
  HomegrownPermissions,
} from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  TAB_HASHES,
  GRID_TYPES,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

import TabAthleteList from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabAthleteList';
import TabSquadList from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabSquadList';
import TabUserList from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabUserList';
import { TabClubDetailsTranslated as TabClubDetails } from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabClubDetails';
import TabHomegrownList from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabHomegrownList';
import { HomegrownPanelTranslated as HomegrownPanel } from '@kitman/modules/src/LeagueOperations/shared/components/HomegrownPanel';
import TabContainer from '@kitman/modules/src/LeagueOperations/shared/components/TabsContainer';
import type { TabConfig } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import KitsTab from '@kitman/modules/src/KitMatrix/src/components/KitsTab';
import { useLeagueOperations } from '@kitman/common/src/hooks';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

const OrganisationTabs = ({
  registrationPermissions,
  homegrownPermissions,
  organisation_id,
  currentUserType,
}: {
  registrationPermissions: RegistrationPermissions,
  homegrownPermissions: HomegrownPermissions,
  organisation_id: number,
  currentUserType: UserType,
}) => {
  const { isLeague, isOrgSupervised } = useLeagueOperations();
  const { permissions } = usePermissions();
  const { preferences } = usePreferences();
  const tabs: Array<TabConfig> = [
    {
      isPermitted: true,
      label: i18n.t('Club Details'),
      value: TAB_HASHES.clubDetails,
      content: <TabClubDetails preferences={preferences} />,
    },
    {
      isPermitted: registrationPermissions?.organisation?.canView,
      label: i18n.t('Teams'),
      value: TAB_HASHES.teams,
      content: (
        <TabSquadList
          currentUserType={currentUserType}
          gridQueryParams={{
            grid: GRID_TYPES.SQUAD,
          }}
          filterOverrides={{
            organisation_id,
          }}
          gridName={`org(${organisation_id})RegistrationSquadList`}
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
          currentUserType={currentUserType}
          filterOverrides={{
            organisation_ids: [organisation_id],
          }}
          gridQueryParams={{
            grid: GRID_TYPES.ATHLETE,
          }}
          gridName={`org(${organisation_id})RegistrationAthleteList`}
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
            organisation_ids: [organisation_id],
          }}
          gridName={`org(${organisation_id})RegistrationStaffList`}
          enableFiltersPersistence
        />
      ),
    },
    {
      isPermitted:
        preferences?.league_game_kits &&
        permissions?.leagueGame.viewKits &&
        (isLeague || isOrgSupervised),
      label: i18n.t('Kits'),
      value: TAB_HASHES.kits,
      content: <KitsTab />,
    },
    {
      isPermitted:
        Boolean(homegrownPermissions?.canViewHomegrown) &&
        Boolean(preferences?.homegrown),
      label: i18n.t('Homegrown'),
      value: TAB_HASHES.homegrown,
      content: (
        <TabHomegrownList
          gridQueryParams={{
            grid: GRID_TYPES.HOMEGROWN,
          }}
          permissions={homegrownPermissions}
          currentUserType={currentUserType}
          gridName={`org(${organisation_id})RegistrationHomegrownList`}
          enableFiltersPersistence
        />
      ),
    },
  ].filter((tab) => tab.isPermitted);

  return (
    <>
      <TabContainer
        titles={tabs.map(({ isPermitted, label, value }) => ({
          isPermitted,
          label,
          value,
        }))}
        content={tabs}
      />
      <HomegrownPanel />
    </>
  );
};

export default OrganisationTabs;
