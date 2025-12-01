// @flow
import { rest } from 'msw';
import baseLabelsURL from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/consts';
import type { SearchLabelsResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/searchLabels';
import { data as staffData } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';
import { labelResponse } from './createLabel';

export const additionalLabels = [
  {
    id: 9000,
    name: 'Basketball',
    description: 'Description Basketball',
    color: '#2A6EBB',
    created_by: {
      id: staffData[1].id,
      fullname: staffData[1].fullname,
    },
    created_on: '2024-01-26T20:48:29Z',
  },
  {
    id: 500,
    name: 'Loan Players',
    description: 'Loan player description',
    color: '#43B374',
    created_by: {
      id: staffData[2].id,
      fullname: staffData[2].fullname,
    },
    created_on: '2024-01-24T14:22:01Z',
  },
];
export const paginatedLabelResponse: SearchLabelsResponse = {
  labels: [labelResponse, ...additionalLabels],
  next_id: null,
};

const handler = rest.post(`${baseLabelsURL}/paginated`, (req, res, ctx) =>
  res(ctx.json(paginatedLabelResponse))
);

export default handler;
