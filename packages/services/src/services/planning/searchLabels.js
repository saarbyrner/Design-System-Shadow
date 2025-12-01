// @flow
import type { Squads } from '@kitman/services/src/services/getSquads';
import { axios } from '@kitman/common/src/utils/services';

export type LabelsSearchParams = {
  squadIds?: Array<number>,
  isForCurrentSquadOnly?: boolean,
};

export type Label = {
  id: number | string,
  name: string,
  squads?: Squads,
  archived?: boolean,
  isNewItem?: boolean,
};

export const searchLabels = async (
  { squadIds, isForCurrentSquadOnly }: LabelsSearchParams = {
    squadIds: [],
    isForCurrentSquadOnly: false,
  }
): Promise<Array<Label>> => {
  const { data } = await axios.get(
    '/ui/planning_hub/event_activity_drill_labels',
    {
      params: {
        current_squad: isForCurrentSquadOnly,
        squad_ids: squadIds,
      },
    }
  );
  return data;
};
