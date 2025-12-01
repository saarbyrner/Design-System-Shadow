// @flow
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { getProfile } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationProfileSelectors';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import {
  getDetailsTabTitles,
  getDetailsTabContent,
} from '@kitman/modules/src/LeagueOperations/RegistrationProfileApp/utils/index';
import TabContainer from '@kitman/modules/src/LeagueOperations/shared/components/TabsContainer';

import HeaderLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/HeaderLayout';

import { ProfileHeaderTranslated as ProfileHeader } from './components/ProfileHeader';

type Props = {
  isLoading: boolean,
};

const RegistrationProfileApp = (props: I18nProps<Props>) => {
  const profile = useSelector(getProfile);
  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );

  if (props.isLoading || !profile) {
    return (
      <PageLayout>
        <PageLayout.Content>
          <HeaderLayout.Loading withTabs withAvatar />
        </PageLayout.Content>
      </PageLayout>
    );
  }

  // TODO: Refactor and unify these
  const tabTitles =
    getDetailsTabTitles({ permissionGroup: profile?.permission_group }) || [];
  const tabContent =
    getDetailsTabContent({
      currentUserType,
      profile,
    }) || [];

  return (
    <PageLayout>
      <PageLayout.Content>
        {profile && (
          <ProfileHeader isLoading={props.isLoading} user={profile} />
        )}
        <TabContainer titles={tabTitles} content={tabContent} />
      </PageLayout.Content>
    </PageLayout>
  );
};

export default RegistrationProfileApp;

export const RegistrationProfileAppTranslated = withNamespaces()(
  RegistrationProfileApp
);
