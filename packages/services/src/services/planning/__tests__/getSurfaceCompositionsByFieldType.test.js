import { axios } from '@kitman/common/src/utils/services';
import { data as surfaceCompByFieldTypeResponse } from '@kitman/services/src/mocks/handlers/planning/getSurfaceCompositionsByFieldType';
import getSurfaceCompositionsByFieldType from '../getSurfaceCompositionsByFieldType';

describe('getSurfaceCompByFieldType', () => {
  let getSurfaceCompByFieldTypeRequest;

  beforeEach(() => {
    getSurfaceCompByFieldTypeRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: surfaceCompByFieldTypeResponse });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getSurfaceCompositionsByFieldType();
    expect(returnedData).toEqual(surfaceCompByFieldTypeResponse);

    expect(getSurfaceCompByFieldTypeRequest).toHaveBeenCalledTimes(1);
    expect(getSurfaceCompByFieldTypeRequest).toHaveBeenCalledWith(
      '/surface_types'
    );
  });
});
