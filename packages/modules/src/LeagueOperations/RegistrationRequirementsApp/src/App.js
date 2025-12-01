// @flow
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import {
  getRegistrationProfile,
  getRequirementById,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { RegistrationStatusEnum } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import { getRegistrationUserTypeFactory } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import {
  getDetailsTabTitles,
  getDetailsTabContent,
} from '@kitman/modules/src/LeagueOperations/RegistrationRequirementsApp/utils/index';
import TabContainer from '@kitman/modules/src/LeagueOperations/shared/components/TabsContainer';
import { useFetchIsRegistrationSubmittableQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationRequirementsApi';
import { ProfileHeaderTranslated as RequirementsHeader } from './components/RequirementsHeader';
import ManageSectionPanel from '../../shared/components/ManageSectionPanel';
import { ApproveRegistrationPanelTranslated as ApproveRegistrationPanel } from '../../shared/components/ApproveRegistrationPanel';
import { RegistrationHistoryPanelTranslated as RegistrationHistoryPanel } from '../../shared/components/RegistrationHistoryPanel';

type Props = {
  isLoading: boolean,
};

const RegistrationRequirementsApp = (props: I18nProps<Props>) => {
  const profile = useSelector(getRegistrationProfile);
  const currentUserType: UserType = useSelector(
    getRegistrationUserTypeFactory()
  );

  const currentRequirement = useSelector(getRequirementById());

  const { data, isLoading: isLoadingIsRegistrationSubmittable = false } =
    useFetchIsRegistrationSubmittableQuery(
      {
        requirementId: currentRequirement?.registration_requirement?.id,
        userId: profile?.id,
      },
      {
        skip: !currentRequirement?.registration_requirement?.id || !profile?.id,
      }
    );

  const isRegistrationExternallyManaged = data?.externally_managed ?? false;

  const tabTitles =
    getDetailsTabTitles({
      permissionGroup: profile?.permission_group,
      status: currentRequirement?.status || RegistrationStatusEnum.INCOMPLETE,
      isRegistrationExternallyManaged,
    }) || [];

  const tabContent =
    getDetailsTabContent({
      currentUserType,
      permissionGroup: profile?.permission_group,
      status: currentRequirement?.status || RegistrationStatusEnum.INCOMPLETE,
      isRegistrationExternallyManaged,
    }) || [];

  return (
    <PageLayout>
      <PageLayout.Content>
        {profile && (
          <RequirementsHeader
            isLoading={props.isLoading || isLoadingIsRegistrationSubmittable}
            user={profile}
          />
        )}
        <TabContainer titles={tabTitles} content={tabContent} />
      </PageLayout.Content>
      <ManageSectionPanel />
      <ApproveRegistrationPanel />
      <RegistrationHistoryPanel />
    </PageLayout>
  );
};
export default RegistrationRequirementsApp;

export const RegistrationRequirementsAppTranslated = withNamespaces()(
  RegistrationRequirementsApp
);
