// @flow
import { rest } from 'msw';
import baseLabelsURL from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/consts';
import type { LabelsResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';
import { labelResponse } from './createLabel';
import { additionalLabels } from './searchLabels';

export const labels: LabelsResponse = [labelResponse, ...additionalLabels];

const handler = rest.get(`${baseLabelsURL}`, (req, res, ctx) =>
  res(ctx.json(labels))
);

export default handler;
