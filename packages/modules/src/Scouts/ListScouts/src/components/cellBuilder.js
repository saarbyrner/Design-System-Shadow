// @flow
import moment from 'moment';
import type { Node } from 'react';
import {
  TextCell,
  AvatarCell,
} from '@kitman/modules/src/LeagueOperations/technicalDebt/components/Cells';
import { Link } from '@kitman/components';

import { formatStandard } from '@kitman/common/src/utils/dateFormatter';

import { cellStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';

import type { Scout } from '../../../shared/types';

// Note: at some point we can maybe consider having a generic cell content builder as we have a similar file for Officials
const buildCellContent = (
  { row_key: rowKey }: { row_key: string },
  scout: Scout
): Node | Array<Node> => {
  switch (rowKey) {
    case 'fullname':
      return (
        <AvatarCell
          text={scout.fullname}
          avatar_url={scout.avatar_url}
          href={`/administration/scouts/${scout.id}/edit`}
        />
      );
    case 'username':
      return <TextCell text={scout.username} />;
    case 'email':
      return <TextCell text={scout.email} />;
    case 'created_at':
      return (
        <TextCell
          text={formatStandard({
            date: moment(scout.created_at),
            displayLongDate: true,
          })}
        />
      );
    case 'edit':
      return (
        <Link href={`/administration/scouts/${scout.id}/edit`}>
          <i className="users__userTableEdit icon-edit" />
        </Link>
      );
    default:
      return <span css={cellStyle.textCell}>{scout[rowKey]}</span>;
  }
};

export default buildCellContent;
