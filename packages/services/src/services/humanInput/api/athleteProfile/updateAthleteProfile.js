// @flow

import { axios } from '@kitman/common/src/utils/services';
import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';
import type { FormUpdateRequestBody } from '../types';

type Props = {
  athleteId: number,
  requestBody: FormUpdateRequestBody,
};

const updateAthleteProfile = async (props: Props): Promise<HumanInputForm> => {
  const { athleteId, requestBody } = props;

  try {
    const { data } = await axios.put(
      `/athletes/${athleteId}/profile`,
      requestBody
    );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default updateAthleteProfile;
