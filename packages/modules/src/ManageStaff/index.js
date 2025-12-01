// @flow

import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import useListStaffProfilesStructure from '@kitman/modules/src/StaffProfile/shared/hooks/useStaffProfileStructure';

const ManageStaffApp = () => {
  const { isLoading, hasFailed, isSuccess } = useListStaffProfilesStructure();

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }

  if (isSuccess) {
    return <>TODO: Manage Staff</>;
  }

  return null;
};

export default () => <ManageStaffApp />;
