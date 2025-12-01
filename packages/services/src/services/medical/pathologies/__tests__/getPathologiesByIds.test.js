import { axios } from '@kitman/common/src/utils/services';
import { osiics15MockPathologies } from '@kitman/services/src/mocks/handlers/medical/pathologies';
import getPathologiesByIds, { url } from '../getPathologiesByIds';

describe('getPathologiesByIds', () => {
  let request;

  beforeEach(() => {
    request = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches all pathologies', async () => {
    const result = await getPathologiesByIds();

    expect(request).toHaveBeenCalledWith(url, {
      params: undefined,
    });
    expect(result).toEqual(osiics15MockPathologies);
  });

  it('fetches pathologies with coding system parameter', async () => {
    const codingSystem = 'OSIICS-15';

    await getPathologiesByIds({ codingSystem });

    expect(request).toHaveBeenCalledWith(url, {
      params: {
        coding_system: codingSystem,
      },
    });
  });

  it('fetches pathologies with ids parameter', async () => {
    const ids = [12345, 6654, 9787];

    await getPathologiesByIds({ ids });

    expect(request).toHaveBeenCalledWith(url, {
      params: {
        ids,
      },
    });
  });

  it('fetches pathologies with exclude_custom parameter set to true', async () => {
    const excludeCustom = true;

    await getPathologiesByIds({ excludeCustom });

    expect(request).toHaveBeenCalledWith(url, {
      params: {
        exclude_custom: excludeCustom,
      },
    });
  });

  it('fetches pathologies with exclude_custom parameter set to false', async () => {
    const excludeCustom = false;

    await getPathologiesByIds({ excludeCustom });

    expect(request).toHaveBeenCalledWith(url, {
      params: {
        exclude_custom: excludeCustom,
      },
    });
  });

  it('fetches pathologies with include_attributes parameter set to true', async () => {
    const includeAttributes = true;

    await getPathologiesByIds({ includeAttributes });

    expect(request).toHaveBeenCalledWith(url, {
      params: {
        include_attributes: includeAttributes,
      },
    });
  });

  it('fetches pathologies with include_attributes parameter set to false', async () => {
    const includeAttributes = false;

    await getPathologiesByIds({ includeAttributes });

    expect(request).toHaveBeenCalledWith(url, {
      params: {
        include_attributes: includeAttributes,
      },
    });
  });

  it('fetches pathologies with all parameters', async () => {
    const params = {
      codingSystem: 'OSIICS-15',
      ids: [12345, 6654, 9787],
      excludeCustom: true,
      includeAttributes: true,
    };

    await getPathologiesByIds(params);

    expect(request).toHaveBeenCalledWith(url, {
      params: {
        coding_system: 'OSIICS-15',
        ids: [12345, 6654, 9787],
        exclude_custom: true,
        include_attributes: true,
      },
    });
  });

  it('should not include ids parameter when array is empty', async () => {
    const ids = [];

    await getPathologiesByIds({ ids });

    expect(request).toHaveBeenCalledWith(url, {
      params: undefined,
    });
  });

  it('should handle errors correctly', async () => {
    const params = { codingSystem: 'OSIICS-15' };
    request.mockRejectedValue(new Error('Failed to fetch pathologies'));

    await expect(getPathologiesByIds(params)).rejects.toThrow(
      'Failed to fetch pathologies'
    );
    expect(request).toHaveBeenCalledWith(url, {
      params: {
        coding_system: 'OSIICS-15',
      },
    });
  });
});
