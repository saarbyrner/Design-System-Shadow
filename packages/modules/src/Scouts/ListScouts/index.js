// @flow
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

import { ListScoutsAppTranslated as ListScoutsApp } from './src/App';

export default () => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess) {
    return <ListScoutsApp />;
  }

  return null;
};
