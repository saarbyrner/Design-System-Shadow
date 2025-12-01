// @flow
import type { Event } from '@kitman/common/src/types/Event';
import type { OfficialsByRole } from '@kitman/modules/src/MatchDay/shared/types';

type EventQueryData = {
  endpointName: string,
  data: {
    event: Event,
  },
};

type GameOfficialsQueryData = {
  endpointName: string,
  data: OfficialsByRole,
};

type Store = {
  planningEventApi: {
    queries: {
      [key: string]: EventQueryData,
    },
  },
  officialsApi: {
    queries: {
      [key: string]: {
        endpointName: string,
        data: OfficialsByRole,
      },
    },
  },
};

export const getEventSelector = (store: Store): Event | null => {
  // $FlowIgnore[incompatible-type] it is correctly typed but Object.values return a mixed type
  const query: EventQueryData | typeof undefined = Object.values(
    store.planningEventApi.queries
  )
    // $FlowIgnore[incompatible-use] endpointName exists at this point
    .find((item) => item.endpointName === 'getPlanningEvent');

  return query?.data?.event ?? null;
};

export const getGameOfficials = (store: Store): OfficialsByRole => {
  // $FlowIgnore[incompatible-type] it is correctly typed but Object.values return a mixed type
  const query: GameOfficialsQueryData | typeof undefined = Object.values(
    store.officialsApi.queries
  )
    // $FlowIgnore[incompatible-use] endpointName exists at this point
    .find((item) => item.endpointName === 'getGameOfficials');

  return query?.data ?? {};
};
