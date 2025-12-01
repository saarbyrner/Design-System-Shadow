// @flow
import { rest } from 'msw';
import baseLabelsURL from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/consts';
import { data as staffData } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';

export const labelRequest = {
  name: 'My Label',
  color: 'Color',
  description: 'My description',
};

export const labelResponse = {
  ...labelRequest,
  id: 10,
  created_by: { id: staffData[0].id, fullname: staffData[0].fullname },
  created_on: '2024-01-29T20:07:41Z',
};

const handler = rest.post(baseLabelsURL, (req, res, ctx) =>
  res(ctx.json(labelResponse))
);

export default handler;
