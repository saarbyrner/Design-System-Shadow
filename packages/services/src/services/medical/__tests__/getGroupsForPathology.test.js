import $ from 'jquery';
import { data } from '@kitman/services/src/mocks/handlers/medical/getGroupsForPathology';
import getGroupsForPathology from '../getGroupsForPathology';

describe('getGroupsForPathology', () => {
  let getGroupsForPathologyRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getGroupsForPathologyRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getGroupsForPathology(
      '011000', // pathologyCode,
      4 // codingSystemId ( 4 = Clinical Impressions in EU infra )
    );

    expect(returnedData).toEqual(data);

    expect(getGroupsForPathologyRequest).toHaveBeenCalledTimes(1);
    expect(getGroupsForPathologyRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/group_identifiers/search?code=011000&coding_system_id=4',
    });
  });
});
