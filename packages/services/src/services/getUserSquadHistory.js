// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Meta } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type SquadHistoryItem = {
  id: number,
  user_id: number,
  squad: {
    id: number,
    name: string,
    owner_name?: string,
    logo_full_path?: string,
    division?: Array<{
      id: number,
      name: string,
    }>,
  },
  joined_at: string,
  left_at: string | null,
};
export type SquadHistoryResponse = {
  data: Array<SquadHistoryItem>,
  meta: Meta,
};

export const getUserSquadHistory = async ({
  id,
}: {
  id: number | string,
}): Promise<SquadHistoryResponse> => {
  try {
    const { data } = await axios.post(`/users/${id}/squad_history`);

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
