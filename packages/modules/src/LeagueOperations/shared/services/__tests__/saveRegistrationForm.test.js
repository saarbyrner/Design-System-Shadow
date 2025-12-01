import { axios } from '@kitman/common/src/utils/services';
import saveRegistrationForm from '../saveRegistrationForm';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('saveRegistrationForm', () => {
  const args = {
    id: 123,
    requirement_id: 1,
    answers: [{ form_element_id: 1, value: 42 }],
    form_answers_set_id: 456,
  };

  it('should return the correct response when the request succeeds', async () => {
    axios.post.mockResolvedValue({
      data: { id: 1, status: 'draft', user_id: 123 },
    });

    const response = await saveRegistrationForm(args);

    expect(response).toEqual({ id: 1, status: 'draft', user_id: 123 });
    expect(axios.post).toHaveBeenCalledWith(
      `/registration/users/${args.id}/registrations/save_progress`,
      {
        requirement_id: args.requirement_id,
        answers: args.answers,
        form_answers_set_id: args.form_answers_set_id,
      }
    );
  });

  it('should throw an error when the request fails', async () => {
    axios.post.mockRejectedValue(new Error('Request failed'));

    await expect(saveRegistrationForm(args)).rejects.toThrow('Request failed');
  });
});
