// @flow
import type { PrincipleTypes } from '@kitman/common/src/types/Principles';
import { axios } from '@kitman/common/src/utils/services';

export default async (): Promise<PrincipleTypes> => {
  const { data } = await axios.get('/ui/planning_hub/principle_types');
  return data;
};
