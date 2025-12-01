// @flow
import { axios } from '@kitman/common/src/utils/services';
import { type FormUpdateRequestBody } from '@kitman/services/src/services/humanInput/api/types';
import { type HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';

export const getUpdateRegistrationProfileFormUrl = (userId: number) => {
  return `/registration/users/${userId}/update_profile`;
};

const updateRegistrationProfileForm = async ({
  userId,
  payload,
}: {
  userId: number,
  payload: FormUpdateRequestBody,
}): Promise<HumanInputForm> => {
  const url = getUpdateRegistrationProfileFormUrl(userId);

  const { data } = await axios.put(url, {
    form_answers: payload.answers,
    status: payload.status,
    form_answers_set_id: payload.form_answers_set.id,
  });

  return data;
};

export default updateRegistrationProfileForm;
