// @flow
/* eslint-disable camelcase */
import type { Squad } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { SquadRow } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';

export default (rawRowData: Array<Squad>): Array<SquadRow> => {
  return (
    rawRowData?.map(({ id, name, total_athletes, total_coaches }) => {
      return {
        id,
        name: { text: name, href: `/registration/squads?id=${id}` },
        total_athletes,
        total_coaches,
      };
    }) || []
  );
};
