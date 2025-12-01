import { axios } from '@kitman/common/src/utils/services';
import updateGuardian, { generateUpdateGuardiansUrl } from '../updateGuardian';

describe('updateGuardian service', () => {
  let updateGuardianRequest;

  const mockGuardianData = {
    athleteId: 123,
    id: 1,
    first_name: 'Jane',
    surname: 'Doe',
    email: 'jane.doe@example.com',
  };

  const mockResponseData = {
    id: 1,
    first_name: 'Jane',
    surname: 'Doe',
    email: 'jane.doe@example.com',
  };

  beforeEach(() => {
    updateGuardianRequest = jest.spyOn(axios, 'put').mockResolvedValue({
      data: mockResponseData,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint with the correct payload and returns data', async () => {
    const returnedData = await updateGuardian(mockGuardianData);

    expect(returnedData).toEqual(mockResponseData);

    expect(updateGuardianRequest).toHaveBeenCalledTimes(1);

    const { athleteId, id, ...expectedPayload } = mockGuardianData;
    const expectedUrl = generateUpdateGuardiansUrl(athleteId, id);

    expect(updateGuardianRequest).toHaveBeenCalledWith(
      expectedUrl,
      expectedPayload
    );
  });
});
