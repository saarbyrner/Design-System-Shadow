import $ from 'jquery';
import data from '@kitman/services/src/mocks/handlers/medical/procedures/data.mock';
import getCurrentProcedure from '../getCurrentProcedure';

describe('getCurrentProcedure', () => {
  let getProceduresRequest;
  const serverResponse = data.procedures[0];

  beforeEach(() => {
    const deferred = $.Deferred();

    getProceduresRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(serverResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getCurrentProcedure(2);

    expect(returnedData).toEqual(serverResponse);

    expect(getProceduresRequest).toHaveBeenCalledTimes(1);

    expect(getProceduresRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: `/medical/procedures/2`,
      contentType: 'application/json',
      data: {
        from_api: true,
      },
    });
  });
});
