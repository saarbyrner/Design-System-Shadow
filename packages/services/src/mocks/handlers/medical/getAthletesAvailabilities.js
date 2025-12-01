import { rest } from 'msw';
import { endpoint } from '@kitman/services/src/services/medical/getAthletesAvailabilities';

const data = [
  {
    athlete_id: 275,
    availability_status: 'unavailable',
    days: 0,
    processing_in_progress: false,
  },
  {
    athlete_id: 506,
    availability_status: 'available',
    days: null,
    processing_in_progress: false,
  },
  {
    athlete_id: 594,
    availability_status: 'injured',
    days: 174,
    processing_in_progress: false,
  },
];

const handler = rest.post(endpoint, (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
