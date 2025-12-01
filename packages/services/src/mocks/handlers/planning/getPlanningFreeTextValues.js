import { rest } from 'msw';

const data = {
  event_evaluation_went_well: '<p>Nothing, it went great!</p>',
  event_evaluation_went_wrong: '<p>use weak foot next time!</p>',
  event_objectives: '<p>Stronger. Every. Day.</p>',
  event_notes: '',
};

const handler = rest.get(
  '/planning_hub/events/:eventId/freetext_values',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
