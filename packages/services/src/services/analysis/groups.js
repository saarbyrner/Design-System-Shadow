// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Athlete } from '@kitman/common/src/types/Athlete';

export type GroupPopulation = {
  id: number,
  organisation_id: number,
  name: string,
  expression: string,
  created_at?: string,
  updated_at?: string,
  athletes?: Athlete[],
};

export const getGroup = async (groupId: number): Promise<GroupPopulation> => {
  const { data } = await axios.get(`/ui/segments/${groupId}`);

  return data;
};

export const getGroups = async (): Promise<GroupPopulation[]> => {
  const { data } = await axios.get(`/ui/segments`);

  return data;
};
