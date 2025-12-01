import { rest } from 'msw';
import { eventLocationsRequestUrl } from '@kitman/services/src/services/planning/getEventLocations';

const commonData = {
  parent_event_location_id: null,
  parents: [],
  created_at: '2023-07-06T14:10:50Z',
  updated_at: '2023-07-06T14:10:50Z',
};

const gameData = [
  {
    id: 13,
    name: 'Game Location',
    ...commonData,
  },
];

const sessionData = [
  {
    id: 21,
    name: 'Session Location',
    ...commonData,
  },
];

const generalData = [...gameData, ...sessionData];

const handler = rest.get(eventLocationsRequestUrl, (req, res, ctx) => {
  return res(ctx.json(generalData));
});

export { handler, gameData, sessionData, generalData };
