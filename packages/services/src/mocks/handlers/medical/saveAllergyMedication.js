import { rest } from 'msw';

const data = {
  id: 23,
  athlete_id: 28101,
  allergen: {
    rcopia_id: '8006',
    name: 'Alcohol, Rubbing',
    groups: [{ group_id: '819', name: 'Aliphatic Alcohols' }],
  },
  name: 'Optional Additional Name',
  ever_been_hospitalised: true,
  require_epinephrine: false,
  symptoms: 'Sample symptoms that may exist.',
  severity: 'severe',
  restricted_to_doc: false,
  restricted_to_psych: false,
  diagnosed_on: '2022-10-17',
};

const handler = rest.post('/ui/medical/allergies', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
