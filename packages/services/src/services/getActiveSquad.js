// @flow
import { axios } from '@kitman/common/src/utils/services';

export type Squad = {
  id: number,
  name: string,
  owner_id: number,
  division:
    | Array<{
        id: number,
        name: string,
      }>
    | [],
};

const getActiveSquad = async (): Promise<Squad> => {
  const { data } = await axios.get('/ui/squads/active_squad');

  return data;
};

export default getActiveSquad;
