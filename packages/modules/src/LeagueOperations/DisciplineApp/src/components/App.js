// @flow
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import { useSelector } from 'react-redux';
import {
  getDisciplinePermissions,
  getRegistrationUserTypeFactory,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { DisciplinePermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@kitman/playbook/hooks';

import { DisciplineHeaderTranslated as DisciplineHeader } from './DisciplineHeader';
import { DisciplinaryIssueModalTranslated as DisciplinaryIssueModal } from './DisciplinaryIssueModal';
import DisciplineTabs from './DisciplineTabs';

type Props = {
  seasonDateRange?: Array<string>,
};

const DisciplineApp = ({ seasonDateRange }: Props) => {
  const disciplinePermissions: DisciplinePermissions = useSelector(
    getDisciplinePermissions()
  );
  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );
  const theme = useTheme();
  const isMobileNavigation = useMediaQuery(theme.breakpoints.down('lg'));
  const headerOffset = isMobileNavigation ? 10 : 0;

  return (
    <PageLayout>
      <PageLayout.Content>
        <PageLayout.Header withTabs headerOffset={headerOffset}>
          <DisciplineHeader />
        </PageLayout.Header>
        <DisciplineTabs
          disciplinePermissions={disciplinePermissions}
          currentUserType={currentUserType}
          filterOverrides={{
            date_range: {
              start_date: seasonDateRange?.[0] ?? null,
              end_date: seasonDateRange?.[1] ?? null,
            },
          }}
        />
      </PageLayout.Content>
      <DisciplinaryIssueModal />
    </PageLayout>
  );
};

export default DisciplineApp;
