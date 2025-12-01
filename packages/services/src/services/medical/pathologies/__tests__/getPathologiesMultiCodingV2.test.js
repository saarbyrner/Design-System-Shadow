import { axios } from '@kitman/common/src/utils/services';
import { osiics15MockPathologies } from '@kitman/services/src/mocks/handlers/medical/pathologies';
import getPathologiesMultiCodingV2, {
  url,
} from '@kitman/services/src/services/medical/pathologies/getPathologiesMultiCodingV2';

describe('getPathologiesMultiCodingV2 MSW handler', () => {
  it('should fetch pathologies with a search expression and return the data', async () => {
    const searchExpression = 'Coronary artery';

    const result = await getPathologiesMultiCodingV2({ searchExpression });

    expect(result).toEqual([
      osiics15MockPathologies[1],
      osiics15MockPathologies[2],
    ]);
  });
});

describe('getPathologiesMultiCodingV2', () => {
  let request;
  beforeEach(() => {
    request = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch pathologies with a search expression and return the data', async () => {
    const searchExpression = 'test';

    await getPathologiesMultiCodingV2({ searchExpression });

    expect(request).toHaveBeenCalledWith(
      `${url}?search_expression=${searchExpression}`
    );
  });

  it('should fetch pathologies with a search expression and coding system name', async () => {
    const searchExpression = 'test';
    const codingSystemName = 'ICD-10';

    await getPathologiesMultiCodingV2({ searchExpression, codingSystemName });

    expect(request).toHaveBeenCalledWith(
      `${url}?coding_system=${codingSystemName}&search_expression=${searchExpression}`
    );
  });

  it('should reject if the search expression is too short', async () => {
    const searchExpression = 'te'; // Less than 3 characters

    await expect(
      getPathologiesMultiCodingV2({ searchExpression })
    ).rejects.toThrow('Search expression is empty or not long enough');
    expect(request).not.toHaveBeenCalled();
  });

  it('should handle errors correctly', async () => {
    const searchExpression = 'test';
    request.mockRejectedValue(new Error('Failed to fetch pathologies'));

    await expect(
      getPathologiesMultiCodingV2({ searchExpression })
    ).rejects.toThrow('Failed to fetch pathologies');
    expect(request).toHaveBeenCalledWith(
      `${url}?search_expression=${searchExpression}`
    );
  });
});
