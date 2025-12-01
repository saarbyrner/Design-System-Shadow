// @flow
import { rest } from 'msw';

import { data } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_athlete_list';

const handler = rest.get(
  '/registration/athletes/645235245664daf0f8fccc44',
  (req, res, ctx) => res(ctx.json(data[0]))
);

export { handler, data };
