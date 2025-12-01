// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Field } from '@kitman/common/src/types/PitchView';

export type GameFields = Array<$Shape<Field>>;

const getGameFields = async (): Promise<GameFields> => {
  const { data } = await axios.get(`/ui/planning_hub/fields`);

  return data;
};

export default getGameFields;
