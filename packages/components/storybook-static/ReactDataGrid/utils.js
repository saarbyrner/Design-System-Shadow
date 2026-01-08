// @flow
import type { HeaderData } from '@kitman/components/src/ReactDataGrid';
import CellExpanderFormatter from './CellExpanderFormatter';
/* check if sub_rows is present adding an expander if so */
export const checkForSubRows = (
  responseData: Array<HeaderData>,
  expandableHeight: number
) => {
  const checkIfSubRowsArePresent = responseData.some((item) =>
    Object.keys(item).includes('sub_rows')
  );

  const columns = [];
  if (checkIfSubRowsArePresent) {
    columns.push({
      key: 'expanded',
      name: '',
      minWidth: expandableHeight,
      width: expandableHeight,
      frozen: true,
      formatter({
        row,
        isCellSelected,
        onRowChange,
      }: {
        row: any,
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
