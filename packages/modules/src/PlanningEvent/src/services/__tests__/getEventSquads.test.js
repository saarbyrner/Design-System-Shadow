import $ from 'jquery';
import getEventSquads from '../getEventSquads';

const mockedEventSquads = {
  squads: [
    {
      id: 1,
      name: 'Squad 1',
      position_groups: [
        {
          id: 1,
          name: 'Position group 1',
          positions: [
            {
              id: 1,
              name: 'Position 1',
              abbreviation: 'FW',
              athletes: [
                {
                  id: 1,
                  fullname: 'John Doe',
                  firstname: 'John',
                  lastname: 'Doe',
                  shortname: 'J. Doe',
                  user_id: 58615,
                  avatar_url: 'avatar_url',
                  availability: 'injured',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  selected_athletes: [1, 2, 3],
};

describe('getEventSquads', () => {
  let getEventSquadsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getEventSquadsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedEventSquads));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventSquads(1);

    expect(returnedData).toEqual(mockedEventSquads);

    expect(getEventSquadsRequest).toHaveBeenCalledTimes(1);
    expect(getEventSquadsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/planning_hub/events/1/squads?include_availability=true&include_position_abbreviation=true',
      timeout: 40000,
    });
  });
});
