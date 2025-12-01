import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/getActivityGroups';
import getActivityGroups from '../getActivityGroups';

describe('getActivityGroups', () => {
  let getActivityGroupsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getActivityGroupsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getActivityGroups();

    expect(returnedData).toEqual(data);

    expect(getActivityGroupsRequest).toHaveBeenCalledTimes(1);
    expect(getActivityGroupsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/injuries/activities',
    });
  });
});
