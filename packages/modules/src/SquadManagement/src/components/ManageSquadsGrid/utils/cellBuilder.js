// @flow
import type { Node } from 'react';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment';
import {
  AvatarCell,
  TextCell,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/components/Cells';
import { cellStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';
import type { SquadSetting, Column } from '../../../shared/types';

const formatDate = (date: string, locale: string) => {
  return DateFormatter.formatShortOrgLocale(moment(date), locale, false);
};

const buildCellContent = (
  { row_key: rowKey }: Column,
  squad: SquadSetting,
  locale: string
): Node | Array<Node> => {
  switch (rowKey) {
    case 'squad':
      return (
        <AvatarCell
          avatar_url={squad.organisations[0].logo_path}
          text={squad.name}
        />
      );
    case 'state_address':
      return <TextCell text={squad?.address?.state || '-'} />;
    case 'total_coaches':
      return <TextCell text={squad.total_coaches} />;
    case 'total_players':
      return <TextCell text={squad.total_athletes} />;
    case 'start_marker':
      return <TextCell text={formatDate(squad.markers.start_season, locale)} />;
    case 'end_marker':
      return <TextCell text={formatDate(squad.markers.end_season, locale)} />;
    default:
      return <span css={cellStyle.textCell}>{squad[rowKey]}</span>;
  }
};

export default buildCellContent;
