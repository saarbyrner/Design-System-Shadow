/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { Form } from '@kitman/modules/src/HumanInput/types/forms';

type RequestParams = {
  user_id: number,
  requirement_id: number,
};

const fetchRegistrationRequirements = async ({
  user_id,
  requirement_id,
}: RequestParams): Promise<Form> => {
  try {
    const { data } = await axios.post(
      `/registration/requirements/${requirement_id}/form`,
      {
        user_id,
      }
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchRegistrationRequirements;
