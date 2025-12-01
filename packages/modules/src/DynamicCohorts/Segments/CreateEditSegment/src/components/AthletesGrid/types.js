// @flow
import { ROW_KEY } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/src/components/AthletesGrid/cellBuilder';
import type { Node } from 'react';
import type { AthleteInfo } from '@kitman/services/src/services/dynamicCohorts/Segments/searchAthletes';
import type { Predicate } from '@kitman/modules/src/ConditionalFields/shared/types';
import type { Row } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/types';

export type RowKeyType = $Keys<typeof ROW_KEY>;
export type Column = {
  id: string,
  row_key: RowKeyType,
  content: Node,
};

export type AthletesGridType = {
  isGridError: boolean,
  isGridFetching: boolean,
  isGridSuccess: boolean,
  athletes: Array<AthleteInfo>,
  rows: Array<Row>,
  columns: Array<Column>,
  nextAthleteIdToFetch: number | null,
  emptyTableText: string,
};

export type QueryParam = {
  expression: ?Predicate,
  nextId: number | null,
};
