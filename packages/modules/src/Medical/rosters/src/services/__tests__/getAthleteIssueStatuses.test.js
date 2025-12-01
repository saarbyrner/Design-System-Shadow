import $ from 'jquery';
import { data as mockedAthleteIssueStatuses } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssueStatuses';
import getAthleteIssueStatuses from '../getAthleteIssueStatuses';

describe('getAthleteIssueStatuses', () => {
  let getAthleteIssueStatusesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getAthleteIssueStatusesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAthleteIssueStatuses));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getAthleteIssueStatuses(1);

    expect(returnedData).toEqual(mockedAthleteIssueStatuses);

    expect(getAthleteIssueStatusesRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteIssueStatusesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/issues/injury_statuses',
    });
  });
});
