import { axios } from '@kitman/common/src/utils/services';
import { data } from '../../../mocks/handlers/medical/getDiagnosticResultTypes';
import getDiagnosticResultTypes from '../getDiagnosticResultTypes';

describe('getDiagnosticResultTypes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the correct data', async () => {
    const returnedData = await getDiagnosticResultTypes();
    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await getDiagnosticResultTypes();

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('/medical/locations/result_types');
    });
  });
});
