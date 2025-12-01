// @flow
import { axios } from '@kitman/common/src/utils/services';

const refreshWidgetCache = async (tableContainerId: number) => {
  const response = await axios.get(
    `/table_containers/${tableContainerId}/refresh_cache`
  );
  return response;
};

export default refreshWidgetCache;
