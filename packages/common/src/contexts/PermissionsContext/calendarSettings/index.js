// @flow
import type { CalendarSettingsPermissions } from './types';

export const defaultCalendarSettingsPermissions: CalendarSettingsPermissions = {
  canArchiveCustomEvents: false,
  canCreateCustomEvents: false,
  canEditCustomEvents: false,
  canEditCustomEventCalendar: false,
  canDeleteCustomEventCalendar: false,
  canCreateCustomEventCalendar: false,
  isSuperAdminCustomEventCalendar: false,
};

export const setCalendarSettingsPermissions = (
  permissions: Array<string>
): CalendarSettingsPermissions => {
  const permissionsSet = new Set(permissions);
  return {
    canArchiveCustomEvents: permissionsSet.has('archive-event-type-settings'),
    canCreateCustomEvents: permissionsSet.has('create-event-type-settings'),
    canEditCustomEvents: permissionsSet.has('edit-event-type-settings'),

    canEditCustomEventCalendar: permissionsSet.has('edit-custom-event'),
    canDeleteCustomEventCalendar: permissionsSet.has('delete-custom-event'),
    canCreateCustomEventCalendar: permissionsSet.has('create-custom-event'),
    isSuperAdminCustomEventCalendar: permissionsSet.has(
      'super-admin-custom-event'
    ),
  };
};
