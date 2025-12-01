// @flow
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import type {
  UserType,
  Organisation,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { getOrganisation } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationOrganisationSelectors';
import type {
  RegistrationPermissions,
  HomegrownPermissions,
} from '@kitman/modules/src/LeagueOperations/shared/types/permissions';

import {
  getRegistrationPermissions,
  getRegistrationUserTypeFactory,
  getHomegrownPermissions,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';
import OrganisationTabs from './components/OrganisationTabs';
import OrganisationHeader from './components/OrganisationHeader';

type Props = {
  isLoading: boolean,
};

const RegistrationOrganisationApp = (props: I18nProps<Props>) => {
  const organisation: Organisation = useSelector(getOrganisation);
  const registrationPermissions: RegistrationPermissions = useSelector(
    getRegistrationPermissions()
  );
  const homegrownPermissions: HomegrownPermissions = useSelector(
    getHomegrownPermissions()
  );
  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );

  if (props.isLoading || !organisation) {
    return (
      <PageLayout>
        <PageLayout.Content>
          <HeaderLayout.Loading withTabs withAvatar />
        </PageLayout.Content>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageLayout.Content>
        <OrganisationHeader organisation={organisation} />
        <OrganisationTabs
          registrationPermissions={registrationPermissions}
          homegrownPermissions={homegrownPermissions}
          organisation_id={organisation?.id}
          currentUserType={currentUserType}
        />
      </PageLayout.Content>
    </PageLayout>
  );
};

export default RegistrationOrganisationApp;

export const RegistrationOrganisationAppTranslated = withNamespaces()(
  RegistrationOrganisationApp
);
