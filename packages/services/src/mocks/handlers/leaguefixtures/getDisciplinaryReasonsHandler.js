import { rest } from 'msw';

const data = [
  { id: 1, penalty_card: 'yellow_card', description: 'Foul' },
  { id: 2, penalty_card: 'yellow_card', description: 'Backtalk' },
  {
    id: 3,
    penalty_card: 'red_card',
    description:
      'Denying the opposing team a goal or an obvious goal-scoring opportunity by a handball offence (except a goalkeeper within their penalty area).',
  },
  {
    id: 4,
    penalty_card: 'red_card',
    description:
      "Denying a goal or an obvious goal-scoring opportunity to an opponent whose overall movement is towards the offender's goal by an offence punishable by a free kick (unless as outlined below).",
  },
];

const handler = rest.get(
  '/ui/planning_hub/game_disciplinary_reasons',
  (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
