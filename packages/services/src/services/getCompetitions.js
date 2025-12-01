// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { GameFieldEvent } from '@kitman/modules/src/PlanningEventSidePanel/src/components/gameLayoutV2/GameFieldsV2';

type Generic = {
  id: number,
  name: string,
};

export type Competition = Generic & {
  squads: [Generic],
  competition_categories: [Generic],
  format: { id: number, name: string, number_of_players: number },
  id: number,
  max_staffs: number,
  max_substitutes: number,
  min_staffs: number,
  min_substitutes: number,
  name: string,
  show_captain: boolean,
};
export type Competitions = Array<Competition>;

const getCompetitions = async ({
  squadIds,
  divisionIds,
  allCompetitions,
  hideInactive,
}: {
  squadIds?: Array<number>,
  divisionIds?: number | null,
  allCompetitions?: boolean,
  hideInactive?: boolean,
} = {}): Promise<Competitions> => {
  let url = '/competitions';
  // NOTE: Backend prefers arrays for filters (e.g. [divisionIds]), but this endpoint
  // accepts single numbers in query strings.
  let params = {};
  if (divisionIds) {
    params = { ...params, division_ids: divisionIds };
  }
  if (allCompetitions) {
    params = { ...params, all: true };
  }
  if (hideInactive) {
    params = { ...params, hide_inactive: true };
  }

  if (squadIds) {
    url += `?${squadIds.map((id) => `squads[]=${id}`).join('&')}`;
  }
  const { data } = await axios.get(url, {
    headers: {
      Accept: 'application/json',
    },
    params,
  });
  return data;
};

export const getCompetitionsV2 = async (
  event: GameFieldEvent,
  isClub: boolean
): Promise<Competitions> => {
  const competitionUrl = isClub
    ? `/competitions?for_event=${event.id ?? 'new'}&full=1`
    : '/competitions?full';
  const { data } = await axios.get(competitionUrl);
  return data;
};

export default getCompetitions;
