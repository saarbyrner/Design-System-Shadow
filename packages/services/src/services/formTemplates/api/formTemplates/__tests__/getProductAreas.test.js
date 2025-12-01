import { axios } from '@kitman/common/src/utils/services';

import { productAreasMock } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/getProductAreas';
import getProductAreas, { GET_PRODUCT_AREAS_URL } from '../getProductAreas';

describe('getProductAreas', () => {
  let getProductAreasRequest;

  beforeEach(() => {
    getProductAreasRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getProductAreas();

    expect(returnedData).toEqual(productAreasMock);
    expect(getProductAreasRequest).toHaveBeenCalledTimes(1);
    expect(getProductAreasRequest).toHaveBeenCalledWith(GET_PRODUCT_AREAS_URL, {
      isInCamelCase: true,
    });
  });
});
