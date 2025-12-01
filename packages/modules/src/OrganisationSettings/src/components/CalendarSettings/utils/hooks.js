// @flow

import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

export const useGetCalendarSettingsPermissions = () => {
  const {
    permissions: { calendarSettings },
  } = usePermissions();

  return calendarSettings;
};
