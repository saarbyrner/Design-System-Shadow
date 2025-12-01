// @flow
import { AppStatus } from '@kitman/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import useDiscipline from '../shared/hooks/useDiscipline';
import App from './src/components/App';

export default () => {
  const { isLoading, isError, isSuccess, seasonDateRange } = useDiscipline();

  const renderContent = () => {
    if (isError) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <PageLayout.Loading />;
    }
    if (isSuccess) {
      return <App seasonDateRange={seasonDateRange} />;
    }
    return null;
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};
