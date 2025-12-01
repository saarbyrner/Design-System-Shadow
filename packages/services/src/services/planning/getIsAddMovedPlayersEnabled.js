// @flow
import { axios } from '@kitman/common/src/utils/services';

export type MovedPlayersEnabled = {
  value: boolean,
};

const getIsAddMovedPlayersEnabled = async (): Promise<MovedPlayersEnabled> => {
  const { data } = await axios.get(
    '/organisation_preferences/moved_players_in_organisation_at_event'
  );

  return data;
};

export default getIsAddMovedPlayersEnabled;
