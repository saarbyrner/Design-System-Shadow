import { rest } from 'msw';

const data = [
  {
    id: 80,
    name: '1/2 Kneeling Ankle Mobility',
    variations_type: 'sets_reps',
    variations_title: 'Sets x Reps',
    variations_default: {},
    notes: null,
    rehab_category: null,
  },
  {
    id: 91,
    name: '3 Way Ankle',
    variations_type: 'sets_reps',
    variations_title: 'Sets x Reps',
    variations_default: {},
    notes: null,
    rehab_category: null,
  },
  {
    id: 44,
    name: 'Bicep Curls',
    variations_type: 'sets_reps_weight',
    variations_title: 'Sets x Reps x Weight',
    variations_default: {},
    notes: null,
    rehab_category: null,
  },
  {
    id: 127,
    name: 'Bird Dogs',
    variations_type: 'sets_reps',
    variations_title: 'Sets x Reps',
    variations_default: {},
    notes: null,
    rehab_category: null,
  },
];

const handler = rest.post(
  '/ui/medical/rehab/exercises/list',
  async (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
