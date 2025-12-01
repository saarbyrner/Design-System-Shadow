import $ from 'jquery';
import { getFormations } from '../formations';

const mockedFormations = [
  { id: 1, number_of_players: 10, name: '2-3-3' },
  { id: 2, number_of_players: 11, name: '4-4-2' },
];

describe('getFormations', () => {
  let getFormationsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getFormationsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedFormations));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getFormations();

    expect(returnedData).toEqual(mockedFormations);

    expect(getFormationsRequest).toHaveBeenCalledTimes(1);
    expect(getFormationsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/formations',
    });
  });
});
