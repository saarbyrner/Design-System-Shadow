// @flow
import type { Node } from 'react';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import throttle from 'lodash/throttle';
import { withNamespaces } from 'react-i18next';

import { TooltipMenu } from '@kitman/components';
import CircularProgress from '@mui/material/CircularProgress';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getNextSortingOrder } from './utils';

export type Cell = {
  id: number | string,
  content: string | Node,
  isBolder?: boolean,
  isHeader?: boolean,
  allowOverflow?: boolean,
  style?: Object,
  row_key?: string | number,
};

export type Cells = Array<Cell>;

export type RowAction = {
  id: number | string,
  text: string,
  onCallAction: Function,
};
export type RowActions = Array<RowAction>;

export type Row = {
  id: number | string,
  cells: Cells,
  classnames?: { [string]: boolean },
  rowActions?: Array<RowAction>,
};

export type Rows = Array<Row>;
export type GridSorting = {
  column: string | null,
  order: 'ASCENDING' | 'DESCENDING' | null,
};

type Props = {
  columns: Cells,
  rows: Rows,
  rowActions?: RowActions,
  isLoading?: boolean,
  isFullyLoaded?: boolean,
  emptyTableText?: string,
  isTableEmpty?: boolean,
  fetchMoreData?: Function,
  scrollOnBody: boolean,
  maxHeight: string,
  minHeight: string,
  sortableColumns: Array<string>,
  gridSorting: GridSorting,
  onClickColumnSorting: Function,
};

