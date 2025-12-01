// @flow
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import useAdditionalUsersForm from '@kitman/modules/src/AdditionalUsers/shared/hooks/useAdditionalUsersForm';
import { CreateEditAdditionalUsersAppTranslated as CreateEditAdditionalUsersApp } from './src/App';

export default () => {
  const { isLoading, hasFailed, isSuccess } = useGlobal();

  const {
    isLoading: isFormLoading,
    hasFailed: hasFormFailed,
    isSuccess: isFormSuccess,
    mode,
    userType,
  } = useAdditionalUsersForm();

  if (hasFailed || hasFormFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading || isFormLoading) {
    return <DelayedLoadingFeedback />;
  }
  if (isSuccess || isFormSuccess) {
    return <CreateEditAdditionalUsersApp mode={mode} userType={userType} />;
  }

  return null;
};
