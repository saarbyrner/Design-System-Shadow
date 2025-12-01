// @flow
import { useSelector, useDispatch } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { buildGenericTextCell } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/cellBuilderCommon';
import type { Row } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/types';
import type { FullSegmentResponse } from '@kitman/services/src/services/dynamicCohorts/Segments/createSegment';
import { useSearchSegmentsQuery } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import { useFilter } from '@kitman/modules/src/DynamicCohorts/shared/utils/hooks/useFilter';
import { manageSegmentsStateKey } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';
import {
  setFilter,
  resetNextId,
} from '@kitman/modules/src/DynamicCohorts/Segments/ListSegments/redux/slices/manageSegmentsSlice';
import { ROW_KEY, buildCellContent } from './cellBuilder';
import type { SegmentsGridType, Column } from './types';

const useSegmentsGrid = (): SegmentsGridType => {
  const dispatch = useDispatch();
  const { nextId } = useSelector((state) => state.manageSegmentsSlice);

  const { filter: searchValue } = useFilter(
    'searchValue',
    manageSegmentsStateKey,
    setFilter
  );
  const { filter: createdBy } = useFilter(
    'createdBy',
    manageSegmentsStateKey,
    setFilter
  );
  const { filter: createdOn } = useFilter(
    'createdOn',
    manageSegmentsStateKey,
    setFilter
  );

  const { filter: labels } = useFilter(
    'labels',
    manageSegmentsStateKey,
    setFilter
  );

  const { isError, isFetching, isSuccess, data, refetch } =
    useSearchSegmentsQuery({
      nextId,
      searchValue,
      createdBy,
      createdOn,
      labels,
    });

  const columns: Array<Column> = [
    {
      id: ROW_KEY.name,
      row_key: ROW_KEY.name,
      content: buildGenericTextCell(i18n.t('Athlete groups')),
    },
    {
      id: ROW_KEY.createdBy,
      row_key: ROW_KEY.createdBy,
      content: buildGenericTextCell(i18n.t('Created by')),
    },
    {
      id: ROW_KEY.createdOn,
      row_key: ROW_KEY.createdOn,
      content: buildGenericTextCell(i18n.t('Created on')),
    },
  ];

  const buildRowData = (
    segmentData?: Array<FullSegmentResponse>,
    columnInput: Array<Column>
  ): ?Array<Row> => {
    return segmentData?.map((segment) => ({
      id: segment.id,
      cells: columnInput.map((column) => ({
        id: column.row_key,
        content: buildCellContent({ row_key: column.row_key, segment }),
      })),
    }));
  };

  const rows = buildRowData(data?.segments, columns);

  const resetSegmentsGrid = async () => {
    if (nextId !== null) {
      dispatch(resetNextId());
    } else {
      await refetch();
    }
  };

  return {
    isGridError: isError,
    isGridFetching: isFetching,
    isGridSuccess: isSuccess,
    segments: data?.segments,
    rows,
    columns,
    nextIdToFetch: data?.next_id,
    resetSegmentsGrid,
  };
};
export default useSegmentsGrid;
