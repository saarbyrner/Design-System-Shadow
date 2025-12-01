// @flow
import { useFlexLayout } from 'react-table';

import DataTable, {
  type DataTableData,
  type DataTableColumns,
} from '@kitman/modules/src/Medical/shared/components/DataTable';
import type { Style } from '@kitman/common/src/types/styles';
import PlanningTab from '@kitman/modules/src/PlanningEvent/src/components/PlanningTabLayout/index';
import { getTableStyles } from '../../helpers/tableComponents';
import type { TableRef } from '../../types/table';

type Props = {
  id: string,
  tableRef: TableRef,
  rows: DataTableData[],
  columns: DataTableColumns[],
  style: Style,
};

export const SharedTable = ({ id, tableRef, rows, columns, style }: Props) => {
  const dataTableStyles = getTableStyles(tableRef);
  const isTableEmpty = rows.length === 0;

  return (
    <PlanningTab.TabContent>
      <div
        id={id}
        ref={tableRef}
        css={isTableEmpty ? dataTableStyles.TableEmpty : dataTableStyles.Table}
      >
        <div css={style.documentsTable}>
          <DataTable
            columns={columns}
            data={rows}
            isTableEmpty={isTableEmpty}
            useLayout={useFlexLayout}
          />
        </div>
      </div>
    </PlanningTab.TabContent>
  );
};

export default {};
