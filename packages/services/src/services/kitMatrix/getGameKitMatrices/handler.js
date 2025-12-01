// @flow
import { rest } from 'msw';
import mock from '@kitman/services/src/services/kitMatrix/searchKitMatrices/mock';

const handler = rest.get(
  '/planning_hub/events/:eventId/game_kit_matrices',
  (req, res, ctx) => res(ctx.json(mock.kit_matrices))
);

export default handler;
