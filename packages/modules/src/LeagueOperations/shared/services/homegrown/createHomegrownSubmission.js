// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  NewHomegrown,
  Homegrown,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

const createHomegrownSubmission = async (
  homegrownSubmission: NewHomegrown
): Promise<Homegrown> => {
  const { data } = await axios.post(
    '/registration/homegrown',
    homegrownSubmission
  );

  return data;
};

export default createHomegrownSubmission;
