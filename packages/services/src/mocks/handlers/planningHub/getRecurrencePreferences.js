import { rest } from 'msw';

const data = {
  preferences: [
    {
      id: 1,
      preference_name: 'Session objectives',
      perma_id: 'session_objectives',
    },
    { id: 2, preference_name: 'Surface type', perma_id: 'surface_type' },
    { id: 3, preference_name: 'Session plan', perma_id: 'session_plan' },
    { id: 4, preference_name: 'Description', perma_id: 'description' },
    { id: 5, preference_name: 'Location', perma_id: 'location' },
    { id: 6, preference_name: 'Athletes', perma_id: 'athletes' },
  ],
};

const handler = rest.get(
  '/ui/planning_hub/events_recurrence_preferences',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
