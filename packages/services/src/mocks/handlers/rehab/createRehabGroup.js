import { rest } from 'msw';
import { tagData } from './data.mock';

const handler = rest.post('/tags', (req, res, ctx) => res(ctx.json(tagData)));

export { handler, tagData };
