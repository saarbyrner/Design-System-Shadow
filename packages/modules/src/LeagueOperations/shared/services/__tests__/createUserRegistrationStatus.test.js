import { axios } from '@kitman/common/src/utils/services';
import createUserRegistrationStatus from '../createUserRegistrationStatus';
import mockResponse from '../mocks/data/mock_create_user_registration_status';
import { RegistrationStatusEnum } from '../../types/common';

describe('createUserRegistrationStatus', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: mockResponse,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user registration status', async () => {
    const payload = {
      status: RegistrationStatusEnum.APPROVED,
      annotation: 'test',
      registration_system_status_id: 1,
      reason_id: 1,
    };

    const response = await createUserRegistrationStatus({
      userId: 1,
      userRegistrationId: 1,
      payload,
    });

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), payload);
    expect(response).toEqual(mockResponse);
  });
});
