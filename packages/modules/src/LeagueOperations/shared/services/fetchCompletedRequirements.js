/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';
import { type HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';
import type { RegistrationStatus } from '@kitman/modules/src/LeagueOperations/shared/types/common';

type Params = {
  user_id: number,
  registration_id: number,
};
type Response = {
  id: number,
  user_id: number,
  status: RegistrationStatus,
  registration_form: HumanInputForm,
};

const fetchCompletedRequirements = async ({
  user_id,
  registration_id,
}: Params): Promise<Response> => {
  try {
    const { data } = await axios.get(
      `/registration/users/${user_id}/registrations/${registration_id}`
    );
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchCompletedRequirements;
