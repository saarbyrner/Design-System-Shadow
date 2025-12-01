// @flow
import { rest } from 'msw';

const data = {
  attachment: {
    url: 'https://someurl.com',
  },
};

const handler = rest.patch('*/attachments/:fileId/confirm', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
