// @flow

export const eventLocationSettingsUrl = '/administration/event_locations';

export const createUpdateEventLocationsUrl = (id: string) =>
  `${eventLocationSettingsUrl}/${id}`;

export default createUpdateEventLocationsUrl;
