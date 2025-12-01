// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ActivityDisciplinaryReason } from '@kitman/common/src/types/GameEvent';

const getDisciplinaryReasons = async (): Promise<
  ActivityDisciplinaryReason[]
> => {
  const { data } = await axios.get(
    '/ui/planning_hub/game_disciplinary_reasons'
  );
  return data;
};

export default getDisciplinaryReasons;
