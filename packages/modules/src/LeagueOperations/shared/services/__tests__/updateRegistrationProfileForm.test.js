import { axios } from '@kitman/common/src/utils/services';
import updateRegistrationProfileForm, {
  getUpdateRegistrationProfileFormUrl,
} from '../updateRegistrationProfileForm';

const params = {
  userId: 1,
  payload: {
    answers: [],
    status: 'completed',
    form_answers_set: { id: 1 },
  },
};

describe('updateRegistrationProfileForm', () => {
  jest.spyOn(axios, 'put').mockResolvedValue(() => {});

  it('should call the correct endpoint', async () => {
    await updateRegistrationProfileForm(params);

    expect(axios.put).toHaveBeenCalledWith(
      getUpdateRegistrationProfileFormUrl(params.userId),
      {
        form_answers: params.payload.answers,
        status: params.payload.status,
        form_answers_set_id: params.payload.form_answers_set.id,
      }
    );
  });
});
