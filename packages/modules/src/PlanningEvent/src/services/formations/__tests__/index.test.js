import $ from 'jquery';
import mockedFormations from '../mock';
import { getFormations } from '..';

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
