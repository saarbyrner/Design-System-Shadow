import $ from 'jquery';
import { data as mockedIssueContactTypes } from '../../../mocks/handlers/medical/getIssueContactTypes';
import getIssueContactTypes from '../getIssueContactTypes';

describe('getIssueContactTypes', () => {
  let getIssueContactTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getIssueContactTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedIssueContactTypes));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getIssueContactTypes();
    expect(returnedData).toEqual(mockedIssueContactTypes);

    expect(getIssueContactTypesRequest).toHaveBeenCalledTimes(1);
    expect(getIssueContactTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/issue_contact_types',
    });
  });
});
