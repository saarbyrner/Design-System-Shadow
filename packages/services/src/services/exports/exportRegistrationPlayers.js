// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ExportsItem } from '@kitman/common/src/types/Exports';

const exportRegistrationPlayers = async (): Promise<ExportsItem> => {
  const { data } = await axios.post('/export_jobs/registration_players_export');
  return data;
};

export default exportRegistrationPlayers;
