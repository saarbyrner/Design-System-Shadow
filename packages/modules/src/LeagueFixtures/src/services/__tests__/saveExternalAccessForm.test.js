import { axios } from '@kitman/common/src/utils/services';
import saveExternalAccessForm from '../saveExternalAccessForm';
import { searchSavedExternalAccessUsers } from '../searchSavedExternalAccessUsers';

jest.mock('axios');

const mockResponseData = {
  id: 1,
  user: {
    id: 1,
    firstname: 'Sanja',
    lastname: 'Soltic',
    fullname: 'Sanja Soltic',
  },
  event: {
    id: 2695214,
    start_date: '2024-10-27T00:00:00Z',
    squad: {
      id: 3512,
      name: 'U16',
    },
  },
  status: 'pending',
  reason: null,
  rejection_reason: null,
  created_at: '2024-11-28T15:24:39Z',
  attachment: null,
  association_external_scout_id: 33,
  is_external: true,
  external_scout: {
    scout_name: 'John',
    scout_surname: 'Doe',
    email: 'john.doe@example.com',
  },
};

const mockResponseSearchingExternalRequests = [
  {
    id: 1,
    association_id: 10,
    scout_name: 'John',
    scout_surname: 'Do',
    email: 'john@email.com',
  },
  {
    id: 2,
    association_id: 10,
    scout_name: 'Jo',
    scout_surname: 'Do',
    email: 'jo.do@email.com',
  },
];
describe('Save External Access Form', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can successfully create a external user request', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: mockResponseData });

    const params = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
    const gameId = 1234;

    const result = await saveExternalAccessForm(params, gameId);
    expect(result).toEqual(mockResponseData);

    expect(axios.post).toHaveBeenCalledWith(
      '/planning_hub/user_event_requests',
      {
        event_id: gameId,
        scout_name: 'John',
        scout_surname: 'Doe',
        email: 'john.doe@example.com',
      }
    );
  });

  it('handles API error', async () => {
    const errorMessage = 'Network Error';
    jest.spyOn(axios, 'post').mockRejectedValue(new Error(errorMessage));

    const params = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    };
    const gameId = 1234;

    await expect(saveExternalAccessForm(params, gameId)).rejects.toThrow(
      errorMessage
    );

    expect(axios.post).toHaveBeenCalledWith(
      '/planning_hub/user_event_requests',
      {
        event_id: gameId,
        scout_name: 'John',
        scout_surname: 'Doe',
        email: 'john.doe@example.com',
      }
    );
  });

  it('can successfully search all external users', async () => {
    jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: mockResponseSearchingExternalRequests });
    const result = await searchSavedExternalAccessUsers();
    expect(result).toEqual(mockResponseSearchingExternalRequests);

    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/association_external_scouts'
    );
  });
});
