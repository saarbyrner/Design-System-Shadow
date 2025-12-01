import { rest } from 'msw';
import { GET_INJURY_ONSET_URL } from '@kitman/services/src/services/medical/getInjuryOnset';

const data = [
  { id: 3, name: 'Acute' },
  { id: 7, name: 'Repetitive' },
  { id: 8, name: 'Unknown' },
  { id: 6, name: 'Other', require_additional_input: true },
];

const handler = rest.get(GET_INJURY_ONSET_URL, (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
