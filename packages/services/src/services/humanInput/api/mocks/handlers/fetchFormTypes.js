// @flow
import { rest } from 'msw';

import data from '@kitman/services/src/services/humanInput/api/mocks/data/formTypes.mock';

const handler = rest.get('/ui/forms', (req, res, ctx) => res(ctx.json(data)));

export { handler, data };
