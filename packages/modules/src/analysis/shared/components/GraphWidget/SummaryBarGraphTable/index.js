// @flow
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import { TrackEvent } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { buildGraphLink } from '@kitman/modules/src/analysis/shared/resources/graph/GraphUtils';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';
import { isDrillGraph } from '../../../utils';
import type { SummaryBarGraphData } from '../../../types';

type FormatedTableData = {
  seriesList: Array<{
    name: string,
    metricIndex: number,
  }>,
  populationList: Array<string>,
  lines: {
    [string]: {
      columns: {
        [string]: {
          value: number,
          population_type: string,
          population_id: string,
        },
      },
    },
  },
};

type Props = {
  graphData: SummaryBarGraphData,
  showTitle?: boolean,
  openRenameGraphModal?: Function,
  canSaveGraph?: boolean,
  condensed?: boolean,
};

// Returns the list of series and population.
// The order of these lists are respected in the table.
// The line object is a convenient ways of accessing.
// each line and column of the table through hashes.
// Example: line['Entire Squad'].column['No. of Injury Occurrences']
const summaryBarTableFormatting = (
  graphData: SummaryBarGraphData
): FormatedTableData => {
  const lines = {};
  const seriesList = [];
  const populationList = [];

  graphData.metrics.forEach((metric, metricIndex) => {
    metric.series.forEach((series) => {
      const seriesName = series.name;
      seriesList.push({
        name: seriesName,
        metricIndex,
      });

      series.datapoints.forEach((datapoint) => {
        const population = datapoint.name;

        // We don't want duplicated population.
        // If the population doesn't have a line, create it, and add the column.
        // Otherwise, just add the column.
        if (!populationList.includes(population)) {
          populationList.push(population);
          lines[population] = { columns: {} };
        }

        lines[population].columns[seriesName] = {
          value: datapoint.y,
          population_type: datapoint.population_type,
          population_id: datapoint.population_id,
        };
      });
    });
  });

  return {
    seriesList,
    populationList,
    lines,
  };
};

const SummaryBarGraphTable = (props: I18nProps<Props>) => {
  const tableData = summaryBarTableFormatting(props.graphData);

  const onClickValueVisualisation = (
    metricIndex,
    populationType,
    populationId
  ) => {
    const metric = props.graphData.metrics[metricIndex];
    const linkedDashboardId = metric.linked_dashboard_id;

    if (linkedDashboardId && !isDrillGraph(props.graphData)) {
      TrackEvent('Graph Dashboard', 'Click', 'Click data point link');

      const graphLink = buildGraphLink({
        linkedDashboardId: metric.linked_dashboard_id,
        populationType,
        populationId,
        timePeriod: props.graphData.time_period,
        dateRange: props.graphData.date_range,
        timePeriodLength: metric.status
          ? metric.status.time_period_length
          : metric.time_period_length,
      });
      window.location.assign(graphLink);
    }
  };

  return (
    <>
      <GraphDescription
        showTitle={props.showTitle}
        graphData={props.graphData}
        graphGroup="summary_bar"
        openRenameGraphModal={props.openRenameGraphModal}
        condensed={props.condensed}
        canSaveGraph={props.canSaveGraph}
      />
      <div
        className={classNames('summaryBarGraphTable', {
          'summaryBarGraphTable--condensed': props.condensed,
        })}
      >
        <div className="summaryBarGraphTable__fixed">
          <table className="table km-table">
            <thead>
              <tr>
                <th>{props.t('Name')}</th>
              </tr>
            </thead>
            <tbody>
              {tableData.populationList.map((populationName) => (
                <tr key={populationName}>
                  <td key={populationName}>{populationName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="summaryBarGraphTable__scrollable">
          <table className="table km-table">
            <thead>
              <tr>
                {tableData.seriesList.map((series) => (
                  <th key={series.name}>{series.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.populationList.map((populationName) => (
                <tr key={populationName}>
                  {tableData.seriesList.map((series) => (
                    <td
                      key={series.name}
                      onClick={() =>
                        onClickValueVisualisation(
                          series.metricIndex,
                          tableData.lines[populationName].columns[series.name]
                            .population_type,
                          tableData.lines[populationName].columns[series.name]
                            .population_id
                        )
                      }
                      className={classNames({
                        summaryDonutGraphTable__link:
                          props.graphData.metrics[series.metricIndex]
                            .linked_dashboard_id &&
                          !isDrillGraph(props.graphData),
                      })}
                    >
                      {tableData.lines[populationName].columns[series.name]
                        ? tableData.lines[populationName].columns[series.name]
                            .value || '-'
                        : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export const SummaryBarGraphTableTranslated =
  withNamespaces()(SummaryBarGraphTable);
export default SummaryBarGraphTable;
