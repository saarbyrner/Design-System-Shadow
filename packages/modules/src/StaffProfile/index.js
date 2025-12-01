// @flow

import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { CreateStaffProfileTranslated as CreateStaffProfile } from '@kitman/modules/src/StaffProfile/CreateStaffProfile';
import { EditViewStaffProfileTranslated as EditViewStaffProfile } from '@kitman/modules/src/StaffProfile/EditViewStaffProfile';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import useStaffProfileStructure from './shared/hooks/useStaffProfileStructure';

const StaffProfileApp = () => {
  const locationPathname = useLocationPathname();
  const { isLoading, hasFailed, isSuccess, isUserEditingOwnPermissions } =
    useStaffProfileStructure();

  if (hasFailed) {
    return <AppStatus status="error" isEmbed />;
  }
  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }

  if (isSuccess) {
    if (locationPathname.split('/')[3] !== 'new') {
      return (
        <EditViewStaffProfile
          hidePermissionsTab={isUserEditingOwnPermissions}
        />
      );
    }
    return <CreateStaffProfile />;
  }

  return null;
};

export default () => <StaffProfileApp />;
