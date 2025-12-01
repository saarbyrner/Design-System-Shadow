// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { DisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

import {
  TAB_HASHES,
  GRID_TYPES,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import TabContainer from '@kitman/modules/src/LeagueOperations/shared/components/TabsContainer';
import type { TabConfig } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import TabAthleteDiscipline from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabAthleteDiscipline';
import TabUserDiscipline from '@kitman/modules/src/LeagueOperations/shared/components/Tabs/TabUserDiscipline';
import type { DisciplineSearchParams } from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import DisciplineGrid from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/DisciplineGrid';
import { DisciplinaryIssuePanelTranslated as DisciplinaryIssuePanel } from '../DisciplinaryIssuePanel';

const DisciplineTabs = ({
  disciplinePermissions,
  currentUserType,
  filterOverrides,
}: {
  disciplinePermissions: DisciplinePermissions,
  currentUserType: UserType,
  filterOverrides: $Shape<DisciplineSearchParams>,
}) => {
  const tabs: Array<TabConfig> = [
    {
      isPermitted: disciplinePermissions.canViewDisciplineAthlete,
      label: i18n.t('Players'),
      value: TAB_HASHES.players,
      content: (
        <>
          {window.getFlag('league-ops-discipline-area-v3') ? (
            <DisciplineGrid
              userType="athlete"
              seasonMarkers={filterOverrides?.date_range}
            />
          ) : (
            <TabAthleteDiscipline
              gridQueryParams={{
                grid: GRID_TYPES.ATHLETE_DISCIPLINE,
              }}
              filterOverrides={filterOverrides}
              currentUserType={currentUserType}
              permissions={disciplinePermissions}
            />
          )}
          <DisciplinaryIssuePanel userType="athlete" />
        </>
      ),
    },
    {
      isPermitted: disciplinePermissions.canViewDisciplineStaff,
      label: i18n.t('Staff'),
      value: TAB_HASHES.staff,
      content: (
        <>
          {window.getFlag('league-ops-discipline-area-v3') ? (
            <DisciplineGrid
              userType="staff"
              seasonMarkers={filterOverrides?.date_range}
            />
          ) : (
            <TabUserDiscipline
              gridQueryParams={{
                grid: GRID_TYPES.USER_DISCIPLINE,
              }}
              filterOverrides={filterOverrides}
              currentUserType={currentUserType}
              permissions={disciplinePermissions}
            />
          )}
          <DisciplinaryIssuePanel userType="staff" />
        </>
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

export default DisciplineTabs;
