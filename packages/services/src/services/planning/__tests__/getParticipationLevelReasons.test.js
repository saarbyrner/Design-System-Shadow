import $ from 'jquery';
import getParticipationLevelReasons from '../getParticipationLevelReasons';
import { data } from '../../../mocks/handlers/planning/getParticipationLevelReasons';

describe('getParticipationLevelReasons', () => {
  let getParticipationLevelReasonsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getParticipationLevelReasonsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getParticipationLevelReasons();

    expect(returnedData).toEqual(data);

    expect(getParticipationLevelReasonsRequest).toHaveBeenCalledTimes(1);
    expect(getParticipationLevelReasonsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/participation_level_reasons',
    });
  });
});
