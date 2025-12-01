// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';

const fetchAthleteProfileForm = async (
  athleteId: string
): Promise<HumanInputForm> => {
  try {
    const { data } = await axios.get(`/athletes/${athleteId}/profile/edit`);

    return data;
  } catch (err) {
    throw err;
  }
};

export default fetchAthleteProfileForm;
