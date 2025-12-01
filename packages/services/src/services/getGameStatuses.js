// @flow
import { axios } from '@kitman/common/src/utils/services';

export type GameStatuses =
  | {
      [key: string]: string,
    }
  | {};

const getGameStatuses = async (): Promise<GameStatuses> => {
  const { data } = await axios.get('/ui/planning_hub/game_statuses', {
    headers: {
      Accept: 'application/json',
    },
  });
  return data;
};

export default getGameStatuses;
