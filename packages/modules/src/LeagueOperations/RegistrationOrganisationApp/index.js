// @flow
import useOrganisationId from '@kitman/modules/src/LeagueOperations/shared/hooks/useOrganisationId';

import { AppStatus } from '@kitman/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import GridActionsModal from '@kitman/modules/src/LeagueOperations/shared/components/GridActionsModal';

import { RegistrationOrganisationAppTranslated as RegistrationOrganisationApp } from './src/App';

export default () => {
  const { isLoading, isError, isSuccess } = useOrganisationId();

  const renderContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <PageLayout.Loading />;
    }
    if (isSuccess) {
      return <RegistrationOrganisationApp isLoading={isLoading} />;
    }
    return null;
  };

  return (
    <PageLayout>
      {renderContent()}
      <GridActionsModal />
    </PageLayout>
  );
};
