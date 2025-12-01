// @flow
import type { Node, ElementRef } from 'react';
import { useRef, forwardRef, useCallback } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import _get from 'lodash/get';
import classNames from 'classnames';
import {
  TableColumn,
  TableColumnSortable,
  LoadingCell,
  BlankRow,
  SortHandle,
  Row,
  Cell,
} from './components';

type Props = {
  children?: Node,
  className?: string,
  onUpdateColumnOrder?: Function,
};

const TableSortableContainer = SortableContainer(
  forwardRef(({ children, className }, ref) => (
    <table ref={ref} className={classNames('tableWidget__table', className)}>
      {children}
    </table>
  ))
);

const Table = (props: Props) => {
  const tableRef: ElementRef<Object> = useRef(null);
  const onSortEnd = useCallback(
    (...args) => {
      if (typeof props.onUpdateColumnOrder === 'function') {
        props.onUpdateColumnOrder(...args);
      }
    },
    [props.onUpdateColumnOrder]
  );

  return (
    <TableSortableContainer
      ref={tableRef}
      onSortStart={() => {
        const container = tableRef.current.container;
        const helper = tableRef.current.helper;
        const top = parseInt(helper.style.top.replace('px', ''), 10);

        // react-sortable-hoc will hide the target element and create a new element to give the appearance
        // of an element being dragged.
        // The helper is the element that gets dragged. This element is fixed and positioned
        // by the react-sortable-hoc component. Out of the box this looks funny with the current table styles
        // So all these styles are to make the element look exactly like the other columns

        // If the table is scrolled, this positions the helper to where the table is scrolled
        helper.style.top = `${top + container.scrollTop}px`;

        // Making sure the height of the helper is the same as the container, so it doesn't overflow
        helper.style.height = `${tableRef.current.container.clientHeight}px`;

        // Pointer events set to initial so the grabbing cursor appears
        helper.style.pointerEvents = 'initial';

        // Offsetting the scroll position of the element to match how much the container has scrolled
        helper.scrollTop = container.scrollTop;
      }}
      onSortEnd={onSortEnd}
      axis="x"
      lockAxis="x"
      helperContainer={() => _get(tableRef, 'current.container', null)}
      helperClass="tableWidget__column--is-sorting"
      useDragHandle
      lockToContainerEdges
      className={props.className}
    >
      {props.children}
    </TableSortableContainer>
  );
};

Table.Column = TableColumn;
Table.ColumnSortable = TableColumnSortable;
Table.SortHandle = SortHandle;
Table.BlankRow = BlankRow;
Table.Row = Row;
Table.Cell = Cell;
Table.LoadingCell = LoadingCell;

export default Table;
