import { rest } from 'msw';

const data = [
  { id: 1, name: 'Left' },
  { id: 2, name: 'Center' },
  { id: 3, name: 'Right' },
  { id: 4, name: 'Bilateral' },
  { id: 5, name: 'N/A' },
];
const handler = rest.get('ui/medical/sides', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
