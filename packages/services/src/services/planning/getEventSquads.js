// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AthletesSelectorSquadData } from '@kitman/components/src/types';

export type EventSquads = {
  squads: Array<AthletesSelectorSquadData>,
  selected_athletes: Array<string | number>,
  squad_numbers: { [key: number]: number },
};

const getEventSquads = async (
  eventId: number,
  params?: {
    availability?: boolean,
    positionAbbreviation?: boolean,
    squadNumber?: boolean,
    designation?: boolean,
    gameStatus?: boolean,
    filterByHomeOrganisation?: boolean,
    filterByAwayOrganisation?: boolean,
    includePrimarySquad?: boolean,
    filterByDivision?: boolean,
  }
): Promise<EventSquads> => {
  const { data } = await axios.get(`/planning_hub/events/${eventId}/squads`, {
    params: {
      include_availability: params?.availability || false,
      include_position_abbreviation: params?.positionAbbreviation || false,
      include_squad_number: params?.squadNumber || false,
      include_designation: params?.designation || false,
      include_game_status: params?.gameStatus || false,
      filter_by_home_organisation: params?.filterByHomeOrganisation || false,
      filter_by_away_organisation: params?.filterByAwayOrganisation || false,
      include_primary_squad: params?.includePrimarySquad || false,
      filter_by_division: params?.filterByDivision || false,
    },
    timeout: 40000,
  });

  return data;
};

export default getEventSquads;
