// @flow
import { axios } from '@kitman/common/src/utils/services';

const getInitialContext = async () => {
  const { data } = await axios.get(`/messaging/messaging_token`);

  return data;
};

export default getInitialContext;
