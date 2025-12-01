import { rest } from 'msw';

const data = {
  athlete_id: 28101,
  type: 'InternalStock',
  drug_type: 'FdbDispensableDrug',
  drug_id: '4',
  stock_lots: [
    {
      id: 2,
      dispensed_quantity: 10,
    },
    {
      id: 3,
      dispensed_quantity: 20,
    },
  ],
  name: 'Drug name',
  prescriber_id: 26486,
  external_prescriber_name: '',
  prescription_date: '2022-02-02T00:00:00Z',
  reason: 'Any reason',
  directions: 'Inhale',
  quantity: '8.5',
  quantity_units: 'gram',
  tapered: false,
  frequency: 'twice a day',
  route: 'inhlusing inhaler',
  start_date: '2022-02-02T00:00:00Z',
  end_date: '2022-02-12T00:00:00Z',
  note: 'My Note 1',
  issues: [
    {
      type: 'InjuryOccurrence',
      id: 1,
    },
    {
      type: 'IllnessOccurrence',
      id: 2,
    },
  ],
};

const handler = rest.post('/ui/medical/medications', (req, res, ctx) =>
  res(ctx.json(data))
);
export { handler, data };
