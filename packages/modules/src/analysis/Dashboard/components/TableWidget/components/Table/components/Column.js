// @flow
import type { Node, ElementRef } from 'react';
import { forwardRef } from 'react';
import { SortableElement } from 'react-sortable-hoc';

type Props = {
  children?: Node,
  className?: string,
};

const TableColumn = forwardRef<Props, ElementRef<any>>((props, ref) => {
  return (
    <tbody ref={ref} className={props.className}>
      {props.children}
    </tbody>
  );
});

const TableColumnSortable = SortableElement(
  forwardRef(({ ...props }, ref) => <TableColumn ref={ref} {...props} />)
);

export { TableColumn, TableColumnSortable };
