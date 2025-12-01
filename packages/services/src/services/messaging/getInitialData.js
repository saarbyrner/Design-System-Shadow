// @flow
import { axios } from '@kitman/common/src/utils/services';

const getInitialData = async () => {
  const { data } = await axios.get(`/messaging/messaging_initial_data`);

  return data;
};

export default getInitialData;
