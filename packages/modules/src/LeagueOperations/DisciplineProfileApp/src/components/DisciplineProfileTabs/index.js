// @flow
import i18n from '@kitman/common/src/utils/i18n';
import { useSelector } from 'react-redux';
import { TAB_HASHES } from '@kitman/modules/src/LeagueOperations/shared/consts';
import TabContainer from '@kitman/modules/src/LeagueOperations/shared/components/TabsContainer';
import { getProfile } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors';

import type { TabConfig } from '@kitman/modules/src/LeagueOperations/shared/types/tabs';
import { getDisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import type { DisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import { DisciplinaryIssuePanelTranslated as DisciplinaryIssuePanel } from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/DisciplinaryIssuePanel';
import TabSuspensionProfile from '../TabSuspensionProfile';

const DisciplineProfileTabs = () => {
  const profile = useSelector(getProfile);
  const disciplinePermissions: DisciplinePermissions = useSelector(
    getDisciplinePermissions()
  );
  const tabs: Array<TabConfig> = [
    {
      isPermitted: disciplinePermissions.canViewDisciplineAthlete,
      label: i18n.t('Current suspensions'),
      value: TAB_HASHES.currentSuspension,
      content: (
        <>
          <TabSuspensionProfile
            profileId={profile?.id}
            suspensionStatus="current"
          />
          <DisciplinaryIssuePanel userType="athlete" />
        </>
      ),
    },
    {
      isPermitted: disciplinePermissions.canViewDisciplineStaff,
      label: i18n.t('Past suspensions'),
      value: TAB_HASHES.pastSuspension,
      content: (
        <>
          <TabSuspensionProfile
            profileId={profile?.id}
            suspensionStatus="past"
          />
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

export default DisciplineProfileTabs;
