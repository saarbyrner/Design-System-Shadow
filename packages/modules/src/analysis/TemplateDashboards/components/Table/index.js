// @flow
import { withNamespaces } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { DelayedLoadingFeedback, TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useCSVExport from '@kitman/common/src/hooks/useCSVExport';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { setSortedData as setSortedDataAction } from '@kitman/modules/src/analysis/TemplateDashboards/redux/slices/filters';

import {
  useGetGrowthMaturationDataQuery,
  useGetAllSquadAthletesQuery,
} from '../../redux/services/templateDashboards';
import useFilterValues from '../../hooks/useFilterValues';
import {
  getGrowthAndMaturationColumns,
  formatCSVData,
  SortingOrders,
  getAthleteById,
  sortData,
} from './utils';
import styles from './styles';
import Column from './Column/Column';
import { ColumnHeaderTranslated as ColumnHeader } from './ColumnHeader/ColumnHeader';
import { isGrowthAndMaturationReport } from '../../utils';

const Table = (props: I18nProps<{}>) => {
  const { trackEvent } = useEventTracking();
  const dispatch = useDispatch();

  const { population } = useFilterValues(['population']);

  const { data, isLoading } = useGetGrowthMaturationDataQuery(population);
  const { data: allSquadAthletes = { squads: [] } } =
    useGetAllSquadAthletesQuery(
      isGrowthAndMaturationReport() ? {} : { refreshCache: true }
    );

  const [sortOrder, setSortOrder] = useState(SortingOrders.asc);
  const [sortId, setSortId] = useState('');
  const [sortedData, setSortedData] = useState([]);

  const handleSortData = useCallback(
    (sortBy?: string, sortColumn?: string) => {
      let newData = data;
      if (sortBy && sortColumn) {
        newData = sortData(data, allSquadAthletes, sortBy, sortColumn);
      }
      if (!sortColumn) return;
      const humanReadableColumnName = getGrowthAndMaturationColumns().find(
        ({ id }) => id === sortColumn
      )?.label;
      trackEvent(
        `Analysis — Growth & Maturation Report — Sort by ${
          humanReadableColumnName ?? sortColumn
        }`
      );
      setSortedData(newData);
      dispatch(setSortedDataAction({ data: newData ?? [] }));
    },
    [data, dispatch, allSquadAthletes]
  );

  useEffect(() => {
    if (data) {
      setSortId('athlete_id');
      handleSortData(SortingOrders.asc, 'athlete_id');
    }
  }, [data]);

  const downloadCSV = useCSVExport(
    'Growth-and-maturation-table',
    formatCSVData(allSquadAthletes, sortedData)
  );

  const getTableMenuItems = () => [
    {
      description: props.t('Export CSV'),
      icon: 'file-icon-csv',
      onClick: downloadCSV,
    },
  ];

  const renderColumns = (rowData) => {
    return rowData.map((row) => {
      const athlete = getAthleteById(allSquadAthletes, row.athlete_id);
      return <Column key={row.athlete_id} rowData={row} athlete={athlete} />;
    });
  };

  if (isLoading) {
    return <DelayedLoadingFeedback />;
  }

  return (
    <div css={styles.wrapper}>
      <TooltipMenu
        placement="bottom-end"
        menuItems={getTableMenuItems()}
        tooltipTriggerElement={
          <i
            data-testid="table-icon"
            className="icon-more"
            css={styles.tableIcon}
          />
        }
        kitmanDesignSystem
      />
      <div css={styles.container}>
        <table css={styles.table}>
          <thead css={styles.sticky}>
            <tr>
              {getGrowthAndMaturationColumns().map((column) => {
                return (
                  <ColumnHeader
                    key={column.id}
                    column={column}
                    sortOrder={sortOrder}
                    sortId={sortId}
                    setSortId={setSortId}
                    setSortOrder={setSortOrder}
                    handleSortData={handleSortData}
                  />
                );
              })}
            </tr>
          </thead>
          <tbody>{sortedData && renderColumns(sortedData)}</tbody>
        </table>
      </div>
    </div>
  );
};

export const TableTranslated = withNamespaces()(Table);
export default Table;
