// @flow
import { rest } from 'msw';
import {
  mockUploadUrl,
  headers,
} from '@kitman/services/src/mocks/handlers/uploads/putFileToPresignedUrl.mock';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';

const mockPresignedPostUrl = 'https://storageService:9000';
const handlers = [
  rest.put(/\/injpro-staging\/scanning_job.*/, (req, res, ctx) =>
    res(ctx.status(statusCodes.ok))
  ),
  rest.post(mockPresignedPostUrl, (req, res, ctx) => res(ctx.json({}))),
];

export { handlers, mockUploadUrl, mockPresignedPostUrl, headers };
