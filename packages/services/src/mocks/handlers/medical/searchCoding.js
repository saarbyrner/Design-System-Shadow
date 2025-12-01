import { rest } from 'msw';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';

const data = {
  coding: codingSystemKeys.ICD,
  filter: 'frac',
  results: [
    {
      code: 'S92',
      diagnosis: 'Fracture of foot and toe, except ankle',
      body_part: null,
      pathology_type: null,
      side: null,
    },
    {
      code: 'S928',
      diagnosis: 'Other fracture of foot, except ankle',
      body_part: null,
      pathology_type: null,
      side: null,
    },
  ],
};

const handler = rest.post('/ui/medical/issues/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
