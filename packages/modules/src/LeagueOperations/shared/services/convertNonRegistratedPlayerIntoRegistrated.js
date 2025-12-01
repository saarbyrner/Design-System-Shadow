// @flow
import { axios } from '@kitman/common/src/utils/services';

const convertNonRegistratedPlayerIntoRegistrated = async ({
  athleteId,
}: {
  athleteId: number,
}): Promise<Response> => {
  const url = `/registration/athletes/${athleteId}/register_homegrown`;

  const { data } = await axios.post(url);

  return data;
};

export default convertNonRegistratedPlayerIntoRegistrated;
