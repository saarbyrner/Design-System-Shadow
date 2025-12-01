// @flow
/* eslint-disable camelcase */
import type { AthleteDisciplineRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import {
  getDateOrFallback,
  getClubAvatar,
} from '@kitman/modules/src/LeagueOperations/shared/utils';
import { type DisciplineSearchItem } from '@kitman/modules/src/LeagueOperations/shared/types/discipline/';
import {
  ELIGIBLE,
  CARD_RED,
  CARD_YELLOW,
  FALLBACK_DASH,
  USER_ENDPOINT_DATE_FORMAT,
} from '@kitman/modules/src/LeagueOperations/shared/consts';

import {
  transformUserAvatar,
  getDisciplinaryIssueCount,
} from '@kitman/modules/src/LeagueOperations/DisciplineApp/src/components/DisciplineTabs/utils';

export const getSuspendedInfo = (athleteSuspended: DisciplineSearchItem) => {
  let suspendedInfo;

  if (window.getFlag('league-ops-discipline-area-v2')) {
    const {
      number_of_active_disciplines,
      active_discipline_end_date,
      active_discipline,
    } = athleteSuspended;
    if (number_of_active_disciplines && number_of_active_disciplines > 1) {
      suspendedInfo = `Multiple (${number_of_active_disciplines})`;
    } else if (
      active_discipline_end_date &&
      active_discipline?.kind === 'date_range'
    ) {
      suspendedInfo = getDateOrFallback(
        active_discipline_end_date,
        USER_ENDPOINT_DATE_FORMAT
      );
    } else if (
      active_discipline?.number_of_games &&
      active_discipline?.kind === 'number_of_games'
    ) {
      const gameText = active_discipline.number_of_games > 1 ? 'games' : 'game';
      suspendedInfo = `${active_discipline.number_of_games} ${gameText}`;
    } else {
      suspendedInfo = '-';
    }

    return suspendedInfo;
  }

  return getDateOrFallback(
    athleteSuspended.active_discipline_end_date,
    USER_ENDPOINT_DATE_FORMAT
  );
};

export default (
  rawRowData: Array<DisciplineSearchItem>
): Array<AthleteDisciplineRow> => {
  return (
    rawRowData?.map((item) => {
      const {
        user_id,
        organisations,
        disciplinary_issues,
        total_disciplines,
        discipline_status,
        squads,
        jersey_number,
        active_discipline,
      } = item;
      return {
        id: user_id,
        athlete: transformUserAvatar(item),
        discipline_status: discipline_status ?? ELIGIBLE,
        organisations: organisations?.map((org) => getClubAvatar(org)) || [],
        jersey_no: jersey_number ?? FALLBACK_DASH,
        red_cards: getDisciplinaryIssueCount({
          disciplinary_issues,
          type: CARD_RED,
        }),
        yellow_cards: getDisciplinaryIssueCount({
          disciplinary_issues,
          type: CARD_YELLOW,
        }),
        total_suspensions: total_disciplines || 0,
        suspended_until: getSuspendedInfo(item),
        team: squads?.[0]?.name ?? FALLBACK_DASH,
        active_discipline: active_discipline ?? null,
        squads,
      };
    }) || []
  );
};
