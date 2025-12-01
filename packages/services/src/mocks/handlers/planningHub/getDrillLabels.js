// @flow
import { rest } from 'msw';

const data = [
  {
    id: 950,
    name: 'Drill label 1',
    squads: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    archived: false,
  },
  {
    id: 951,
    name: 'Drill label 2',
    squads: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    archived: false,
  },
  {
    id: 952,
    name: 'Drill label 3',
    squads: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    archived: false,
  },
];

const handler = rest.get(
  '/ui/planning_hub/event_activity_drill_labels',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
