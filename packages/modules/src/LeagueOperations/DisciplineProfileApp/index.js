// @flow
import { AppStatus } from '@kitman/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import useDisciplineProfileId from '@kitman/modules/src/LeagueOperations/shared/hooks/useDisciplineProfileId';
import DisciplineProfileApp from './src/App';

export default () => {
  const { isLoading, isError, isSuccess } = useDisciplineProfileId();

  const renderContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <PageLayout.Loading />;
    }
    if (isSuccess) {
      return <DisciplineProfileApp isLoading={isLoading} />;
    }
    return null;
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};
