import { rest } from 'msw';

const data = {
  id: 24,
  directions: 'apply',
  dose: '1',
  dose_units: null,
  frequency: '2',
  route: 'via j-tube',
  duration: 1,
  tapered: false,
};

const handler = rest.post(`/ui/medical/medication_favorites`, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
