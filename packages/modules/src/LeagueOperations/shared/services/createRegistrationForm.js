// @flow
/* eslint-disable camelcase */
import { axios } from '@kitman/common/src/utils/services';
import type { RegistrationStatus } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { ValueTypes } from '@kitman/modules/src/HumanInput/types/forms';
import { SAVE_PROGRESS_FEATURE_FLAG } from '@kitman/modules/src/LeagueOperations/shared/consts/index';

type Response = {
  id: number,
  status: RegistrationStatus,
  user_id: number,
};

type Answer = {
  form_element_id: number,
  value: ValueTypes,
};

type Payload = {
  requirement_id: number,
  answers: Array<Answer>,
  form_answers_set_id?: number,
};

type Args = Payload & {
  id: number,
};

const createRegistrationForm = async ({
  id,
  requirement_id,
  answers,
  form_answers_set_id,
}: Args): Promise<Response> => {
  const payload: Payload = {
    requirement_id,
    answers,
  };

  if (window.featureFlags[SAVE_PROGRESS_FEATURE_FLAG]) {
    payload.form_answers_set_id = form_answers_set_id;
  }

  const { data } = await axios.post(
    `/registration/users/${id}/registrations/submit`,
    {
      ...payload,
    }
  );

  return data;
};

export default createRegistrationForm;
