import $ from 'jquery';
import { data as mockedProceduresData } from '../../../mocks/handlers/medical/getProceduresFormData';
import getProceduresFormData from '../getProceduresFormData';

describe('getProceduresFormData', () => {
  let getProceduresFormDataRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getProceduresFormDataRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedProceduresData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getProceduresFormData({
      onlyDefaultLocations: true,
    });

    expect(returnedData).toEqual(mockedProceduresData);

    expect(getProceduresFormDataRequest).toHaveBeenCalledTimes(1);

    expect(getProceduresFormDataRequest).toHaveBeenCalledWith({
      method: 'GET',
      data: { only_default_locations: true },
      url: '/ui/procedures/form_data',
    });
  });
});
