// @flow
import { axios } from '@kitman/common/src/utils/services';

type CustomOppositionNameResult = {
  id: number,
  name: string,
};

export const createCustomOppositionName = async (
  name: string
): Promise<CustomOppositionNameResult> => {
  const { data } = await axios.post(`/custom_teams`, { name });
  return data;
};

export const updateCustomOppositionName = async (
  updatedName: string,
  id: number
): Promise<CustomOppositionNameResult> => {
  const { data } = await axios.patch(`/custom_teams/${id}`, {
    name: updatedName,
  });
  return data;
};

export const deleteCustomOppositionName = async (id: number) => {
  await axios.delete(`/custom_teams/${id}`);
};
