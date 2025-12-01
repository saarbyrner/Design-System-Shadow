// @flow
/* eslint-disable camelcase */
import type { UserDisciplineRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
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

export default (
  rawRowData: Array<DisciplineSearchItem>
): Array<UserDisciplineRow> => {
  return (
    rawRowData?.map((item) => {
      const {
        user_id,
        organisations,
        disciplinary_issues,
        total_disciplines,
        active_discipline_end_date,
        discipline_status,
        squads,
        active_discipline,
      } = item;
      return {
        id: user_id,
        athlete: transformUserAvatar(item),
        discipline_status: discipline_status ?? ELIGIBLE,
        organisations: organisations?.map((org) => getClubAvatar(org)) || [],
        red_cards: getDisciplinaryIssueCount({
          disciplinary_issues,
          type: CARD_RED,
        }),
        yellow_cards: getDisciplinaryIssueCount({
          disciplinary_issues,
          type: CARD_YELLOW,
        }),
        total_suspensions: total_disciplines || 0,
        suspended_until: getDateOrFallback(
          active_discipline_end_date,
          USER_ENDPOINT_DATE_FORMAT
        ),
        team: squads?.[0]?.name ?? FALLBACK_DASH,
        active_discipline: active_discipline ?? null,
      };
    }) || []
  );
};
