// @flow
import CellExpanderFormatter from './CellExpanderFormatter';

export type responseDataRow = {
  [string]: any,
  sub_rows?: any[],
  expanded: boolean,
  type: string,
};

const checkForSubRows = (responseData: Array<responseDataRow>) => {
  const checkIfSubRowsArePresent = responseData.some((item) =>
    Object.keys(item).includes('sub_rows')
  );

  const columns = [];
  if (checkIfSubRowsArePresent) {
    columns.push({
      key: 'expanded',
      name: '',
      minWidth: 30,
      width: 30,
      frozen: true,
      formatter({
        row,
        isCellSelected,
        onRowChange,
      }: {
        row: responseDataRow,
        isCellSelected: boolean,
        onRowChange: Function,
      }) {
        return row.sub_rows ? (
          <CellExpanderFormatter
            expanded={row.expanded}
            isCellSelected={isCellSelected}
            onCellExpand={() => {
              onRowChange({ ...row, expanded: !row.expanded });
            }}
          />
        ) : null;
      },
    });
  }
  return columns;
};

export default checkForSubRows;
