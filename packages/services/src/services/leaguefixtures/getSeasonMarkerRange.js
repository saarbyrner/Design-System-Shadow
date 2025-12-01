// @flow
import { axios } from '@kitman/common/src/utils/services';

const getSeasonMarkerRange = async (): Promise<Array<string>> => {
  const { data } = await axios.get('/ui/initial_data_planning_hub');
  return data.season_marker_range;
};

export default getSeasonMarkerRange;
