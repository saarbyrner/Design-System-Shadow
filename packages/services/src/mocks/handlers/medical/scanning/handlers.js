// @flow
import { rest } from 'msw';
import { data as createJobData } from '@kitman/services/src/mocks/handlers/medical/scanning/createJob.mock';
import { jobsUrl } from '@kitman/services/src/services/medical/scanning/createJob';
import { generateSpecificJobUrl } from '@kitman/services/src/services/medical/scanning/splitDocument';
import statusCodes from '@kitman/common/src/variables/httpStatusCodes';

const handlers = [
  rest.post(jobsUrl, (req, res, ctx) => res(ctx.json(createJobData))),
  rest.put(generateSpecificJobUrl(1), (req, res, ctx) =>
    res(ctx.status(statusCodes.ok))
  ),
];

export { handlers, createJobData };
