// @flow
import type { PrinciplePhases } from '@kitman/common/src/types/Principles';
import { axios } from '@kitman/common/src/utils/services';

export default async (): Promise<PrinciplePhases> => {
  const { data } = await axios.get('/ui/planning_hub/phases');
  return data;
};
