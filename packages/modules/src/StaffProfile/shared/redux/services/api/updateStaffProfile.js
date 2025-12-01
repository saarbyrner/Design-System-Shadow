// @flow

import { axios } from '@kitman/common/src/utils/services';
import type {
  HumanInputForm,
  ValueTypes,
} from '@kitman/modules/src/HumanInput/types/forms';

export type Answer = {
  form_element_id: number,
  value: ValueTypes,
};

type FormAnswersSet = {
  id: number,
};

export type RequestBody = {
  form_answers_set: FormAnswersSet,
  answers: Array<Answer>,
};

type UpdateAthleteProfile = {
  staffId: number,
  requestBody: RequestBody,
};

const updateAthleteProfile = async (
  props: UpdateAthleteProfile
): Promise<HumanInputForm> => {
  const { staffId, requestBody } = props;

  try {
    const { data } = await axios.put(
      `/administration/staff/${staffId}`,
      requestBody
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default updateAthleteProfile;
