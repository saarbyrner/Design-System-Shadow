// @flow
import { AppStatus } from '@kitman/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';

import { RegistrationProfileAppTranslated as RegistrationProfileApp } from './src/App';
import useProfileId from '../shared/hooks/useProfileId';

export default () => {
  const { isLoading, isError, isSuccess } = useProfileId();

  const renderContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <PageLayout.Loading />;
    }
    if (isSuccess) {
      return <RegistrationProfileApp isLoading={isLoading} />;
    }
    return null;
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};
