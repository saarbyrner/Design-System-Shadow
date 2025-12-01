import $ from 'jquery';
import getGameAndTrainingOptions from '../getGameAndTrainingOptions';

describe('getGameAndTrainingOptions', () => {
  let getGameAndTrainingOptionsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    const data = {
      games: [
        {
          game_date: '2021-04-14T00:00:00+01:00',
          name: 'International Squad vs Samoa (14/04/2021) 15-8',
          value: 39139,
        },
        {
          game_date: '2021-03-17T00:00:00+00:00',
          name: 'International Squad vs Australia (17/03/2021) 50-20',
          value: 38628,
        },
      ],
      training_sessions: [
        {
          name: 'Conditioning (04/05/2021)',
          value: 505729,
        },
      ],
    };

    getGameAndTrainingOptionsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getGameAndTrainingOptions('1', '2022-02-16');

    expect(returnedData).toEqual({
      games: [
        {
          game_date: '2021-04-14T00:00:00+01:00',
          name: 'International Squad vs Samoa (14/04/2021) 15-8',
          value: 39139,
        },
        {
          game_date: '2021-03-17T00:00:00+00:00',
          name: 'International Squad vs Australia (17/03/2021) 50-20',
          value: 38628,
        },
      ],
      training_sessions: [
        {
          name: 'Conditioning (04/05/2021)',
          value: 505729,
        },
      ],
    });

    expect(getGameAndTrainingOptionsRequest).toHaveBeenCalledTimes(1);
    expect(getGameAndTrainingOptionsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/athletes/1/injuries/game_and_training_options',
      data: {
        date: '2022-02-16',
        scope_to_org: true,
        detailed_view: false,
        strict_date_match: false,
      },
    });
  });

  it('requests detailed view when required', async () => {
    await getGameAndTrainingOptions('1', '2022-02-16', true, true);
    expect(getGameAndTrainingOptionsRequest).toHaveBeenCalledTimes(1);
    expect(getGameAndTrainingOptionsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/athletes/1/injuries/game_and_training_options',
      data: {
        date: '2022-02-16',
        scope_to_org: true,
        detailed_view: true,
        strict_date_match: true,
      },
    });
  });
});
