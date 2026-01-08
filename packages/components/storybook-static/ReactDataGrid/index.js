// @flow
import DataGrid from 'react-data-grid';
import { useState, useEffect } from 'react';
import { checkForSubRows } from './utils';

export type HeaderData = {
  key: string,
  name: string,
  formatter?: Function,
  frozen?: boolean,
  sticky?: string,
  width?: ?(number | string),
  minWidth?: ?(number | string),
  maxWidth?: ?(number | string),
  [string]: any,
};

export type BodyData = {
  [string]: any,
};

type Props = {
  tableHeaderData: Array<HeaderData>,
  tableBodyData: Array<BodyData>,
  tableStyling?: any,
  rowHeight?: number,
  rowClass?: string | Function,
  headerRowHeight?: number,
  expandableSubRows?: boolean,
  expandableHeight?: number,
  onRowsChange?: Function,
  onScroll?: Function,
  tableGrow?: boolean,
  summaryRows?: Array<{
    [string]: any,
  }>,
};

const DEFAULT_ROW_HEIGHT = 35;

const ReactDataGrid = (props: Props) => {
  // adds the expander to the table if sub_rows are present in the object
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    setColumns(() => {
      const collectColumns = props.expandableSubRows
        ? checkForSubRows(
            props.tableBodyData,
            props.expandableHeight || 30
          ).concat(props.tableHeaderData)
        : props.tableHeaderData;

      return collectColumns;
    });
  }, [props.tableHeaderData]);

  return (
    <DataGrid
      className="rdg-light"
      columns={columns}
      rows={props.tableBodyData}
      topSummaryRows={props.summaryRows}
      onRowsChange={props.onRowsChange}
      rowClass={props.rowClass}
      onScroll={props.onScroll}
      rowKeyGetter={(row) => row.id}
      style={{
        ...props.tableStyling,
        height:
          props.tableBodyData &&
          props.tableGrow &&
          props.tableBodyData.length > 0 &&
          // + 1 to take the header row into account.
          (props.tableBodyData.length + 1) *
            (props.rowHeight || DEFAULT_ROW_HEIGHT),
      }}
      headerRowHeight={props.headerRowHeight}
      rowHeight={props.rowHeight}
    />
  );
};

export default ReactDataGrid;
