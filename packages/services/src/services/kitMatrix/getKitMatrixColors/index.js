// @flow
import { axios } from '@kitman/common/src/utils/services';

export type KitMatrixColor = {
  id: number,
  name: string,
};

const getKitMatrixColors = async (): Promise<Array<KitMatrixColor>> => {
  const { data } = await axios.get('/planning_hub/kit_matrix_colors');
  return data;
};

export default getKitMatrixColors;
