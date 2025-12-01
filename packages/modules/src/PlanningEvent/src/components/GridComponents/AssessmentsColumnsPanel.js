// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import _intersectionBy from 'lodash/intersectionBy';
import type { StatusVariable } from '@kitman/common/src/types';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import {
  LastXDaysSelector,
  RadioList,
  Select,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import { formatAvailableVariablesForSelect } from '@kitman/common/src/utils/formatAvailableVariables';
import {
  availableSummaries,
  getSourceFromSourceKey,
  getVariableFromSourceKey,
  getCalculationsByType,
} from '@kitman/common/src/utils/status_utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  isOpen: boolean,
  onClose: Function,
  onSave: Function,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  statusVariables: Array<StatusVariable>,
};

const AssessmentsColumnsPanel = (props: I18nProps<Props>) => {
  const [columnType, setColumnType] = useState('status');
  const [selectedStatusVariable, setSelectedStatusVariable] = useState(null);
  const [selectedOrgTrainingVariable, setSelectedOrgTrainingVariable] =
    useState(null);
  const [summary, setSummary] = useState(null);
  const [periodLength, setPeriodLength] = useState(null);

  const summaries =
    selectedStatusVariable && columnType === 'status'
      ? _intersectionBy(
          availableSummaries(
            getSourceFromSourceKey(selectedStatusVariable.source_key),
            getVariableFromSourceKey(selectedStatusVariable.source_key),
            selectedStatusVariable.type
          ),
          getCalculationsByType('simple_and_last'),
          'id'
        )
      : [];

  const getMetricOptions = () => {
    if (columnType === 'status') {
      return formatAvailableVariablesForSelect(props.statusVariables);
    }

    return props.organisationTrainingVariables.map((orgTrainingVariable) => {
      return {
        value: orgTrainingVariable.training_variable.id,
        label: orgTrainingVariable.training_variable.name,
      };
    });
  };

  const handleMetricChange = (selectedMetricId) => {
    let selectedMetric;
    if (columnType === 'status') {
      selectedMetric = props.statusVariables.find(
        (variable) => variable.source_key === selectedMetricId
      );
      setSelectedStatusVariable(selectedMetric);
      setSelectedOrgTrainingVariable(null);
    } else {
      selectedMetric = props.organisationTrainingVariables.find(
        (variable) => variable.training_variable.id === selectedMetricId
      );
      setSelectedOrgTrainingVariable(selectedMetric);
      setSelectedStatusVariable(null);
    }
    setSummary(null);
    setPeriodLength(null);
  };

  return (
    <div className="assessmentsColumnPanel">
      <SlidingPanel
        isOpen={props.isOpen}
        kitmanDesignSystem
        title={props.t('Columns')}
        togglePanel={() => props.onClose()}
      >
        <div className="assessmentsColumnPanel__content">
          <div className="assessmentsColumnPanel__columnType">
            <RadioList
              radioName="column_type"
              options={[
                {
                  name: props.t('Calculated'),
                  value: 'status',
                },
                {
                  name: props.t('Input'),
                  value: 'metric',
                },
              ]}
              change={(value) => {
                setColumnType(value);
                setSelectedStatusVariable(null);
                setSelectedOrgTrainingVariable(null);
              }}
              value={columnType}
              kitmanDesignSystem
            />
          </div>
          <div className="assessmentsColumnPanel__metricSelector">
            <Select
              label={props.t('Metric')}
              options={getMetricOptions()}
              onChange={(selectedMetricId) =>
                handleMetricChange(selectedMetricId)
              }
              onClear={() => {}}
              value={
                columnType === 'status'
                  ? selectedStatusVariable?.source_key
                  : selectedOrgTrainingVariable?.training_variable.id
              }
            />
          </div>
          {columnType === 'status' ? (
            <>
              <div className="assessmentsColumnPanel__calculation">
                <Select
                  label={props.t('Calculation')}
                  value={summary}
                  options={
                    columnType === 'status'
                      ? summaries.map((summaryItem) => {
                          return {
                            value: summaryItem.id,
                            label: summaryItem.title,
                          };
                        })
                      : []
                  }
                  onChange={(selectedSummary) => {
                    setSummary(selectedSummary);
                  }}
                  onClear={() => {}}
                  isDisabled={!selectedStatusVariable}
                />
              </div>
              <div className="assessmentsColumnPanel__periodSelector">
                <LastXDaysSelector
                  onChange={setPeriodLength}
                  periodLength={periodLength}
                  kitmanDesignSystem
                />
              </div>
            </>
          ) : null}
        </div>
        <div className="slidingPanelActions">
          <TextButton
            onClick={() => {
              props.onClose();
            }}
            type="secondary"
            kitmanDesignSystem
            text={props.t('Cancel')}
          />
          <TextButton
            onClick={() => {
              let item = {};

              if (columnType === 'status') {
                item = {
                  columnType,
                  columnName: getVariableFromSourceKey(
                    selectedStatusVariable?.source_key
                  ),
                  planningStatusDefinition: {
                    variables: [
                      {
                        source: getSourceFromSourceKey(
                          selectedStatusVariable?.source_key
                        ),
                        variable: getVariableFromSourceKey(
                          selectedStatusVariable?.source_key
                        ),
                      },
                    ],
                    summary,
                    period_length: periodLength,
                    period_scope: 'last_x_days',
                  },
                };
              } else {
                item = {
                  columnType,
                  columnName:
                    selectedOrgTrainingVariable?.training_variable.name,
                  trainingVariableId:
                    selectedOrgTrainingVariable?.training_variable.id,
                };
              }

              props.onSave(item);
              props.onClose();
            }}
            type="primary"
            kitmanDesignSystem
            text={props.t('Save')}
          />
        </div>
      </SlidingPanel>
    </div>
  );
};

export default AssessmentsColumnsPanel;
export const AssessmentsColumnsPanelTranslated = withNamespaces()(
  AssessmentsColumnsPanel
);
