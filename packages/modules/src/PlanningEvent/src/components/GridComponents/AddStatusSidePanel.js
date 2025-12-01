// @flow
import { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import _intersectionBy from 'lodash/intersectionBy';

import {
  Dropdown,
  FormValidator,
  PeriodScopeSelector,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import MetricSelector from '@kitman/modules/src/StatusForm/MetricSelector';
import type { StatusVariable } from '@kitman/common/src/types';
import {
  availableSummaries,
  getSourceFromSourceKey,
  getVariableFromSourceKey,
  getCalculationsByType,
} from '@kitman/common/src/utils/status_utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import performanceAndCoachingEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceAndCoaching';
import type { Event } from '@kitman/common/src/types/Event';
import { getAddColumnToParticipantsOrCollectionTabTable } from '@kitman/common/src/utils/TrackingData/src/data/planningHub/getPlanningHubEventData';

type Props = {
  event: Event,
  isOpen: boolean,
  onClose: Function,
  onSave: Function,
  statusVariables: Array<StatusVariable>,
  columns: Array<Object>,
  tab: '#participants' | '#collection',
};

const AddStatusSidePanel = (props: I18nProps<Props>) => {
  const { trackEvent } = useEventTracking();

  const [statusVariable, setStatusVariable] = useState(null);
  const [summary, setSummary] = useState(null);
  const [periodLength, setPeriodLength] = useState(null);
  const [periodScope, setPeriodScope] = useState(null);
  const [showDuplicateColumnError, setShowDuplicateColumnError] =
    useState(false);
  const [isSaveDisabled, setSaveDisabled] = useState(false);

  const summaries = statusVariable
    ? _intersectionBy(
        availableSummaries(
          getSourceFromSourceKey(statusVariable.source_key),
          getVariableFromSourceKey(statusVariable.source_key),
          statusVariable.type
        ),
        getCalculationsByType('simple_and_last'),
        'id'
      )
    : [];

  const isDuplicateColumns = (): boolean => {
    let isDupe = false;

    if (props.columns != null) {
      props.columns.forEach((col) => {
        if (
          col.status_definition &&
          col.status_definition.period_length === periodLength &&
          col.status_definition.period_scope === periodScope &&
          col.status_definition.summary === summary &&
          col.status_definition.variables[0].source ===
            getSourceFromSourceKey(statusVariable?.source_key) &&
          col.status_definition.variables[0].variable ===
            getVariableFromSourceKey(statusVariable?.source_key)
        ) {
          isDupe = true;
        }
      });
    }

    return isDupe;
  };

  const validateDuplicateColumn = () => {
    if (isDuplicateColumns()) {
      setShowDuplicateColumnError(true);
      setSaveDisabled(true);
    } else {
      setShowDuplicateColumnError(false);
      setSaveDisabled(false);
    }
  };

  const resetForm = () => {
    setStatusVariable(null);
    setSummary(null);
    setPeriodLength(null);
    setPeriodScope(null);
    setShowDuplicateColumnError(false);
  };

  const cancelForm = () => {
    resetForm();
    props.onClose();
  };

  useEffect(() => {
    validateDuplicateColumn();
  }, [statusVariable, summary, periodLength, periodScope]);

  const successAction = () => {
    validateDuplicateColumn();
    trackEvent(
      props.tab === '#participants'
        ? performanceAndCoachingEventNames.columnAddedParticipantsTab
        : performanceAndCoachingEventNames.columnAddedCollectionTab,
      getAddColumnToParticipantsOrCollectionTabTable({
        eventType: props.event.type,
        dataSourceName: statusVariable?.name,
        calculation: summary,
      })
    );
    if (!isDuplicateColumns()) {
      const item = {
        columnType: 'status',
        columnName: getVariableFromSourceKey(statusVariable?.source_key),
        planningStatusDefinition: {
          variables: [
            {
              source: getSourceFromSourceKey(statusVariable?.source_key),
              variable: getVariableFromSourceKey(statusVariable?.source_key),
            },
          ],
          summary,
          period_length: periodLength,
          period_scope: periodScope,
        },
      };

      props.onSave(item);
      props.onClose();

      resetForm();
    }
  };

  return (
    <div className="planningEventStatusSidePanel">
      <SlidingPanel
        isOpen={props.isOpen}
        kitmanDesignSystem
        title={props.t('Column')}
        togglePanel={props.onClose}
      >
        <FormValidator successAction={successAction}>
          <div className="planningEventStatusSidePanel__form">
            <MetricSelector
              onChange={(selectedTrainingVariable) => {
                setStatusVariable(selectedTrainingVariable);
                setSummary(null);
                setPeriodLength(null);
              }}
              availableVariables={props.statusVariables}
              value={statusVariable?.source_key}
            />
            <div className="planningEventStatusSidePanel__calculation">
              <Dropdown
                label={props.t('Calculation')}
                value={summary}
                items={summaries}
                onChange={(selectedSummary) => {
                  setSummary(selectedSummary);
                }}
                disabled={!statusVariable}
              />
            </div>
            <div className="planningEventStatusSidePanel__periodSelector">
              <PeriodScopeSelector
                summary={summary}
                availableTimePeriods={[
                  { title: props.t('This Event'), id: 'this_event' },
                  { title: props.t('Last (x) Period'), id: 'last_x_days' },
                ]}
                periodScope={periodScope}
                setPeriodScope={(selectedPeriodScope) => {
                  setPeriodScope(selectedPeriodScope);
                }}
                periodLength={periodLength}
                setPeriodLength={(selectedPeriodLength) => {
                  setPeriodLength(selectedPeriodLength);
                }}
                secondPeriodLength={null}
                setBothPeriodLengths={() => {}}
                secondPeriodAllTime={null}
                setZScoreRolling={() => {}}
              />
            </div>
            {showDuplicateColumnError && (
              <div className="planningEventStatusSidePanel__duplicateColumnError">
                {props.t('A column already exists with these details')}
              </div>
            )}
          </div>

          <div className="slidingPanelActions">
            <div className="slidingPanelActions__reset">
              <TextButton
                type="secondary"
                text={props.t('Cancel')}
                kitmanDesignSystem
                onClick={() => cancelForm()}
              />
            </div>
            <div className="slidingPanelActions__apply">
              <TextButton
                type="primary"
                text={props.t('Save')}
                kitmanDesignSystem
                isSubmit
                isDisabled={isSaveDisabled}
              />
            </div>
          </div>
        </FormValidator>
      </SlidingPanel>
    </div>
  );
};

export default AddStatusSidePanel;
export const AddStatusSidePanelTranslated =
  withNamespaces()(AddStatusSidePanel);
