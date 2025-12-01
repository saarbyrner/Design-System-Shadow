// @flow
import { useMemo } from 'react';
import type { Node } from 'react';
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { useTable, useBlockLayout } from 'react-table';
import { useSticky } from 'react-table-sticky';

export type DataTableData = {
  [string]: string | Object | Node,
};

export type DataTableColumns = {
  Header: string | Function,
  accessor: string,
};

type Props = {
  data: Array<DataTableData>,
  columns: Array<DataTableColumns>,
  customCellRenderer?: (Object) => Node,
  useLayout?: Function,
};

const style = {
  dataTable: css`
    overflow: scroll;
  `,
  body: css`
    position: relative;
  `,
  headerCell: css`
    border-bottom: 1px solid ${colors.neutral_300};
    border-right: 1px solid transparent;
    font-size: 14px;
    color: ${colors.grey_100};
    padding: 8px 12px;
    font-weight: normal;
    text-align: center;
  `,
  bodyCell: css`
    border-top: 1px solid transparent;
    border-right: 1px solid transparent;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;
    padding: 12px;
    text-align: left;
  `,
  row: css`
    &:last-child {
      & > div {
        border-bottom: 0;
      }
    }
  `,
  rowSelected: css`
    > .dataTable__td {
      background: ${colors.background};

      div[class$='cell'] {
        background: ${colors.background};
      }
    }
  `,
};

const DataTable = (props: Props) => {
  const tableData = useMemo(() => props.data, [props.data]);
  const tableColumns = useMemo(() => props.columns, [props.columns]);

  const tableInstance = useTable(
    { columns: tableColumns, data: tableData },
    props.useLayout ? props.useLayout : useBlockLayout,
    useSticky
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const generateCells = (cell) => {
    return (
      <div
        {...cell.getCellProps()}
        css={style.bodyCell}
        className={`dataTable__td dataTable__td--${cell.column.id}`}
      >
        {props.customCellRenderer
          ? cell.render(() => props.customCellRenderer?.(cell))
          : // 'Cell' is the built-in default cell renderer of react-table
            cell.render('Cell')}
      </div>
    );
  };

  return (
    <div css={style.dataTable} {...getTableProps()} className="dataTable">
      <div>
        {headerGroups.map((headerGroup) => (
          <div
            className="dataTable__thead"
            {...headerGroup.getHeaderGroupProps()}
          >
            {headerGroup.headers.map((column) => (
              <div
                {...column.getHeaderProps()}
                css={style.headerCell}
                className={`dataTable__th dataTable__th--${column.id}`}
              >
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        className="dataTable__tbody"
        css={style.body}
        {...getTableBodyProps()}
      >
        {rows.map((row) => {
          prepareRow(row);
          return (
            <div
              className="dataTable__tr"
              css={[
                style.row,
                row.original.selected ? style.rowSelected : null,
              ]}
              {...row.getRowProps()}
            >
              {row.cells.map((cell) => {
                return generateCells(cell);
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

DataTable.defaultProps = {
  data: [],
  columns: [],
};

export default DataTable;
