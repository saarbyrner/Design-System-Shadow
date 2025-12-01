// @flow
import { axios } from '@kitman/common/src/utils/services';

type Response = {
  message: string,
};

const sendHomegrownSubmissionNotification = async (
  id: number
): Promise<Response> => {
  const { data } = await axios.post(`/registration/homegrown/notification/`, {
    id,
  });
  return data;
};

export default sendHomegrownSubmissionNotification;
