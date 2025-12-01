// @flow
import type { PrincipleCategories } from '@kitman/common/src/types/Principles';
import { axios } from '@kitman/common/src/utils/services';

export default async (): Promise<PrincipleCategories> => {
  const { data } = await axios.get('/ui/planning_hub/principle_categories');
  return data;
};
