// @flow
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { AppStatus } from '@kitman/components';
import PageLayout from '@kitman/modules/src/LeagueOperations/shared/layouts/PageLayout';
import KitMatrixApp from './src/components/App';
import KitManagementApp from './src/components/KitManagementApp';

const KitMatrix = () => {
  // prevent any suspected race conditions
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const renderContent = () => {
    if (hasFailed) {
      return <AppStatus status="error" isEmbed />;
    }
    if (isLoading) {
      return <PageLayout.Loading />;
    }
    if (isSuccess) {
      return window.getFlag('league-ops-kit-management-v2') ? (
        <KitManagementApp />
      ) : (
        <KitMatrixApp />
      );
    }
    return null;
  };

  return renderContent();
};
export default KitMatrix;
