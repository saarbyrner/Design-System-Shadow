// @flow
import type { Node } from 'react';
import type { Row } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/types';
import type { SegmentResponse } from '@kitman/services/src/services/dynamicCohorts/Segments/searchSegments';
import { ROW_KEY } from './cellBuilder';

export type RowKeyType = $Keys<typeof ROW_KEY>;

export type Column = {
  id: string,
  row_key: RowKeyType,
  content: Node,
};

export type SegmentsGridType = {
  isGridError: boolean,
  isGridFetching: boolean,
  isGridSuccess: boolean,
  segments: Array<SegmentResponse>,
  rows: ?Array<Row>,
  columns: Array<Column>,
  nextIdToFetch: number | null,
  resetSegmentsGrid: () => Promise<void>,
};
