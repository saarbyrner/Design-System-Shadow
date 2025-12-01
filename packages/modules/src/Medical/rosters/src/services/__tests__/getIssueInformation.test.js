import $ from 'jquery';
import getIssueInformation from '../getIssueInformation';

const mockedIssueInformation = { open_issue_count: { open: 10, total: 15 } };

describe('getIssueInformation', () => {
  let getIssueInformationRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getIssueInformationRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedIssueInformation));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getIssueInformation(1);

    expect(returnedData).toEqual(mockedIssueInformation);

    expect(getIssueInformationRequest).toHaveBeenCalledTimes(1);
    expect(getIssueInformationRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/rosters/issue_information',
    });
  });
});
