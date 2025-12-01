// @flow
import { AppStatus } from '@kitman/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';

import useRequirementsParams from '@kitman/modules/src/LeagueOperations/shared/hooks/useRequirementsParams';
import { RegistrationRequirementsAppTranslated as RegistrationRequirementsApp } from './src/App';

export default () => {
  const { isLoading, isError, isSuccess } = useRequirementsParams();

  const renderContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <PageLayout.Loading />;
    }
    if (isSuccess) {
      return <RegistrationRequirementsApp isLoading={isLoading} />;
    }
    return null;
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};
