// @flow
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import useInitialiseForm from './src/hooks/useInitialiseForm';

import { CreateEditScoutAppTranslated as CreateEditScoutApp } from './src/App';

import { parseFromTypeFromLocation } from '../shared/routes/utils';

export type Mode = 'EDIT' | 'CREATE';

type Props = {
  mode: Mode,
};

export default (props: Props) => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const { id, userType } = parseFromTypeFromLocation(useLocationPathname());

  const {
    isLoading: isFormLoading,
    hasFailed: hasFormFailed,
    isSuccess: isFormSuccess,
  } = useInitialiseForm({ mode: props.mode, id, userType });

  if (hasFailed || hasFormFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading || isFormLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess || isFormSuccess) {
    return <CreateEditScoutApp mode={props.mode} userType={userType} id={id} />;
  }

  return null;
};
