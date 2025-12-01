import $ from 'jquery';
import { data } from '../../../mocks/handlers/medical/getSides';
import getSides from '../getSides';

describe('getSides', () => {
  let getSidesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getSidesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(data));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getSides();

    expect(returnedData).toEqual(data);

    expect(getSidesRequest).toHaveBeenCalledTimes(1);
    expect(getSidesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/medical/sides',
    });
  });
});
