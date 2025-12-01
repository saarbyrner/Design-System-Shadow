// @flow
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { colors } from '@kitman/common/src/variables';
import { AppStatus } from '@kitman/components';
import type { GetBenchmarkReportParams } from '@kitman/services/src/services/benchmarking/getBenchmarkingReport';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { getColumnsData } from '@kitman/modules/src/analysis/BenchmarkReport/utils';

import { isBenchmarkReportParamsValid } from './utils/utils';
import { DataGridTableTranslated as DataGridTable } from './components/DataGridTable';
import TableLegendItem from './components/TableLegendItem';
import { EmptyStateTranslated as EmptyState } from '../EmptyState';
import { dataGridTableContainerStyles, dataGridLegendStyles } from './styles';
import { useGetBenchmarkReportQuery } from '../../redux/service';

type Props = {
  benchmarkReportParams: GetBenchmarkReportParams,
};

const Table = (props: I18nProps<Props>) => {
  const {
    data: rowsData,
    isFetching,
    isError,
  } = useGetBenchmarkReportQuery(props.benchmarkReportParams, {
    skip: !isBenchmarkReportParamsValid(props.benchmarkReportParams),
  });
  const { organisation } = useOrganisation();
  // This needs to be revisited at a later date, as this is both unclear what the attribute is doing
  // and not scalable. A proper method for identifying a clubs category will be agreed with BE.
  const isCat1Club = organisation?.benchmark_reporting;
  const hasNoData = !rowsData || (rowsData && rowsData.length === 0);

  const renderEmptyState = () => {
    const title = isError
      ? props.t('Something went wrong')
      : props.t('No data available');
    const description = isError
      ? props.t(
          'There was a problem generating results - Try updating your filters'
        )
      : props.t(
          'No data available for current selection - Try updating your filters'
        );
    const icon = isError ? 'icon-error' : 'icon-bar-chart-reporting';

    return <EmptyState icon={icon} title={title} infoMessage={description} />;
  };

  return (
    <div css={dataGridTableContainerStyles.tableRoot}>
      <div css={dataGridTableContainerStyles.tableHeader}>
        <h2 css={dataGridTableContainerStyles.tableHeaderTitle}>
          {props.t('Results')}
        </h2>
      </div>

      {isFetching && (
        <AppStatus
          status="loading"
          message={`${props.t('Loading results')}...`}
          secondaryMessage={props.t('This may take several minutes')}
          isEmbed
        />
      )}

      {!isFetching && !hasNoData && !isError && (
        <div css={dataGridTableContainerStyles.tableContainer}>
          {isCat1Club && (
            <div css={dataGridLegendStyles.legendContainer}>
              <ul css={dataGridLegendStyles.legend}>
                <li css={dataGridLegendStyles.legendItem}>
                  <TableLegendItem
                    strokeColor={colors.neutral_200}
                    fill={colors.white}
                    labelText={`${props.t('National')} (${props.t('white')})`}
                    resultTypeLabel={`national ${props.t('color legend')}`}
                  />
                </li>
                <li css={dataGridLegendStyles.legendItem}>
                  <TableLegendItem
                    strokeColor={colors.neutral_200}
                    fill={colors.purple_100}
                    labelText={`${props.t('My club')} (${props.t('purple')})`}
                    resultTypeLabel={`my_club ${props.t('color legend')}`}
                  />
                </li>
                <li css={dataGridLegendStyles.legendItem}>
                  <TableLegendItem
                    strokeColor={colors.neutral_200}
                    fill={colors.yellow_100}
                    labelText={`${props.t('Individual athletes')} (${props.t(
                      'yellow'
                    )})`}
                    resultTypeLabel={`individual ${props.t('color legend')}`}
                  />
                </li>
              </ul>
            </div>
          )}

          <DataGridTable
            columnsData={getColumnsData().filter(({ field }) =>
              rowsData.some((row) => row[field] !== null)
            )}
            rowsData={rowsData.map((row, i) => ({
              // id must go first to act as a fallback in the case when no id
              // is provided by the back end, but not to overwrite it in case
              // it’s present.
              id: i,
              ...row,
            }))}
          />
        </div>
      )}

      {!isFetching && (hasNoData || isError) && renderEmptyState()}
    </div>
  );
};

export const TableTranslated: ComponentType<Props> = withNamespaces()(Table);
export default Table;
