import { rest } from 'msw';

const data = [
  {
    id: 1,
    review_name: 'Test Review',
    organisation_id: 6,
    squad_id: 8,
  },
  {
    id: 2,
    review_name: 'Another Test Review',
    organisation_id: 6,
    squad_id: 8,
  },
];

const handler = rest.get(
  '/athletes/athlete_reviews/find_athlete_review_types',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
