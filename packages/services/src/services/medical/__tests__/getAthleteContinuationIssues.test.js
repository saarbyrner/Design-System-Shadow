import { axios } from '@kitman/common/src/utils/services';
import data from '@kitman/services/src/mocks/handlers/medical/getAthleteIssues/data.mock';
import getAthleteContinuationIssues, {
  generateEndpointUrl,
} from '../getAthleteContinuationIssues';

const params = {
  athleteId: 1,
  issueType: 'injury',
};

describe('getAthleteContinuationIssues', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the correct data', async () => {
    const returnedData = await getAthleteContinuationIssues(params);
    expect(returnedData).toEqual(data.groupedDetailedEnrichedIssues);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await getAthleteContinuationIssues(params);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        generateEndpointUrl(params.athleteId),
        {
          params: { issue_type: 'injury' },
        }
      );
    });
  });
});
