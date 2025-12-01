import $ from 'jquery';
import getPhases from '../getPhases';

const mockedData = [
  {
    id: 2,
    name: 'Attacking',
  },
  {
    id: 3,
    name: 'Defending',
  },
  {
    id: 4,
    name: 'Transition',
  },
];

describe('getPhases', () => {
  let getPhasesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getPhasesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getPhases();

    expect(returnedData).toEqual(mockedData);

    expect(getPhasesRequest).toHaveBeenCalledTimes(1);
    expect(getPhasesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/phases',
    });
  });
});
