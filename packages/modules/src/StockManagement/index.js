// @flow
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { StockListContextProvider } from './src/contexts/StockListContextProvider';
import App from './src/App';

const StockManagementApp = () => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess) {
    return (
      <StockListContextProvider>
        <App />
      </StockListContextProvider>
    );
  }

  return null;
};

export default StockManagementApp;
