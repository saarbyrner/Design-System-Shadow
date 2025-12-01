// @flow
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import type { AthleteInfo } from '@kitman/services/src/services/dynamicCohorts/Segments/searchAthletes';
import { useSearchAthletesQuery } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/services/segmentsApi';
import { buildGenericTextCell } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/cellBuilderCommon';
import type { Row } from '@kitman/modules/src/DynamicCohorts/shared/gridHelpers/types';
import { buildCellContent, ROW_KEY } from './cellBuilder';
import type { AthletesGridType, Column } from './types';

const useAthletesGrid = (): AthletesGridType => {
  const { queryParams } = useSelector((state) => state.segmentSlice);

  const {
    isError,
    isFetching,
    isSuccess,
    data = { athletes: [], next_id: null },
  } = useSearchAthletesQuery(queryParams, {
    skip: !queryParams.expression,
  });

  const columns: Array<Column> = [
    {
      id: ROW_KEY.athlete,
      row_key: ROW_KEY.athlete,
      content: buildGenericTextCell(i18n.t('Athletes')),
    },
  ];

  const buildRowData = (
    athleteData: Array<AthleteInfo>,
    columnsInput: Array<Column>
  ): Array<Row> => {
    return athleteData?.map((athlete) => ({
      id: athlete.id,
      cells: columnsInput.map((column) => ({
        id: column.row_key,
        content: buildCellContent({ row_key: column.row_key, athlete }),
      })),
    }));
  };

  const rows = buildRowData(data?.athletes, columns);

  const emptyTableText = useMemo(() => {
    if (isError) {
      return i18n.t('Error fetching athletes.');
    }
    if (!queryParams.expression) {
      return i18n.t('No conditions set.');
    }
    if (data?.athletes?.length === 0) {
      return i18n.t('No athletes.');
    }
    return '';
  }, [isError, data?.athletes, queryParams]);

  return {
    isGridError: isError,
    isGridFetching: isFetching,
    isGridSuccess: isSuccess,
    athletes: data?.athletes,
    rows,
    columns,
    nextAthleteIdToFetch: data?.next_id,
    emptyTableText,
  };
};
export default useAthletesGrid;
