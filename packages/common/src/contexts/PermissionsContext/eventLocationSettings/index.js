// @flow
import type { EventLocationSettingsPermissions } from './types';

export const defaultEventLocationSettingsPermissions: EventLocationSettingsPermissions =
  {
    canCreateEventLocations: false,
    canEditEventLocations: false,
    canArchiveEventLocations: false,
  };

export const setEventLocationSettingsPermissions = (
  permissions: Array<string>
): EventLocationSettingsPermissions => {
  const permissionsSet = new Set(permissions);
  return {
    canCreateEventLocations: permissionsSet.has(
      'create-event-location-settings'
    ),
    canEditEventLocations: permissionsSet.has('edit-event-location-settings'),
    canArchiveEventLocations: permissionsSet.has(
      'archive-event-location-settings'
    ),
  };
};
