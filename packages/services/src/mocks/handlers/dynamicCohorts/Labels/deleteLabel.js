import { rest } from 'msw';
import baseLabelsURL from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/consts';

export const handler = rest.delete(`${baseLabelsURL}/:id`, (req, res, ctx) =>
  res(ctx.json())
);

export default handler;
