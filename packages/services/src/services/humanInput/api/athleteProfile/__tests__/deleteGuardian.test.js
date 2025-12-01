import { axios } from '@kitman/common/src/utils/services';
import deleteGuardian, { generateDeleteGuardiansUrl } from '../deleteGuardian';

describe('deleteGuardian service', () => {
  let deleteGuardianRequest;

  const mockGuardianData = {
    athleteId: 123,
    id: 1,
  };

  const mockResponseData = { id: 1 };

  beforeEach(() => {
    deleteGuardianRequest = jest.spyOn(axios, 'delete').mockResolvedValue({
      data: mockResponseData,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns a success response', async () => {
    const returnedData = await deleteGuardian(mockGuardianData);

    expect(returnedData).toEqual(mockResponseData);

    expect(deleteGuardianRequest).toHaveBeenCalledTimes(1);

    const expectedUrl = generateDeleteGuardiansUrl(
      mockGuardianData.athleteId,
      mockGuardianData.id
    );

    expect(deleteGuardianRequest).toHaveBeenCalledWith(expectedUrl);
  });
});
