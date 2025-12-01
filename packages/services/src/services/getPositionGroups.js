// @flow
import { axios } from '@kitman/common/src/utils/services';

export type PositionGroup = {
  id: number,
  name: string,
  order: number,
  positions: Array<{
    id: number,
    abbreviation: string,
    name: string,
    order: number,
  }>,
};
export type PositionGroups = Array<PositionGroup>;

const getPositionGroups = async (): Promise<PositionGroups> => {
  const { data } = await axios.get('/ui/position_groups', {
    headers: {
      Accept: 'application/json',
    },
  });

  return data;
};

export default getPositionGroups;
