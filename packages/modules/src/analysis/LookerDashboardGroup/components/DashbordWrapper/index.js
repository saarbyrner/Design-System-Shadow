// @flow
import type { Node } from 'react';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { DelayedLoadingFeedback } from '@kitman/components';

type Props = {
  children: Node,
};

const DashboardWrapper = ({ children }: Props) => {
  const locationAssign = useLocationAssign();
  const { permissions, permissionsRequestStatus } = usePermissions();

  const isLookerDashboardViewPermission =
    permissions?.analysis?.lookerDashboardGroup?.canView;

  if (permissionsRequestStatus === 'PENDING') {
    return <DelayedLoadingFeedback />;
  }

  if (isLookerDashboardViewPermission) {
    return children;
  }

  // redirect to base route if user does not have view access to dashboard
  locationAssign('/');
  return null;
};

export default DashboardWrapper;
