import $ from 'jquery';
import getAthleteIssue from '../getAthleteIssue';

describe('getAthleteIssue', () => {
  let getAthleteIssueRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = { issue_id: 1 };

    getAthleteIssueRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint when the issue is an injury', async () => {
    const returnedData = await getAthleteIssue(1, 20, 'Injury');

    expect(returnedData).toEqual({ issue_id: 1 });

    expect(getAthleteIssueRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteIssueRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/athletes/1/injuries/20',
      data: {
        detailed: true,
        scope_to_org: true,
        include_occurrence_type: true,
      },
    });
  });

  it('calls the correct endpoint when the issue is an illness', async () => {
    const returnedData = await getAthleteIssue(1, 20, 'Illness');

    expect(returnedData).toEqual({ issue_id: 1 });

    expect(getAthleteIssueRequest).toHaveBeenCalledTimes(1);
    expect(getAthleteIssueRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/athletes/1/illnesses/20',
      data: {
        detailed: true,
        scope_to_org: true,
        include_occurrence_type: true,
      },
    });
  });
});
