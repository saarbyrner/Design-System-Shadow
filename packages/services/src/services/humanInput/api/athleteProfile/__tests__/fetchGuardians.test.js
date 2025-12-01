import { axios } from '@kitman/common/src/utils/services';
import fetchGuardians from '../fetchGuardians';

describe('fetchGuardians', () => {
  let fetchFormRequest;

  const mockResponse = {
    guardians: [
      {
        id: 1,
        name: 'John Doe',
        first_name: 'John',
        surname: 'Doe',
        email: 'john.doe@gmail.com',
        created_at: '2023-10-01T12:00:00Z',
      },
    ],
  };
  beforeEach(() => {
    fetchFormRequest = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: mockResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const athleteId = 1;
    const returnedData = await fetchGuardians(athleteId);

    expect(returnedData).toEqual(mockResponse);
    expect(fetchFormRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormRequest).toHaveBeenCalledWith(
      `/athletes/${athleteId}/guardians?include_deleted=false`
    );
  });
});
