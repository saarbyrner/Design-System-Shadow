// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Athlete } from '@kitman/common/src/types/Athlete';

export type LabelPopulation = {
  id: number,
  organisation_id: number,
  user_id: number,
  name: string,
  color: string,
  description?: string,
  created_at?: string,
  updated_at?: string,
  athletes?: Athlete[],
};

export const getLabel = async (labelId: number): Promise<LabelPopulation> => {
  const { data } = await axios.get(`/ui/labels/${labelId}`);

  return data;
};

export const getLabels = async (): Promise<LabelPopulation[]> => {
  const { data } = await axios.get(`/ui/labels`);

  return data;
};
