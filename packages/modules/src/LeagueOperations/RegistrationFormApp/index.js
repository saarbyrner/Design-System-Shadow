// @flow
import useRequirementsParams from '@kitman/modules/src/LeagueOperations/shared/hooks/useRequirementsParams';
import useInitialiseRequirementsForm from '@kitman/modules/src/LeagueOperations/shared/hooks/useInitialiseRequirementsForm';
import { AppStatus } from '@kitman/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import { RegistrationFormAppTranslated as RegistrationFormApp } from './src/App';

export default () => {
  const { isLoading, isError, isSuccess } = useRequirementsParams();
  const {
    isLoading: isRequirementsLoading,
    isError: isRequirementsError,
    isSuccess: isRequirementsSuccess,
  } = useInitialiseRequirementsForm();

  const renderContent = () => {
    if (isError || isRequirementsError) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading || isRequirementsLoading) {
      return <PageLayout.Loading />;
    }
    if (isSuccess && isRequirementsSuccess) {
      return (
        <RegistrationFormApp isLoading={isLoading || isRequirementsLoading} />
      );
    }
    return null;
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};
