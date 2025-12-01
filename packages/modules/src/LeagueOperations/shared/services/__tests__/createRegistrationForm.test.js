/* eslint-disable camelcase */

import { axios } from '@kitman/common/src/utils/services';
import { SAVE_PROGRESS_FEATURE_FLAG } from '@kitman/modules/src/LeagueOperations/shared/consts/index';

import createRegistrationForm from '../createRegistrationForm';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('createRegistrationForm', () => {
  const id = 1;
  const requirement_id = 2;
  const answers = [{ form_element_id: 3, value: 'test' }];
  const form_answers_set_id = 4;
  const response = {
    id: 1,
    status: 'completed',
    user_id: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.featureFlags = { [SAVE_PROGRESS_FEATURE_FLAG]: true };
  });

  it('should call endpoint with the correct payload(form_answers_set_id) when feature flag is enabled', async () => {
    axios.post.mockResolvedValue({ data: response });

    const result = await createRegistrationForm({
      id,
      requirement_id,
      answers,
      form_answers_set_id,
    });

    expect(axios.post).toHaveBeenCalledWith(
      `/registration/users/${id}/registrations/submit`,
      {
        requirement_id,
        answers,
        form_answers_set_id,
      }
    );
    expect(result).toEqual(response);
  });

  it('should call endpoint with the correct payload(without form_answers_set_id ) when feature flag is disabled', async () => {
    window.featureFlags[SAVE_PROGRESS_FEATURE_FLAG] = false;
    axios.post.mockResolvedValue({ data: response });

    const result = await createRegistrationForm({
      id,
      requirement_id,
      answers,
    });

    expect(axios.post).toHaveBeenCalledWith(
      `/registration/users/${id}/registrations/submit`,
      {
        requirement_id,
        answers,
      }
    );
    expect(result).toEqual(response);
  });
});
