import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Grade 0',
    sites: [
      { id: 1, name: 'a - myofascial (peripheral)' },
      { id: 2, name: 'b - myotendinous / muscular' },
      { id: 4, name: 'Unknown' },
    ],
  },
  {
    id: 2,
    name: 'Grade 1',
    sites: [
      { id: 1, name: 'a - myofascial (peripheral)' },
      { id: 2, name: 'b - myotendinous / muscular' },
      { id: 3, name: 'c - tendinous' },
      { id: 4, name: 'Unknown' },
    ],
  },
  {
    id: 3,
    name: 'Grade 2',
    sites: [
      { id: 1, name: 'a - myofascial (peripheral)' },
      { id: 2, name: 'b - myotendinous / muscular' },
      { id: 3, name: 'c - tendinous' },
      { id: 4, name: 'Unknown' },
    ],
  },
  {
    id: 4,
    name: 'Grade 3',
    sites: [
      { id: 1, name: 'a - myofascial (peripheral)' },
      { id: 2, name: 'b - myotendinous / muscular' },
      { id: 3, name: 'c - tendinous' },
      { id: 4, name: 'Unknown' },
    ],
  },
  {
    id: 5,
    name: 'Grade 4',
    sites: [
      { id: 3, name: 'c - tendinous' },
      { id: 4, name: 'Unknown' },
      { id: 5, name: 'Not Applicable' },
    ],
  },
];

const handler = rest.get('ui/medical/bamic_grades', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
