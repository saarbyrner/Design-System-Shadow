import { axios } from '@kitman/common/src/utils/services';
import postMovementRecord from '../postMovementRecord';

describe('postMovementRecord', () => {
  const args = {
    user_id: 1,
    transfer_type: 'medical_trial',
    join_organisation_ids: [42],
    leave_organisation_ids: [1],
    joined_at: '28/07/1973',
  };

  it('calls the correct URL with the correct HTTP verb and args', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await postMovementRecord(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('/user_movements', {
      user_id: 1,
      transfer_type: 'medical_trial',
      join_organisation_ids: [42],
      leave_organisation_ids: [1],
      joined_at: '28/07/1973',
    });
  });
});
