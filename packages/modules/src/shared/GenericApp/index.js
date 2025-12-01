// @flow
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import {
  useGlobalAppBasicLoader,
  type CustomHookReturnType,
} from '@kitman/common/src/hooks/useGlobalAppBasicLoader';

type Props = {
  customHooks: Array<() => CustomHookReturnType>,
  children: React$Element<any>,
};

const GenericApp = ({ customHooks, children }: Props) => {
  const { isLoading, isSuccess, isError } =
    useGlobalAppBasicLoader(customHooks);

  if (isError) {
    return <AppStatus status="error" isEmbed />;
  }

  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }

  if (isSuccess) {
    return children;
  }

  return null;
};

export default GenericApp;
