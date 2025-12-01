// @flow

import type { Organisation } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import HeaderAvatar from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/HeaderAvatar';
import BackLink from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout/components/BackLink';
import { useLocationHash } from '@kitman/common/src/hooks';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';

import HomegrownTotal from '@kitman/modules/src/LeagueOperations/shared/components/HomegrownTotal';
import TAB_HASHES from '@kitman/modules/src/LeagueOperations/shared/components/withGridDataManagement/utils';
import ExportButton from '@kitman/modules/src/LeagueOperations/shared/components/ExportButton';
import type { ExportItemType } from '@kitman/modules/src/LeagueOperations/shared/components/ExportButton';

type Props = {
  organisation: Organisation,
};

const OrganisationHeader = ({ organisation }: Props) => {
  const urlParams = useLocationSearch();
  const locationHash = useLocationHash();

  const hasUrlParams: boolean =
    (urlParams && Array.from(urlParams.entries())?.length > 0) || false;

  const isPlayersTab = locationHash === TAB_HASHES.players;

  const {
    permissions: {
      homegrown: { canManageHomegrown },
      registration: {
        payment: { canExportPayment },
      },
    },
  } = usePermissions();
  const { isLeagueStaffUser } = useLeagueOperations();

  const allowedExports: Array<ExportItemType> = [];
  if (canManageHomegrown) {
    allowedExports.push(
      '45-csv',
      '45-pdf',
      '+9-csv',
      '+9-pdf',
      'postformation-csv',
      'postformation-pdf'
    );
  }
  if (canExportPayment) {
    allowedExports.push('payment-csv');
    if (!isLeagueStaffUser) {
      allowedExports.push('payment-pdf');
    }
  }
  return (
    <HeaderLayout withTabs withActions>
      {hasUrlParams && (
        <HeaderLayout.BackBar>
          <BackLink />
        </HeaderLayout.BackBar>
      )}
      <HeaderLayout.Content>
        <HeaderLayout.Avatar>
          <HeaderAvatar
            alt={organisation?.name}
            src={organisation?.logo_full_path}
            variant="large"
          />
        </HeaderLayout.Avatar>
        <HeaderLayout.MainContent>
          <HeaderLayout.TitleBar>
            <HeaderLayout.Title>{`${organisation?.name}`}</HeaderLayout.Title>
            <HeaderLayout.Actions>
              {isPlayersTab && allowedExports?.length > 0 && (
                <ExportButton allowedExports={allowedExports} />
              )}
              <HomegrownTotal />
            </HeaderLayout.Actions>
          </HeaderLayout.TitleBar>
        </HeaderLayout.MainContent>
      </HeaderLayout.Content>
    </HeaderLayout>
  );
};

export default OrganisationHeader;
