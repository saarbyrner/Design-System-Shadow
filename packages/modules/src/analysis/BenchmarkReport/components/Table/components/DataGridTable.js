// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import { DataGrid as MuiDataGrid } from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { getRowClass } from '../utils';
import { dataGridTableRowStyles } from '../styles';

type Props = {
  columnsData: Object,
  rowsData: Object,
};

const DataGridTable = (props: I18nProps<Props>) => (
  <MuiDataGrid
    disableColumnResize={false}
    disableColumnReorder={false}
    columns={props.columnsData}
    rows={props.rowsData}
    pagination
    pageSizeOptions={[5, 10, 25, 50, 100]}
    getRowClassName={getRowClass}
    sx={dataGridTableRowStyles}
    gridToolBar={['enableCSV']}
  />
);

export const DataGridTableTranslated: ComponentType<Props> =
  withNamespaces()(DataGridTable);
export default DataGridTable;
