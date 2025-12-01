// @flow
import type { Node } from 'react';

export type DataCell = {
  id: string,
  content: Node,
};

export type Row = {
  id: number | string,
  cells: Array<DataCell>,
  classnames?: Object,
};
