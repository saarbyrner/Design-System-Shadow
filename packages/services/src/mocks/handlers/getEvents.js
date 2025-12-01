import { rest } from 'msw';

import { emptyRecurrence } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';

const mockData = [
  {
    id: 1,
    squad_sessions: 'true',
    individual_sessions: 'false',
    planned_workloads: 'false',
    games: 'true',
    treatments: 'false',
    rehab: 'false',
    custom_events: 'false',
    athlete_ids: [],
    start: '2023-06-26T00:00:00+01:00',
    end: '2023-08-07T00:00:00+01:00',
    recurrence: { ...emptyRecurrence },
  },
];

const handler = rest.post('/calendar/events', (req, res, ctx) =>
  res(ctx.json(mockData))
);

export { handler, mockData };
