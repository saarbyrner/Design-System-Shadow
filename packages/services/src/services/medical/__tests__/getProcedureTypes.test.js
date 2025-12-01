import $ from 'jquery';
import { data as mockedProcedureTypesData } from '../../../mocks/handlers/medical/getProcedureTypes';
import getProcedureTypes from '../getProcedureTypes';

describe('getProcedureTypes', () => {
  let getProcedureTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();

    getProcedureTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedProcedureTypesData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getProcedureTypes(22);

    expect(returnedData).toEqual(mockedProcedureTypesData);

    expect(getProcedureTypesRequest).toHaveBeenCalledTimes(1);

    expect(getProcedureTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/medical/procedures/procedure_types',
      data: {
        location_id: 22,
      },
    });
  });
});
