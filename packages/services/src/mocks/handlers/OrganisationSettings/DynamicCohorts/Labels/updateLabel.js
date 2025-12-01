// @flow
import { rest } from 'msw';
import baseLabelsURL from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/consts';
import { labelResponse } from './createLabel';

const handler = rest.patch(
  `${baseLabelsURL}/${labelResponse.id}`,
  (req, res, ctx) => res(ctx.json(labelResponse))
);

export default handler;
