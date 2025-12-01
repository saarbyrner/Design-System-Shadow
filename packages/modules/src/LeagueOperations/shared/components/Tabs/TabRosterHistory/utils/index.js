// @flow
import type { RosterHistoryRows } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import {
  ENDPOINT_DATE_FORMAT,
  FALLBACK_DASH,
} from '@kitman/modules/src/LeagueOperations/shared/consts';
import moment from 'moment';

export default (rawRowData: Array<Object>): Array<RosterHistoryRows> => {
  return (
    rawRowData?.map((item) => {
      return {
        id: item.id,
        league:
          item.squad.division.length > 0
            ? item.squad.division[0].name
            : FALLBACK_DASH,
        club: [
          {
            id: item.id,
            text: item.squad?.owner_name,
            avatar_src: item.squad?.logo_full_path ?? '',
          },
        ],
        squad: item.squad?.name,
        joined: moment(item?.joined_at).format(ENDPOINT_DATE_FORMAT),
        left: item.left_at
          ? moment(item.left_at).format(ENDPOINT_DATE_FORMAT)
          : FALLBACK_DASH,
      };
    }) || []
  );
};
