// @flow
import { axios } from '@kitman/common/src/utils/services';

export type WorkloadUnit = {
  id: number,
  name: string,
  description: string,
  perma_id: string,
  unit: ?string,
  min: ?number,
  max: ?number,
  rounding_places: number,
  default: ?number,
};

export type Setlist = {
  metadata: {
    id: number,
    name: string,
    description: string,
    sport_id: number,
    level: string,
  },
  units: Array<WorkloadUnit>,
};

export type EventQuantities = {
  setlist: ?Setlist,
};

const getEventQuantities = async (
  eventType: 'game' | 'session',
  squadId: number
): Promise<EventQuantities> => {
  const bodyData = {
    event_type: eventType,
    squad_id: squadId,
  };

  const { data } = await axios.post('/workloads/events/event_quantities', {
    ...bodyData,
  });

  return data;
};

export default getEventQuantities;
