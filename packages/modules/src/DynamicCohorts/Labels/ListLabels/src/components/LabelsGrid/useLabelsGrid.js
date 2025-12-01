// @flow
import { useMemo } from 'react';
import type { FullLabelResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/createLabel';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { manageLabelsStateKey } from '@kitman/modules/src/DynamicCohorts/shared/utils/consts';
import { useFilter } from '@kitman/modules/src/DynamicCohorts/shared/utils/hooks/useFilter';
import { buildGenericTextCell } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/cellBuilderCommon';
import {
  setFilter,
  resetNextId,
} from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/manageLabelsSlice';
import {
  buildCellContent,
  ROW_KEY,
} from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/src/components/LabelsGrid/cellBuilder';
import { useSearchLabelsQuery } from '@kitman/modules/src/OrganisationSettings/src/components/DynamicCohorts/ManageLabels/redux/services/labelsApi';
import type {
  LabelsGridType,
  Column,
} from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/src/components/LabelsGrid/types';
import type { Row } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/types';

const useLabelsGrid = (): LabelsGridType => {
  const dispatch = useDispatch();
  const { nextId } = useSelector((state) => state.manageLabelsSlice);

  const { filter: searchValue } = useFilter(
    'searchValue',
    manageLabelsStateKey,
    setFilter
  );
  const { filter: createdBy } = useFilter(
    'createdBy',
    manageLabelsStateKey,
    setFilter
  );
  const { filter: createdOn } = useFilter(
    'createdOn',
    manageLabelsStateKey,
    setFilter
  );

  const { isError, isLoading, isSuccess, data, refetch } = useSearchLabelsQuery(
    {
      nextId,
      searchValue,
      createdBy,
      createdOn,
    }
  );

  const columns: Array<Column> = useMemo(
    () => [
      {
        id: ROW_KEY.name,
        row_key: ROW_KEY.name,
        content: buildGenericTextCell(i18n.t('Athlete labels')),
      },
      {
        id: ROW_KEY.description,
        row_key: ROW_KEY.description,
        content: buildGenericTextCell(i18n.t('Description')),
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
    ],
    []
  );

  const buildRowData = (labelData: Array<FullLabelResponse>): Array<Row> => {
    return labelData?.map((label) => ({
      id: label.id,
      cells: columns.map((column) => ({
        id: column.row_key,
        content: buildCellContent({ row_key: column.row_key, label }),
      })),
    }));
  };

  const rows = useMemo(() => buildRowData(data?.labels), [data?.labels]);

  const resetLabelsGrid = async () => {
    if (nextId !== null) {
      dispatch(resetNextId());
    } else {
      await refetch();
    }
  };

  return {
    isGridError: isError,
    isGridLoading: isLoading,
    isGridSuccess: isSuccess,
    labels: data?.labels,
    rows,
    columns,
    nextIdToFetch: data?.next_id,
    resetLabelsGrid,
  };
};
export default useLabelsGrid;
