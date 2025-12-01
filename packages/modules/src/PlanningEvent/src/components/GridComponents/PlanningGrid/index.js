// @flow
import { withNamespaces } from 'react-i18next';
import { AppStatus, DataGrid } from '@kitman/components';
import type { GridData } from '../../../../types';

type Props = {
  getHeaderCell: Function,
  emptyText: string,
  fetchMoreData: Function,
  hasRequestFailed: boolean,
  isCommentsSidePanelOpen: boolean,
  isFullyLoaded: boolean,
  isLoading: boolean,
  grid: GridData,
  allowOverflow?: Function,
  getCellContent: Function,
  selectedRowId: number,
};

const PlanningGrid = (props: Props) => {
  const getGridColumns = () => {
    const columns = props.grid.columns.map((column) => {
      return props.getHeaderCell(column);
    });

    return columns;
  };

  const contentIsAnObject = (content) =>
    typeof content === 'object' &&
    content !== null &&
    (Object.keys(content).includes('value') ||
      Object.keys(content).includes('name'));

  const getGridRows = () => {
    const gridRows = props.grid.rows.map((row) => {
      const cells = props.grid.columns.map((column) => {
        const content = props.getCellContent(column, row);
        const cellValue = contentIsAnObject(content)
          ? content.value || content.name
          : content;
        return {
          id: column.row_key,
          content: cellValue,
          allowOverflow: props.allowOverflow
            ? props.allowOverflow(column)
            : false,
        };
      });

      return {
        id: row.id,
        cells,
        classnames: {
          athlete__row: true,
          'athlete__row--selected':
            row.id === props.selectedRowId && props.isCommentsSidePanelOpen,
        },
      };
    });

    return gridRows;
  };

  return (
    <div className="planningEventGridTab__grid">
      <DataGrid
        columns={getGridColumns()}
        rows={getGridRows()}
        emptyTableText={props.emptyText}
        isTableEmpty={props.grid.rows.length === 0}
        isFullyLoaded={props.isFullyLoaded}
        fetchMoreData={props.fetchMoreData}
        isLoading={props.isLoading}
        maxHeight="54vh"
        minHeight="54vh"
      />
      {props.hasRequestFailed && <AppStatus status="error" />}
    </div>
  );
};

export const PlanningGridTranslated = withNamespaces()(PlanningGrid);
export default PlanningGrid;
