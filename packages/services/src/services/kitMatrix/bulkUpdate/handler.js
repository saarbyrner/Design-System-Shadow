// @flow
import { rest } from 'msw';

const handler = rest.patch(
  '/planning_hub/kit_matrices/bulk_update',
  (res, ctx) => {
    return res(ctx.status(204));
  }
);

export const mockResponse = {
  data: {
    message: 'Kit matrices bulk updated successfully',
  },
};

export default handler;
