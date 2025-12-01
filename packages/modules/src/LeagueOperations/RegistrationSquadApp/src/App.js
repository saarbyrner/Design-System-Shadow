// @flow
import type { Node } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type {
  UserType,
  Squad,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { getSquad } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationSquadSelectors';
import type { RegistrationPermissions } from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';

import { SquadHeaderTranslated as SquadHeader } from './components/SquadHeader';
import SquadTabs from './components/SquadTabs';

type Props = {
  isLoading: boolean,
};

const RegistrationSquadApp = (props: I18nProps<Props>) => {
  const squad: Squad | null = useSelector(getSquad);

  const registrationPermissions: RegistrationPermissions = useSelector(
    getRegistrationPermissions()
  );
  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );

  const renderContent = (): Node => {
    if (props.isLoading || !squad) return <></>;

    return (
      <SquadTabs
        registrationPermissions={registrationPermissions}
        squadId={squad?.id}
        currentUserType={currentUserType}
      />
    );
  };

  return (
    <PageLayout>
      <PageLayout.Content>
        <PageLayout.Header withTabs>
          {squad && <SquadHeader squad={squad} />}
        </PageLayout.Header>
        {renderContent()}
      </PageLayout.Content>
    </PageLayout>
  );
};

export default RegistrationSquadApp;

export const RegistrationSquadAppTranslated =
  withNamespaces()(RegistrationSquadApp);
