import $ from 'jquery';
import getSquadNames from '../../getSquadNames';

describe('getSquadNames', () => {
  it('calls the correct endpoint', async () => {
    const deferred = $.Deferred();
    const mock = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
    await getSquadNames();
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/squads/age_groups',
    });
    jest.restoreAllMocks();
  });
});
