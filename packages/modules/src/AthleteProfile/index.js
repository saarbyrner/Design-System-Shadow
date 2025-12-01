// @flow

import { AppStatus } from '@kitman/components';
import useFormStructure from '@kitman/modules/src/HumanInput/hooks/useFormStructure';
import { AppTranslated as App } from './src/App';

const AthleteProfileApp = () => {
  const { isLoading, hasFailed, isSuccess } = useFormStructure();

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <AppStatus status="loading" isEmbed message="Loading" />;
  }

  if (isSuccess) {
    return <App />;
  }

  return null;
};

export default () => <AthleteProfileApp />;
