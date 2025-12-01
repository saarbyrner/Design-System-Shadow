import { rest } from 'msw';
import { tagAnExercisesResponseData } from './data.mock';

const handler = rest.post(
  '/ui/medical/rehab/session_exercises/tag',
  (req, res, ctx) => res(ctx.json(tagAnExercisesResponseData))
);

export { handler, tagAnExercisesResponseData };
