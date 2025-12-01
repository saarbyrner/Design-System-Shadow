// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  NewHomegrown,
  Homegrown,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';

const updateHomegrownSubmission = async (
  submissionId: number,
  homegrownSubmission: NewHomegrown
): Promise<Homegrown> => {
  const { data } = await axios.put(
    `/registration/homegrown/${submissionId}`,
    homegrownSubmission
  );

  return data;
};

export default updateHomegrownSubmission;
