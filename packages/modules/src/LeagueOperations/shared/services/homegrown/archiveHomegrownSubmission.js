// @flow
import { axios } from '@kitman/common/src/utils/services';

type Response = {
  message: string,
};

const archiveHomegrownSubmission = async (id: number): Promise<Response> => {
  const { data } = await axios.put(`/registration/homegrown/archive`, {
    id,
  });
  return data;
};

export default archiveHomegrownSubmission;
