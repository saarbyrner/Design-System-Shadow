import { axios } from '@kitman/common/src/utils/services';
import { getOpenIssuesForAthleteByDate } from '@kitman/services/src/services/medical';
import { data as responseData } from '@kitman/services/src/mocks/handlers/medical/getOpenIssuesForAthleteByDate';

describe('getOpenIssuesForAthleteByDate', () => {
  let fetchRequest;

  beforeEach(() => {
    fetchRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint with issueDate and returns the correct value', async () => {
    const athleteId = '1';
    const issueDate = '2023-10-10';

    const returnedData = await getOpenIssuesForAthleteByDate(
      athleteId,
      issueDate
    );

    expect(returnedData).toEqual(responseData);

    expect(fetchRequest).toHaveBeenCalledTimes(1);
    expect(fetchRequest).toHaveBeenCalledWith(
      `/athletes/${athleteId}/issues/open_issues_on_date`,
      {
        params: { report_date: issueDate },
      }
    );
  });

  it('handles errors correctly', async () => {
    const errorMessage = 'Network Error';

    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const athleteId = '1';
    const issueDate = '2023-10-10';

    await expect(
      getOpenIssuesForAthleteByDate(athleteId, issueDate)
    ).rejects.toThrow(errorMessage);

    expect(fetchRequest).toHaveBeenCalledTimes(1);
    expect(fetchRequest).toHaveBeenCalledWith(
      `/athletes/${athleteId}/issues/open_issues_on_date`,
      {
        params: { report_date: issueDate },
      }
    );
  });
});
