// @flow
import { useState, useEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import Tippy from '@tippyjs/react';
import SummaryBarGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryBarGraph';
import { ValueVisualisationGraphTranslated as ValueVisualisationGraph } from '@kitman/modules/src/analysis/shared/components/GraphWidget/ValueVisualisationGraph';
import { withNamespaces } from 'react-i18next';
import { IconButton, TextButton } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import SummaryBarDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryBarDefaultSortConfig';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { TcfGraphDataResponse } from '../../types';
import { buildSummaryData, buildValueData } from '../../utils';
import { TopContributingFactorsGraphTranslated as TopContributingFactorsGraph } from '../topContributingFactors';

type Props = {
  variable: InjuryVariable,
  graphData: {
    isLoading: boolean,
    summary: ?Object,
    value: ?Object,
    totalInjuries: ?number,
  },
  isVariablePresent: boolean,
  isVariableSaved: boolean,
  canCreateMetric: boolean,
  canEditMetrics: boolean,
  onAddNewInjuryVariable: Function,
  onOpenRenameVariableModal: Function,
  onUpdateVariable: Function,
  buildVariableGraphs: Function,
  onClickManualRun: Function,
  tcfGraphData: Array<TcfGraphDataResponse>,
  isTcfGraphLoading: boolean,
  fetchTCFGraphData: Function,
};

const VariableVisualisation = (props: I18nProps<Props>) => {
  const [summaryBarViewData, setSummaryBarViewData] = useState(null);
  const [valueVisViewData, setValueVisViewData] = useState(null);

  useEffect(() => {
    const newSummaryData = props.graphData.summary
      ? buildSummaryData(props.graphData.summary)
      : null;
    const newValueData = props.graphData.value
      ? buildValueData(props.graphData.value)
      : null;

    setSummaryBarViewData(newSummaryData);
    setValueVisViewData(newValueData);
  }, [props.graphData]);

  const canViewTCFGraph = () =>
    window.getFlag('display-top-influencing-factors-on-injury-risk-metric');

  useEffect(() => {
    if (props.variable.variable_uuid && canViewTCFGraph()) {
      props.fetchTCFGraphData(props.variable.variable_uuid);
    }
  }, [props.variable]);

  const getStatusText = () => {
    if (props.variable.archived) {
      return props.t('Archived');
    }

    switch (props.variable.status) {
      case 'failed': {
        return props.t('Error');
      }
      case 'in_progress': {
        return props.t('In Progress');
      }
      case 'completed': {
        return '';
      }
      default: {
        return props.t('Setup');
      }
    }
  };

  const getVariableStatusIndicator = () => {
    return (
      <div className="riskAdvisor__statusIndicator">
        <span>{props.t('Status')}:</span>
        <div
          className={classNames('riskAdvisor__status', {
            'riskAdvisor__status--archived': props.variable.archived,
            'riskAdvisor__status--progress':
              props.variable.status === 'in_progress' &&
              !props.variable.archived,
            'riskAdvisor__status--error':
              props.variable.status === 'failed' && !props.variable.archived,
            'riskAdvisor__status--ready':
              props.variable.status === 'completed' && !props.variable.archived,
          })}
        >
          {props.variable.archived ||
          props.variable.status === 'failed' ||
          props.variable.status === 'completed' ? (
            <i
              className={classNames('riskAdvisor__statusIcon', {
                'icon-archive': props.variable.archived,
                'icon-error':
                  props.variable.status === 'failed' &&
                  !props.variable.archived,
                'icon-check':
                  props.variable.status === 'completed' &&
                  !props.variable.archived,
              })}
            />
          ) : null}
          {getStatusText()}
        </div>
      </div>
    );
  };

  const getArchiveControlsContent = () => {
    return props.variable.archived ? (
      <TextButton
        text={props.t('Restore')}
        type="primary"
        onClick={() => props.onUpdateVariable('SET_ARCHIVED')}
      />
    ) : (
      <IconButton
        icon="icon-archive"
        onClick={() => props.onUpdateVariable('SET_ARCHIVED')}
        isDisabled={!props.canEditMetrics || !props.isVariableSaved}
      />
    );
  };

  const renderTopContributingFactorsGraph = () => {
    if (props.isTcfGraphLoading) {
      return (
        <div className="riskAdvisor__topContributingFactorsGraph riskAdvisor__topContributingFactorsGraph--loading">
          <div className="riskAdvisor__placeholder">
            <img
              src="/img/graph-placeholders/column-graph-placeholder.png"
              alt="graph placeholder"
            />
          </div>
        </div>
      );
    }
    return <TopContributingFactorsGraph graphData={props.tcfGraphData} />;
  };

  const totalInjuriesData = {
    date_range: {
      end_date: '',
      start_date: '',
    },
    metrics: [
      {
        series: [
          {
            value: 0,
          },
        ],
      },
    ],
  };

  const populateTotalInjuriesData = (value, startDate, endDate) => {
    totalInjuriesData.metrics[0].series[0].value = value;
    totalInjuriesData.date_range.start_date = startDate;
    totalInjuriesData.date_range.end_date = endDate;
  };

  const renderContent = () => {
    if (valueVisViewData) {
      populateTotalInjuriesData(
        props.graphData.totalInjuries || 0,
        valueVisViewData.date_range.start_date,
        valueVisViewData.date_range.end_date
      );
    }
    if (
      props.variable.name !== '' &&
      (!valueVisViewData || !summaryBarViewData)
    ) {
      return (
        <div className="riskAdvisor__visualisationEmptyState">
          <div className="riskAdvisor__addNewFromEmptyContainer">
            <div className="riskAdvisor__addNewFromEmpty">
              <p>
                {props.t(
                  'No data to display. Use the filters to create a preview.'
                )}
              </p>
            </div>
          </div>
        </div>
      );
    }
    if (props.variable.name !== '') {
      return (
        <div className="riskAdvisor__visualisationContent">
          {valueVisViewData &&
            props.variable.medical_data_redacted !== true && (
              <div className="riskAdvisor__valueVisualisation">
                <div className="riskAdvisor__valueVisualisationGraphHeader">
                  <h4 className="riskAdvisor__valueVisualisationGraphTitle">
                    {props.t('Number of Injuries')}
                  </h4>
                  <Tippy
                    content={
                      <div className="riskAdvisor__infoTooltipContent">
                        <span>
                          {props.t(
                            'Only injuries that are linked to their related games or sessions can be included.'
                          )}
                        </span>
                      </div>
                    }
                    placement="top"
                    maxWidth={350}
                    theme="neutral-tooltip"
                  >
                    <i className="icon-info" />
                  </Tippy>
                </div>
                {props.graphData.isLoading ? (
                  <div className="riskAdvisor__placeholder">
                    <img
                      src="/img/graph-placeholders/value-visualisation-placeholder.png"
                      alt="graph placeholder"
                    />
                  </div>
                ) : (
                  <ValueVisualisationGraph
                    // we only need a small number of props from the data, but they are hardwired in the types
                    // it's out of scope to fix that in this project's timeline
                    // $FlowFixMe
                    graphData={{
                      ...valueVisViewData,
                      name: props.t('Total number of filtered injuries'),
                    }}
                    openRenameGraphModal={() => {}}
                    canSaveGraph={false}
                    showTitle={false}
                    underText={props.t('Filtered injuries')}
                  />
                )}
              </div>
            )}
          {summaryBarViewData &&
            props.variable.medical_data_redacted !== true && (
              <div className="riskAdvisor__summaryBar">
                {props.graphData.isLoading ? (
                  <div className="riskAdvisor__placeholder">
                    <img
                      src="/img/graph-placeholders/bar-graph-placeholder.png"
                      alt="graph placeholder"
                    />
                  </div>
                ) : (
                  <SummaryBarGraph
                    // we only need a small number of props from the data, but they are hardwired in the types
                    // it's out of scope to fix that in this project's timeline
                    // $FlowFixMe
                    graphData={{
                      ...summaryBarViewData,
                      name: props.t('Total number of filtered injuries'),
                    }}
                    openRenameGraphModal={() => {}}
                    graphType="column"
                    canSaveGraph={false}
                    showTitle
                    graphStyle={{ colors: [colors.blue_100] }}
                    sorting={SummaryBarDefaultSortConfig}
                    graphSubType="INJURY_METRIC_CREATION"
                  />
                )}
              </div>
            )}
          {canViewTCFGraph() &&
            props.isVariableSaved &&
            renderTopContributingFactorsGraph()}
        </div>
      );
    }
    return (
      <div className="riskAdvisor__visualisationEmptyState">
        <div className="riskAdvisor__addNewFromEmptyContainer">
          <div className="riskAdvisor__addNewFromEmpty">
            <p>{props.t('Set up an Injury Risk Metric')}</p>
            <IconButton
              icon="icon-add"
              onClick={() => {
                props.onAddNewInjuryVariable();
                props.buildVariableGraphs();
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({ date });
    }

    return date.format('D MMM YYYY');
  };

  return (
    <>
      <div className="riskAdvisor__visualisationHeader">
        <div className="riskAdvisor__title">
          {props.variable.name !== '' ? (
            <>
              <h4>{props.variable.name}</h4>
              {props.variable.created_at && props.variable.created_by && (
                <span>
                  {props.t('Created by {{userName}} on {{creationDate}}', {
                    userName: props.variable.created_by.fullname,
                    creationDate: formatDate(moment(props.variable.created_at)),
                    interpolation: { escapeValue: false },
                  })}
                </span>
              )}
            </>
          ) : null}
        </div>
        <div className="riskAdvisor__controls">
          {getVariableStatusIndicator()}
          {!props.variable.archived && (
            <IconButton
              icon="icon-edit-name"
              onClick={() =>
                props.onOpenRenameVariableModal(false, props.variable.name)
              }
              isDisabled={!props.canEditMetrics || !props.isVariablePresent}
            />
          )}
          <div className="riskAdvisor__archiveControls">
            {getArchiveControlsContent()}
          </div>
          {props.variable.status === 'completed' &&
            !props.variable.archived && (
              <TextButton
                text={props.t('Run Data')}
                type="primary"
                onClick={() => props.onClickManualRun()}
                isDisabled={
                  !props.canCreateMetric ||
                  props.variable.last_prediction_status === 'in_progress' ||
                  props.variable.last_prediction_status === 'triggered'
                }
              />
            )}
        </div>
      </div>
      {renderContent()}
    </>
  );
};

export const VariableVisualisationTranslated = withNamespaces()(
  VariableVisualisation
);
export default VariableVisualisation;
