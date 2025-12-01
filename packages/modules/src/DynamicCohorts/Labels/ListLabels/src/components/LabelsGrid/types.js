// @flow
import type { FullLabelResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/createLabel';
import type { Node } from 'react';
import { ROW_KEY } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/src/components/LabelsGrid/cellBuilder';
import type { Row } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/types';

export type Column = {
  id: string,
  row_key: $Keys<typeof ROW_KEY>,
  content: Node,
};

export type LabelsGridType = {
  isGridError: boolean,
  isGridLoading: boolean,
  isGridSuccess: boolean,
  labels: Array<FullLabelResponse>,
  rows: Array<Row>,
  columns: Array<Column>,
  nextIdToFetch: number | null,
  resetLabelsGrid: () => Promise<void>,
};
