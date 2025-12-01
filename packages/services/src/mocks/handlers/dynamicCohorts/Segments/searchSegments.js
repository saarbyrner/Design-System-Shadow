// @flow
import { rest } from 'msw';
import baseSegmentsURL from '@kitman/services/src/services/dynamicCohorts/Segments/consts';
import type { PaginatedSegmentsResponse } from '@kitman/services/src/services/dynamicCohorts/Segments/searchSegments';
import { data as staffData } from '@kitman/services/src/mocks/handlers/medical/getStaffUsers';

export const mockSegmentList = [
  {
    id: 1,
    name: 'Segment1',
    created_by: {
      id: staffData[0].id,
      fullname: staffData[0].fullname,
    },
    created_on: '2024-01-26T20:48:29Z',
  },
  {
    id: 2,
    name: 'Segment2',
    created_by: {
      id: staffData[1].id,
      fullname: staffData[1].fullname,
    },
    created_on: '2024-01-27T20:48:29Z',
  },
  {
    id: 3,
    name: 'Segment3',
    created_by: {
      id: staffData[2].id,
      fullname: staffData[2].fullname,
    },
    created_on: '2024-01-28T20:48:29Z',
  },
];

export const paginatedSegmentsResponse: PaginatedSegmentsResponse = {
  segments: mockSegmentList,
  next_id: null,
};

const handler = rest.post(`${baseSegmentsURL}/paginated`, (req, res, ctx) =>
  res(ctx.json(paginatedSegmentsResponse))
);

export default handler;
