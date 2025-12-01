// @flow
import { axios } from '@kitman/common/src/utils/services';

export type Dashboard = {
  id: number,
  name: string,
  layout: string,
  created_at: string,
  updated_at: string,
  squad_id: number,
  print_paper_size: ?number,
  print_orientation: ?string,
  last_seen: ?number,
};

const getDashboards = async (id: number): Promise<Array<Dashboard>> => {
  const { data } = await axios.get(`/ui/squads/${id}/dashboards`);

  return data;
};

export default getDashboards;
