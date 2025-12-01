// @flow
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import { Typography } from '@kitman/playbook/components';
import GridActionsModal from '@kitman/modules/src/LeagueOperations/shared/components/GridActionsModal';

import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type {
  RegistrationPermissions,
  HomegrownPermissions,
} from '@kitman/modules/src/LeagueOperations/shared/types/permissions';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
  getHomegrownPermissions,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import { useLocationHash } from '@kitman/common/src/hooks';
import ExportButton from '@kitman/modules/src/LeagueOperations/shared/components/ExportButton';
import type ExportItemType from '@kitman/modules/src/LeagueOperations/shared/components/ExportButton';
import AssociationTabs from './src/components/AssociationTabs';
import TAB_HASHES from '../shared/components/withGridDataManagement/utils';

const RegistrationAssociationApp = (props: I18nProps<{}>) => {
  const locationHash = useLocationHash();
  const isPlayersTab = locationHash === TAB_HASHES.players;

  const registrationPermissions: RegistrationPermissions = useSelector(
    getRegistrationPermissions()
  );
  const homegrownPermissions: HomegrownPermissions = useSelector(
    getHomegrownPermissions()
  );
  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );
  const isExportHomegrownShown =
    isPlayersTab && homegrownPermissions.canExportHomegrown;

  const allowedExports: Array<ExportItemType> = [];
  if (isExportHomegrownShown) {
    allowedExports.push('homegrown-export');
  }
  if (registrationPermissions?.payment?.canExportPayment) {
    allowedExports.push(['payment-csv']);
  }
  return (
    <PageLayout.Content>
      <PageLayout.Header withTabs>
        <HeaderLayout.Content>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {props.t('Registration')}
          </Typography>
        </HeaderLayout.Content>
        <HeaderLayout.Actions>
          {isPlayersTab && allowedExports?.length > 0 && (
            <ExportButton allowedExports={allowedExports} />
          )}
        </HeaderLayout.Actions>
      </PageLayout.Header>
      <AssociationTabs
        registrationPermissions={registrationPermissions}
        homegrownPermissions={homegrownPermissions}
        currentUserType={currentUserType}
      />
      <GridActionsModal />
    </PageLayout.Content>
  );
};

export const RegistrationAssociationAppTranslated = withNamespaces()(
  RegistrationAssociationApp
);
export default RegistrationAssociationApp;
