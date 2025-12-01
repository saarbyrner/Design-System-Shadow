// @flow
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';

import { AppTranslated as App } from './src/App';

export default () => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess) {
    return <App />;
  }

  return null;
};
