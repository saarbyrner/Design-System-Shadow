// @flow

import { rest } from 'msw';

const data = [
  {
    id: 218031,
    name: 'PS1-Australia',
    from: '30 Jun 2023',
    to: '05 Jul 2023',
  },
  {
    id: 215782,
    name: 'PS2-Cork',
    from: '06 Jul 2023',
    to: '11 Jul 2023',
  },
  {
    id: 216662,
    name: 'IS1-Australia',
    from: '12 Jul 2023',
    to: '20 Jul 2023',
  },
];

const handler = rest.get('/ui/turnarounds', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
