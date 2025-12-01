// @flow
import type { Node } from 'react';
import { InvalidCell } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/Cells';
import { colors } from '@kitman/common/src/variables';
import { cellStyle } from '@kitman/modules/src/LeagueOperations/technicalDebt/components/CommonGridStyle';

import type {
  CSVStaff,
  CSVOfficial,
  CSVScouts,
  CSVStaffAssignment,
  CSVMatchMonitor,
} from '../../types';
import { type MassUploadCSVs } from '../../New/types';

const buildCellContent = (
  { row_key: rowKey }: { row_key: string },
  user:
    | MassUploadCSVs
    | CSVStaff
    | CSVOfficial
    | CSVStaffAssignment
    | CSVScouts
    | CSVMatchMonitor,
  isInvalid: ?string,
  centered?: boolean
): Node | Array<Node> => {
  if (isInvalid) {
    return (
      <InvalidCell
        icon="warning"
        color={colors.red_100}
        value={user[rowKey]}
        message={isInvalid}
        field={rowKey}
      />
    );
  }
  return (
    <span css={[cellStyle.textCell, centered && cellStyle.centered]}>
      {user[rowKey]}
    </span>
  );
};

export default buildCellContent;
