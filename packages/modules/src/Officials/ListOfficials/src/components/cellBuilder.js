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

import type { Official } from '../../../shared/types';

const buildCellContent = (
  { row_key: rowKey }: { row_key: string },
  official: Official
): Node | Array<Node> => {
  switch (rowKey) {
    case 'fullname':
      return (
        <AvatarCell
          text={official.fullname}
          avatar_url={official.avatar_url}
          href={`/${
            window.featureFlags['side-nav-update']
              ? 'administration'
              : 'settings'
          }/officials/${official.id}/edit`}
        />
      );
    case 'username':
      return <TextCell text={official.username} />;
    case 'email':
      return <TextCell text={official.email} />;
    case 'created_at':
      return (
        <TextCell
          text={formatStandard({
            date: moment(official.created_at),
            displayLongDate: true,
          })}
        />
      );
    case 'edit':
      return (
        <Link
          href={`/${
            window.featureFlags['side-nav-update']
              ? 'administration'
              : 'settings'
          }/officials/${official.id}/edit`}
        >
          <i className="users__userTableEdit icon-edit" />
        </Link>
      );
    default:
      return <span css={cellStyle.textCell}>{official[rowKey]}</span>;
  }
};

export default buildCellContent;
