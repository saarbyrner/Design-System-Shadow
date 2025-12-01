import { axios } from '@kitman/common/src/utils/services';
import createGuardian, { generateCreateGuardiansUrl } from '../createGuardian';

describe('createGuardian service', () => {
  let createGuardianRequest;

  const mockGuardianData = {
    athleteId: 123,
    first_name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
  };

  const mockResponseData = {
    id: 1,
    ...mockGuardianData,
  };

  beforeEach(() => {
    createGuardianRequest = jest.spyOn(axios, 'post').mockResolvedValue({
      data: mockResponseData,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint with the correct payload and returns data', async () => {
    const returnedData = await createGuardian(mockGuardianData);

    expect(returnedData).toEqual(mockResponseData);

    expect(createGuardianRequest).toHaveBeenCalledTimes(1);

    const { athleteId, ...expectedPayload } = mockGuardianData;
    const expectedUrl = generateCreateGuardiansUrl(athleteId);

    expect(createGuardianRequest).toHaveBeenCalledWith(
      expectedUrl,
      expectedPayload
    );
  });
});
