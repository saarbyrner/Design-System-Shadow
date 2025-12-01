import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Advil Cold and Sinus 30 mg-200 mg tablet',
    dispensable_drug_id: '431391',
    med_strength: '30-200',
    med_strength_unit: 'mg',
    dose_form_desc: 'tablet',
    route_desc: 'oral',
    drug_name_desc: 'Advil Cold and Sinus',
  },
  {
    id: 5,
    name: 'Advil 200 mg tablet',
    dispensable_drug_id: '259181',
    med_strength: '200',
    med_strength_unit: 'mg',
    dose_form_desc: 'tablet',
    route_desc: 'oral',
    drug_name_desc: 'Advil',
  },
  {
    id: 9,
    name: 'Advil Liqui-Gel 200 mg capsule',
    dispensable_drug_id: '289798',
    med_strength: '200',
    med_strength_unit: 'mg',
    dose_form_desc: 'capsule',
    route_desc: 'oral',
    drug_name_desc: 'Advil Liqui-Gel',
  },
  {
    id: 11,
    name: 'Advil Migraine 200 mg capsule',
    dispensable_drug_id: '292728',
    med_strength: '200',
    med_strength_unit: 'mg',
    dose_form_desc: 'capsule',
    route_desc: 'oral',
    drug_name_desc: 'Advil Migraine',
  },
];

const handler = rest.get(
  '/medical/fdb/search_dispensable_drugs',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
