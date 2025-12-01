// @flow
import { rest } from 'msw';

const response = {
  message: 'Suspension created',
};

const handler = rest.post('/discipine/discipline_reasons', (req, res, ctx) =>
  res(
    ctx.status({
      message: 'Suspension created',
    })
  )
);

export { handler, response };
