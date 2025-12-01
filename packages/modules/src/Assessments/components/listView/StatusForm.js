// @flow
import { useState, useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import $ from 'jquery';
import _intersectionBy from 'lodash/intersectionBy';
import {
  Dropdown,
  FormValidator,
  InfoTooltip,
  PeriodScopeSelector,
  RichTextEditor,
  Textarea,
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
import type { Status, User } from '../../types';

type Props = {
  assessmentId: number,
  selectedAthlete: number,
  status?: Status,
  onClickClose: Function,
  onClickSaveStatus: Function,
  users: Array<User>,
  statusVariables: Array<StatusVariable>,
};

const StatusForm = (props: I18nProps<Props>) => {
  const isAssessmentGroups =
    window.featureFlags['assessments-multiple-athletes'];

  const permissions = useContext(PermissionsContext);
  const [lastRequest, setLastRequest] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [statusValue, setStatusValue] = useState(null);
  const [isProtected, setIsProtected] = useState(props.status?.is_protected);
  const [statusVariable, setStatusVariable] = useState(
    props.status
      ? props.statusVariables.find(
          (tv) =>
            // $FlowFixMe props.status must exist at this point
            tv.source_key === `${props.status.source}|${props.status.variable}`
        )
      : null
  );
  const [summary, setSummary] = useState(
    props.status ? props.status.summary : null
  );
  const [periodScope, setPeriodScope] = useState(
    props.status?.period_scope ? props.status.period_scope : null
  );
  const [periodLength, setPeriodLength] = useState(
    props.status?.period_length ? props.status.period_length : null
  );
  const [notes, setNotes] = useState([
    {
      id:
        props.status && props.status.notes[0].id
          ? props.status.notes[0].id
          : null,
      note:
        props.status && props.status.notes[0].note
          ? props.status.notes[0].note.content
          : '',
      user_ids:
        props.status && props.status.notes[0].users.length > 0
          ? [props.status.notes[0].users[0].id]
          : [],
      ...(isAssessmentGroups
        ? {
            athlete_id:
              props.status && props.status.notes[0].athlete_id
                ? props.status.notes[0].athlete_id
                : props.selectedAthlete,
          }
        : {}),
    },
  ]);
  const formType = props.status ? 'EDIT' : 'CREATE';

  useEffect(() => {
    const isPeriodScopeValid =
      periodScope &&
      ((periodScope === 'last_x_days' && periodLength) ||
        periodScope !== 'last_x_days');

    const isStatusValid = statusVariable && summary && isPeriodScopeValid;

    if (isStatusValid) {
      if (lastRequest) {
        lastRequest.abort();
      }

      setStatusValue(null);
      setRequestStatus('PENDING');

      const request = $.ajax({
        url: `/${isAssessmentGroups ? 'assessment_groups' : 'assessments'}/${
          props.assessmentId
        }/statuses/calculate_value`,
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
          source: getSourceFromSourceKey(statusVariable?.source_key),
          variable: getVariableFromSourceKey(statusVariable?.source_key),
          summary,
          period_scope: periodScope,
          period_length: periodLength,
          ...(isAssessmentGroups
            ? {
                athlete_id: props.selectedAthlete,
              }
            : {}),
        }),
      })
        .done((data) => {
          setRequestStatus(null);
          setStatusValue(data.value || '-');
        })
        .fail(() => {
          setRequestStatus('FAILURE');
        });

      // $FlowFixMe JQueryPromise can be set to a state as it is an object
      setLastRequest(request);
    } else {
      setStatusValue(null);
    }
  }, [statusVariable, summary, periodScope, periodLength]);

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
    <FormValidator
      successAction={() => {
        props.onClickSaveStatus({
          id: props.status?.id || null,
          source: getSourceFromSourceKey(statusVariable?.source_key),
          variable: getVariableFromSourceKey(statusVariable?.source_key),
          summary,
          period_scope: periodScope,
          period_length: periodLength,
          notes,
        });
      }}
      inputNamesToIgnore={['status_note', 'status_user']}
    >
      <div className="assessmentsStatusForm">
        <div className="assessmentsStatusForm__form">
          <MetricSelector
            onChange={(selectedTrainingVariable) => {
              setIsProtected(selectedTrainingVariable.is_protected);
              setStatusVariable(selectedTrainingVariable);
              setSummary(null);
              setPeriodScope(null);
              setPeriodLength(null);
            }}
            availableVariables={props.statusVariables}
            value={statusVariable?.source_key}
            isDisabled={
              (formType === 'EDIT' && !permissions.editAssessment) ||
              (formType === 'CREATE' && !permissions.createAssessment)
            }
          />
          <div
            className={classnames('assessmentsStatusForm__score', {
              'assessmentsStatusForm__score--loading':
                requestStatus === 'PENDING',
              'assessmentsStatusForm__score--error':
                requestStatus === 'FAILURE',
            })}
          >
            <div className="assessmentsStatusForm__scoreLabel">
              {props.t('Score')}
            </div>
            <div className="assessmentsStatusForm__scoreBox">
              {requestStatus !== 'FAILURE' && statusValue}

              {requestStatus === 'FAILURE' && (
                <InfoTooltip
                  placement="top-end"
                  content={props.t(
                    'An error occured when retrieving the score. Reload the page to try again.'
                  )}
                  errorStyle
                >
                  <div className="icon-error assessmentsStatusForm__fetchScoreError" />
                </InfoTooltip>
              )}
            </div>
          </div>

          <div className="assessmentsStatusForm__calculation">
            <Dropdown
              label={props.t('Calculation')}
              value={summary}
              items={summaries}
              onChange={(selectedSummary) => {
                setSummary(selectedSummary);
                setPeriodScope('last_x_days');
              }}
              disabled={
                (formType === 'EDIT' && !permissions.editAssessment) ||
                (formType === 'CREATE' && !permissions.createAssessment) ||
                !statusVariable
              }
            />
          </div>

          <div
            className={classnames('assessmentsStatusForm__periodSelector', {
              'assessmentsStatusForm__periodSelector--disabled':
                (formType === 'EDIT' && !permissions.editAssessment) ||
                (formType === 'CREATE' && !permissions.createAssessment),
              'assessmentsStatusForm__periodSelector--hidden': !summary,
            })}
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

          <div className="assessmentsStatusForm__note">
            {window.featureFlags['rich-text-editor'] ? (
              <div className="col-md-12 annotationModal__row">
                <RichTextEditor
                  label={props.t('Comment')}
                  onChange={(note) =>
                    setNotes((prevNotes) => [
                      {
                        ...prevNotes[0],
                        note,
                      },
                    ])
                  }
                  value={notes[0]?.note || ''}
                  isDisabled={
                    !permissions.answerAssessment ||
                    (!permissions.viewProtectedMetrics && isProtected)
                  }
                />
              </div>
            ) : (
              <div className="col-md-12 annotationModal__row">
                <Textarea
                  label={props.t('Comment')}
                  value={notes[0]?.note}
                  onChange={(note) =>
                    setNotes((prevNotes) => [
                      {
                        ...prevNotes[0],
                        note,
                      },
                    ])
                  }
                  disabled={
                    !permissions.answerAssessment ||
                    (!permissions.viewProtectedMetrics && isProtected)
                  }
                  name="status_note"
                />
              </div>
            )}
          </div>
          <div className="assessmentsStatusForm__user">
            <Dropdown
              label={props.t('User')}
              items={props.users}
              onChange={(userId) =>
                setNotes((prevNotes) => [
                  {
                    ...prevNotes[0],
                    user_ids: [userId],
                  },
                ])
              }
              value={notes[0]?.user_ids[0] || null}
              name="status_user"
              clearBtn
              onClickClear={() => {
                setNotes((prevNotes) => [
                  {
                    ...prevNotes[0],
                    user_ids: [],
                  },
                ]);
              }}
              disabled={
                (formType === 'EDIT' && !permissions.editAssessment) ||
                (formType === 'CREATE' && !permissions.createAssessment)
              }
              searchable
            />
          </div>
        </div>
        <footer className="assessmentsStatusForm__footer">
          <TextButton
            text={props.t('Cancel')}
            type="secondary"
            onClick={() => props.onClickClose()}
            kitmanDesignSystem
          />
          <TextButton
            text={props.t('Save')}
            type="primary"
            isSubmit
            kitmanDesignSystem
          />
        </footer>
      </div>
    </FormValidator>
  );
};

export default StatusForm;
export const StatusFormTranslated = withNamespaces()(StatusForm);
