// @flow
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { GridColDef } from '@mui/x-data-grid-pro';
import type { RegistrationFormsResponse } from '@kitman/modules/src/LeagueOperations/QAFormApp/services/fetchForms';
import {
  COMMON_COLUMN_PROPS,
  getTextColumn,
  getLinkColumn,
} from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/columns/';

export const getDateColumn = (columnDefinition: GridColDef): GridColDef => ({
  ...COMMON_COLUMN_PROPS,
  ...columnDefinition,
  renderCell: (params: { value: string }) => {
    return DateFormatter.formatStandard({
      date: moment(params.value),
      showCompleteDate: true,
      showTime: true,
    });
  },
});

const transformRows = (
  rows: Array<RegistrationFormsResponse>
): Array<Object> => {
  return rows.map((row) => {
    return {
      ...row,
      key: {
        text: row.key,
        href: `/qa/form/${row.id}`,
      },
    };
  });
};

export const getConfig = (rows: Array<RegistrationFormsResponse>) => {
  return {
    rows: transformRows(rows),
    columns: [
      getTextColumn({ field: 'id', headerName: 'ID', type: 'text' }),
      getTextColumn({
        field: 'form_type',
        headerName: 'Type',
        type: 'text',
      }),
      getLinkColumn({
        field: 'key',
        headerName: 'Key',
        type: 'link',
      }),
      getTextColumn({ field: 'name', headerName: 'Name', type: 'text' }),
      getTextColumn({
        field: 'category',
        headerName: 'Category',
        type: 'text',
      }),
      getTextColumn({ field: 'group', headerName: 'Group', type: 'text' }),
      getDateColumn({
        field: 'updated_at',
        headerName: 'Updated',
        type: 'text',
      }),
      getDateColumn({
        field: 'created_at',
        headerName: 'Created',
        type: 'text',
      }),
    ],
    emptyTableText: 'No forms available for the selected filter',
    id: 'details_grid',
  };
};
