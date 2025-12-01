import updateUserRegistrationStatus from '../updateUserRegistrationStatus';
import data from '../mocks/data/mock_update_user_registration_status';

describe('updateUserRegistrationStatus', () => {
  it('should update the user registration status', async () => {
    const response = await updateUserRegistrationStatus({
      userId: 1,
      registrationId: 1,
      payload: {
        annotation: 'Bad behaviour',
        registration_status_id: 1,
        registration_status_reason_id: 1,
      },
    });

    expect(response).toEqual(data);
  });
});
