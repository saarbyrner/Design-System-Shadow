import {
  data as submission,
  response,
} from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_homegrown_list';
import createHomegrownSubmission from '../createHomegrownSubmission';

describe('createHomegrownSubmission', () => {
  it('calls the correct create homegrown submission endpoint and returns the correct value', async () => {
    const returnedData = await createHomegrownSubmission(submission[0]);
    expect(returnedData).toEqual(response);
  });
});
