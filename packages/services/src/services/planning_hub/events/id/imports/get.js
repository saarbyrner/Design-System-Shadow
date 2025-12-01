// @flow
import { axios } from '@kitman/common/src/utils/services';

export const EVENT_IMPORT_TYPE = Object.freeze({
  CSV: 'CSV',
  'Random Data Generator': 'Random Data Generator',
});
export type EventImportType = $Values<typeof EVENT_IMPORT_TYPE>;

export type EventImport = {
  id: string,
  progress: number,
  // TODO: remove `string` once all the possible values are defined.
  steps: Array<{ stepStatus: 'failed' | string }>,
  // TODO: remove `string` once all the possible values are defined.
  type: EventImportType | string,
  name: string,
  createdAt: string,
  updatedAt: string,
  source: {
    id: number,
    name: string,
    sourceIdentifier: string,
  },
};

export const getEventImports = async (
  eventId: number
): Promise<Array<EventImport>> => {
  const { data } = await axios.get(`/planning_hub/events/${eventId}/imports`, {
    isInCamelCase: true,
  });
  return data;
};
