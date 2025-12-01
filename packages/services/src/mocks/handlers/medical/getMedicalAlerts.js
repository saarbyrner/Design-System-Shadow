import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Sickle Cell',
  },
  {
    id: 2,
    name: 'Asthma',
  },
  {
    id: 3,
    name: 'High BP',
  },
  {
    id: 4,
    name: 'Low BP',
  },
  {
    id: 5,
    name: 'MRSA',
  },
  {
    id: 6,
    name: 'Seizure disorder/epilepsy',
  },
  {
    id: 7,
    name: 'Cancer hx',
  },
  {
    id: 8,
    name: 'Diabetes',
  },
  {
    id: 9,
    name: 'IBS',
  },
  {
    id: 10,
    name: 'IBD',
  },
  {
    id: 11,
    name: 'Chron’s',
  },
  {
    id: 12,
    name: 'Abnormal liver function',
  },
  {
    id: 13,
    name: 'Gall bladder disease',
  },
  {
    id: 14,
    name: 'Pancreatitis',
  },
  {
    id: 15,
    name: 'Kidney injury',
  },
  {
    id: 16,
    name: 'Single paired organ',
  },
  {
    id: 17,
    name: 'Frequent migraines',
  },
  {
    id: 18,
    name: 'Solitary testicle',
  },
  {
    id: 19,
    name: 'Solitary kidney',
  },
  {
    id: 20,
    name: 'Hearing loss',
  },
  {
    id: 21,
    name: 'G6PD deficiency',
  },
  {
    id: 22,
    name: 'Contact lenses',
  },
  {
    id: 23,
    name: 'Staph hx',
  },
  {
    id: 24,
    name: 'Chronic Splenomegaly',
  },
  {
    id: 25,
    name: 'Cardia',
  },
  {
    id: 26,
    name: 'Chronic Dehydration',
  },
];

const handler = rest.get('/ui/medical/medical_alerts', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
