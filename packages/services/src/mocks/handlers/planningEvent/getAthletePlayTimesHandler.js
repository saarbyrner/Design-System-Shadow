import { rest } from 'msw';
import { athletePlayTimesData } from './data.mock';

const handlers = [
  rest.get('/ui/planning_hub/events/122/athlete_play_times', (req, res, ctx) =>
    res(ctx.json([]))
  ),
  rest.get('/ui/planning_hub/events/200/athlete_play_times', (req, res, ctx) =>
    res(ctx.json(athletePlayTimesData))
  ),
];
export { handlers, athletePlayTimesData };
