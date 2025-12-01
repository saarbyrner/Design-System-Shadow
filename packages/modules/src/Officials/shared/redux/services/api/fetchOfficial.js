// @flow
import { axios } from '@kitman/common/src/utils/services';

const fetchOfficial = async (id: number): Promise<any> => {
  const { data } = await axios.get(`/settings/officials/${id}`);

  return data;
};

export default fetchOfficial;
