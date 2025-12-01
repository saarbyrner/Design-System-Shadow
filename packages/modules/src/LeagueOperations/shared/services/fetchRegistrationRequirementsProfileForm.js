/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { RegistrationProfileForm } from '../types/forms';

type RequestParams = {
  user_id: number,
  requirement_id: number,
};

const fetchRegistrationRequirementsProfileForm = async ({
  user_id,
  requirement_id,
}: RequestParams): Promise<RegistrationProfileForm> => {
  try {
    const { data } = await axios.post(
      `/registration/users/${user_id}/profile`,
      {
        requirement_id,
      }
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchRegistrationRequirementsProfileForm;
