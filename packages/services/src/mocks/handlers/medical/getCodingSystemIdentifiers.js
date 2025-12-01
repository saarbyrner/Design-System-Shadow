import { rest } from 'msw';

const data = [
  { id: 1, name: 'ICD-10-CM', key: 'icd_10_cm' },
  { id: 2, name: 'OSICS-10', key: 'osics_10' },
  { id: 3, name: 'Datalys', key: 'datalys' },
  { id: 4, name: 'Clinical Impressions', key: 'clinical_impressions' },
];

const handler = rest.get('/ui/medical/coding_systems', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
