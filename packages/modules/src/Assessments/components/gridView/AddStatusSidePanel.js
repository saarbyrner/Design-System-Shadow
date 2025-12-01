// @flow
import { useState, useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import _intersectionBy from 'lodash/intersectionBy';
import {
  Dropdown,
  FormValidator,
  PeriodScopeSelector,
  SlidingPanel,
  TextButton,
} from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { StatusVariable } from '@kitman/common/src/types';
import {
  availableSummaries,
  availableTimePeriods,
  getSourceFromSourceKey,
  getVariableFromSourceKey,
  getCalculationsByType,
} from '@kitman/common/src/utils/status_utils';
import MetricSelector from '../../../StatusForm/MetricSelector';
import PermissionsContext from '../../contexts/PermissionsContext';

type Props = {
  statusVariables: Array<StatusVariable>,
  onSave: Function,
  onClose: Function,
};

const AddStatusSidePanel = (props: I18nProps<Props>) => {
  const [statusVariable, setStatusVariable] = useState(null);
  const [summary, setSummary] = useState(null);
  const [periodScope, setPeriodScope] = useState(null);
  const [periodLength, setPeriodLength] = useState(null);

  const permissions = useContext(PermissionsContext);

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

  return (
    <div className="assessmentsStatusSidePanel">
      <SlidingPanel
        isOpen
        title={props.t('Add status')}
        togglePanel={props.onClose}
      >
        <FormValidator
          successAction={() => {
            const item = {
              item_type: 'AssessmentStatus',
              item_attributes: {
                source: getSourceFromSourceKey(statusVariable?.source_key),
                variable: getVariableFromSourceKey(statusVariable?.source_key),
                summary,
                period_scope: periodScope,
                period_length: periodLength,
                notes: [],
              },
            };

            props.onSave(item);
            props.onClose();
          }}
        >
          <div className="assessmentsStatusSidePanel__form">
            <MetricSelector
              onChange={(selectedTrainingVariable) => {
                setStatusVariable(selectedTrainingVariable);
                setSummary(null);
                setPeriodScope(null);
                setPeriodLength(null);
              }}
              availableVariables={props.statusVariables}
              value={statusVariable?.source_key}
              isDisabled={!permissions.createAssessment}
            />
            <div className="assessmentsStatusSidePanel__calculation">
              <Dropdown
                label={props.t('Calculation')}
                value={summary}
                items={summaries}
                onChange={(selectedSummary) => {
                  setSummary(selectedSummary);
                  setPeriodScope('last_x_days');
                }}
                disabled={!permissions.createAssessment || !statusVariable}
              />
            </div>
            <div
              className={classnames(
                'assessmentsStatusSidePanel__periodSelector',
                {
                  'assessmentsStatusSidePanel__periodSelector--disabled':
                    !permissions.createAssessment,
                  'assessmentsStatusSidePanel__periodSelector--hidden':
                    !summary,
                }
              )}
            >
              <PeriodScopeSelector
                summary={summary}
                availableTimePeriods={availableTimePeriods(summary).filter(
                  (timePeriod) => timePeriod.id === 'last_x_days'
                )}
                periodScope={periodScope}
                setPeriodScope={(selectedPeriodScope) =>
                  setPeriodScope(selectedPeriodScope)
                }
                periodLength={periodLength}
                setPeriodLength={(selectedPeriodLength) =>
                  setPeriodLength(selectedPeriodLength)
                }
                secondPeriodLength={null}
                setBothPeriodLengths={() => {}}
                secondPeriodAllTime={null}
                setZScoreRolling={() => {}}
              />
            </div>
          </div>
          <div className="slidingPanelActions">
            <div className="slidingPanelActions__apply">
              <TextButton
                type="primary"
                text={props.t('Save')}
                isSubmit
                kitmanDesignSystem
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
