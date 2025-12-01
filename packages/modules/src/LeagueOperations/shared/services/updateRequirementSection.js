/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';

export type Args = {
  user_id: number,
  registration_id: number,
  id: number,
  answers: Array<{ form_element_id: number, value: any }>,
};

type Response = {
  message: string,
};

const updateRequirementSection = async ({
  user_id,
  registration_id,
  id,
  answers,
}: Args): Promise<Response> => {
  try {
    const { data } = await axios.put(
      `/registration/registrations/${registration_id}/sections/${id}`,
      {
        user_id,
        answers,
      }
    );
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default updateRequirementSection;