const DataGrid = ({
  columns,
  rows,
  rowActions,
  isFullyLoaded,
  isLoading,
  emptyTableText,
  isTableEmpty,
  fetchMoreData,
  scrollOnBody,
  maxHeight,
  minHeight,
  sortableColumns,
  gridSorting,
  onClickColumnSorting,
  t,
}: I18nProps<Props>) => {
  const tableContainerRef = useRef(null);
  const tableElementRef = useRef({});

  const handleScroll = (scrollElement) => {
    const scrollRatioLimit = window.featureFlags['fix-lazy-load-debounce']
      ? 0.3
      : 0.5;
    if (!scrollElement || isLoading || isFullyLoaded) return;

    const scrollableHeight =
      scrollElement.scrollHeight - scrollElement.clientHeight;
    const scrollRatio = scrollElement.scrollTop / scrollableHeight;

    // Fetch more data when the user scrolls after half (testing 30% - per Product)the loaded content
    // or the element is not scrollable (the element has not reached max-height yet)
    if (scrollableHeight === 0 || scrollRatio > scrollRatioLimit) {
      fetchMoreData?.();
    }
  };

  const getScrollEl = () =>
    scrollOnBody ? document.documentElement : tableContainerRef.current;

  const debouncedHandleScroll = useDebouncedCallback(() => {
    const scrollEl = getScrollEl();
    handleScroll(scrollEl);
  }, 100);

  const throttledHandleScroll = throttle(() => {
    if (!isFullyLoaded) {
      const scrollEl = getScrollEl();
      handleScroll(scrollEl);
    }
  }, 100);

  const headerCellClick = (cellId) => {
    if (sortableColumns.includes(cellId)) {
      onClickColumnSorting(getNextSortingOrder(cellId, gridSorting));
    }
  };

  /*
   * When the grid has not reached mach-height, the scroll event is not fired.
   * We need to manually trigger the scroll event so we load more data if needed.
   */
  useEffect(() => {
    const scrollEl = getScrollEl();
    if (!scrollEl) return;
    scrollEl.dispatchEvent(new Event('scroll'));
  }, [rows.length]);

  useEffect(() => {
    // this event listener is required when the <DataGrid/> component is
    // rendered with an ERB HTML template because the scroll bar
    // is connected to the Document in those files
    if (!window.featureFlags['fix-lazy-load-debounce']) {
      document.addEventListener('scroll', debouncedHandleScroll);
    } else {
      document.addEventListener('scroll', throttledHandleScroll);
    }

    return function cleanup() {
      if (!window.featureFlags['fix-lazy-load-debounce']) {
        document.removeEventListener('scroll', debouncedHandleScroll);
      } else {
        document.removeEventListener('scroll', throttledHandleScroll);
      }
    };
  });

  return (
    <div
      id="dataGridWrapper"
      className="dataGrid"
      onScroll={
        window.featureFlags['fix-lazy-load-debounce']
          ? throttledHandleScroll
          : debouncedHandleScroll
      }
      style={{ maxHeight, minHeight }}
      ref={tableContainerRef}
    >
      <span className="dataGrid__headLine" />
      <table ref={tableElementRef} className="dataGrid__table">
        <thead className="dataGrid__head">
          <tr className="dataGrid__row">
            {columns.map((cell) => (
              <th
                scope="col"
                key={cell.id}
                className={classNames('dataGrid__cell', {
                  'dataGrid__cell--allowOverflow': cell.allowOverflow,
                  'dataGrid__cell--bolder': cell.isBolder,
                  'dataGrid__cell--sortable': sortableColumns.includes(cell.id),
                  'dataGrid__cell--sortedColumn':
                    gridSorting.column === cell.id,
                })}
                css={cell.style}
                onClick={() => headerCellClick(cell.id)}
              >
                {cell.content}

                {sortableColumns.includes(cell.id) && (
                  <div className="dataGrid__sortIndicators">
                    <i
                      className={classNames('icon-up dataGrid__sortIndicator', {
                        'dataGrid__sortIndicator--active':
                          gridSorting.column === cell.id &&
                          gridSorting.order === 'ASCENDING',
                      })}
                    />
                    <i
                      className={classNames(
                        'icon-down dataGrid__sortIndicator',
                        {
                          'dataGrid__sortIndicator--active':
                            gridSorting.column === cell.id &&
                            gridSorting.order === 'DESCENDING',
                        }
                      )}
                    />
                  </div>
                )}
              </th>
            ))}
            <th className="dataGrid__fillerCell" />
          </tr>
        </thead>

        <tbody className="dataGrid__body">
          {rows.map((row) => {
            const menuItems = row.rowActions || rowActions;
            return (
              <tr
                className={classNames('dataGrid__row', row.classnames || {})}
                key={row.id}
              >
                {row.cells.map((cell, index) => (
                  <td
                    key={cell.id}
                    className={classNames('dataGrid__cell', {
                      'dataGrid__cell--allowOverflow': cell.allowOverflow,
                      'dataGrid__cell--bolder': cell.isBolder,
                    })}
                    css={cell.style}
                    data-mobile-label={
                      (columns[index] &&
                        typeof columns[index].content === 'string' &&
                        columns[index].content) ||
                      ''
                    }
                  >
                    {cell.content}
                  </td>
                ))}
                {menuItems ? (
                  <td className="dataGrid__rowActionsCell">
                    <TooltipMenu
                      placement="bottom-start"
                      offset={[0, 0]}
                      menuItems={menuItems.map((rowAction) => ({
                        key: rowAction.id,
                        description: rowAction.text,
                        onClick: () => rowAction.onCallAction(row.id),
                      }))}
                      tooltipTriggerElement={
                        <button type="button">
                          <i className="icon-more" />
                        </button>
                      }
                      kitmanDesignSystem
                    />
                  </td>
                ) : (
                  <td className="dataGrid__fillerCell" />
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {isFullyLoaded && (isTableEmpty || rows.length === 0) && (
        <div className="dataGrid__emptyTableText">{emptyTableText}</div>
      )}

      {!isFullyLoaded && (
        <div
          className="dataGrid__loading"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '12px 0',
          }}
        >
          <CircularProgress size={20} thickness={5} aria-label={t('Loading')} />
          <span>{t('Loading')}…</span>
        </div>
      )}
    </div>
  );
};

DataGrid.defaultProps = {
  isLoading: false,
  isFullyLoaded: true,
  isTableEmpty: false,
  emptyTableText: '',
  maxHeight: 'auto',
  minHeight: 'auto',
  sortableColumns: [],
  fetchMoreData: () => {},
  gridSorting: { column: null, order: null },
  onClickColumnSorting: () => {},
};

export const DataGridTranslated = withNamespaces()(DataGrid);
export default DataGrid;
