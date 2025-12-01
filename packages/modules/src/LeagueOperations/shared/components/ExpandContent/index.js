// @flow
import type { GridColDef } from '@mui/x-data-grid-pro';
import { Box } from '@kitman/playbook/components';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useEffect, useState } from 'react';
import { useFetchRegistrationGridsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGridApi';

import { onTransformColumns } from '../GridConfiguration/columns';

type Props<RowDataType, RawDataType> = {
  gridParams: {
    key: string,
    userType: string,
  },
  rows: Array<RawDataType>,
  gridStartColumn: string,
  onTransformData: (Array<RawDataType>) => Array<RowDataType>,
};

const EXPANDER_WIDTH = 76;
const MUI_DATAGRID_ROW_HEIGHT = 56;

/**
 * @param {Array<RowDataType>} rows A subset of data from pre-parsed rows form the parent grid
 * @param {Function} onTransformData a function that accepts a Array<RawDataType> form a service and transforms into a  Array<RowDataType>
 * @param {string} gridStartColumn  a dom string query to determine at which screen point the sub grid should start. MUI appends the column id as a data-id attribute to the table columns
 * @param {string} gridFetchKey Should these grids need to be dynamic, this is used to fetch from the BE
 * @returns {Node}
 * @example
 *  <ExpandContent
      dataFieldSelector="athlete"
      gridKey="registrations"
      onTransformData={transformToRegistrationRows}
      rows={row.registrations}
    />
 */

function ExpandContent<RowDataType, RawDataType>(
  props: Props<RowDataType, RawDataType>
) {
  const [gridStartPosition, setGridStartPosition] = useState(0);
  const [contentPanelHeight, setContentPanelHeight] = useState(0);

  const {
    data: columns = [],
    isLoading: areColumnsLoading,
    isFetching: areColumnsFetching,
  } = useFetchRegistrationGridsQuery(
    { ...props.gridParams },
    { skip: !(props.gridParams.key || props.gridParams.userType) }
  );

  const rows: Array<RowDataType> = props.onTransformData(props.rows);

  useEffect(() => {
    setContentPanelHeight(`calc((${rows.length * MUI_DATAGRID_ROW_HEIGHT}px))`);
    const dimensions = document
      ?.querySelectorAll(`[data-field="${props.gridStartColumn}"]`)[0]
      ?.getBoundingClientRect();
    setGridStartPosition(`calc((${dimensions?.left - EXPANDER_WIDTH}px))`);
  }, [rows, props.gridStartColumn]);

  const transformedColumns: Array<GridColDef> = columns
    ? onTransformColumns({
        cols: columns,
      })
    : [];

  return (
    <Box
      sx={{
        height: contentPanelHeight,
        pl: gridStartPosition,
      }}
    >
      {/*  TODO: switch back to data grid wrapper when issue with webpack on staging resolved */}
      <DataGridPro
        getRowId={(row) => row.id}
        loading={areColumnsLoading || areColumnsFetching}
        paginationMode="server"
        rowCount={props.rows.length}
        slots={{
          columnHeaders: () => null,
        }}
        columns={transformedColumns}
        rows={rows}
        hideFooter
        sx={{
          '&, [class^=MuiDataGrid]': {
            borderLeft: 'none',
            borderRight: 'none',
          },
        }}
      />
    </Box>
  );
}

export default ExpandContent;
