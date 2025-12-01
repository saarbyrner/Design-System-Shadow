// @flow

// import type { ComponentType, Node } from 'react';
import uuid from 'uuid';
import {
  TextCell,
  TextHeader,
} from '@kitman/modules/src/Medical/shared/components/AllergiesTab/components/AllergyTableCells';

type CellData = { cell: { value: string } };
type GridColumn = {
  valueName: string,
  accessor: string,
  width: number,
};

export const buildGridColumn = (column: GridColumn) => ({
  Header: () => <TextHeader key={uuid()} value={column.valueName} />,
  accessor: column.accessor,
  width: column.width,
  Cell: (data: CellData) => (
    <TextCell key={uuid()} className value={data.cell.value} />
  ),
});
