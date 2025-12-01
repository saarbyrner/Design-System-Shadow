import { axios } from '@kitman/common/src/utils/services';
import { bodyAreasData } from '@kitman/services/src/mocks/handlers/medical/pathologies';
import getBodyAreasMultiCodingV2, { url } from '../getBodyAreasMultiCodingV2';

describe('getBodyAreasMultiCodingV2', () => {
  let request;

  beforeEach(() => {
    request = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch body areas and return the data', async () => {
    const result = await getBodyAreasMultiCodingV2();

    expect(request).toHaveBeenCalledWith(url);
    expect(result).toEqual(bodyAreasData);
  });
});
