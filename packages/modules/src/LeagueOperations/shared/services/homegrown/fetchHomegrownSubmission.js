// @flow
import { axios } from '@kitman/common/src/utils/services';

type Response = {
  message: string,
};

const fetchHomegrownSubmission = async (
  submissionId: number
): Promise<Response> => {
  const { data } = await axios.get(`/registration/homegrown/${submissionId}`);
  return data;
};

export default fetchHomegrownSubmission;
