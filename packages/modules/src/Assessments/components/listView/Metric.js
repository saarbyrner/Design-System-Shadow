// @flow
import { useState, useContext } from 'react';
import classnames from 'classnames';
import { TrackEvent, isColourDark } from '@kitman/common/src/utils';
import { withNamespaces } from 'react-i18next';
import Tippy from '@tippyjs/react';
import moment from 'moment-timezone';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import { AppStatus, RichTextDisplay, TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import ReorderHandle from './SortHandle';
import { MetricFormTranslated as MetricForm } from './MetricForm';
import PermissionsContext from '../../contexts/PermissionsContext';
import TimezonesContext from '../../contexts/TimezonesContext';
import type { Metric as MetricType, User } from '../../types';

type Props = {
  assessmentId: number,
  selectedAthlete: number,
  metric: MetricType,
  onClickDeleteMetric: Function,
  onClickSaveMetric: Function,
  users: Array<User>,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
  onClickMetricHeader: Function,
  showNotes: boolean,
  trainingVariablesAlreadySelected: Array<number>,
  showReordering: boolean,
  isCurrentSquad: boolean,
};

const Metric = (props: I18nProps<Props>) => {
  const coachingAndDevelopmentTextScoreFlag =
    window.getFlag('coaching-and-development-training-variable-text-score');
  const permissions = useContext(PermissionsContext);
  const timezones = useContext(TimezonesContext);
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [showEditMetricForm, setShowEditMetricForm] = useState(false);

  const answer =
    props.metric.answers.find((a) => a.athlete_id === props.selectedAthlete) ||
    props.metric.answers[0];

  const getScoreAnswerValue = (answerValue: ?number) => {
    if (coachingAndDevelopmentTextScoreFlag) {
      switch (answerValue) {
        case 1:
          return props.t('Below Level');

        case 2:
          return props.t('Average');

        case 3:
          return props.t('Good');

        default:
          return props.t('Above Level');
      }
    }
    return answerValue;
  };
  /*
    When window.featureFlags['assessments-multiple-athletes'] is false, isCurrentSquad should be always false
    because when this FF is disabled, we consume the old endpoint: /ASSESSMENTS/SEARCH that does not retrieve
    the required squad data to compare with the current squad
  */
  const isCurrentSquad =
    !window.featureFlags['assessments-multiple-athletes'] ||
    (window.featureFlags['assessments-multiple-athletes'] &&
      props.isCurrentSquad);

  const formatDate = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({
        date,
        showTime: true,
      });
    }

    return date.format('DD MMM YYYY [@] h:mm a');
  };
  return (
    <>
      <div className="assessmentsMetric">
        <header
          className={classnames('assessmentsMetric__header', {
            'assessmentsMetric__header--expandable': answer?.note?.content,
          })}
        >
          {props.showReordering && <ReorderHandle />}

          <div
            className="assessmentsMetric__info"
            onClick={props.onClickMetricHeader}
          >
            <h2 className="assessmentsMetric__name">
              {props.metric.training_variable.name}
            </h2>

            <div className="assessmentsMetric__user">
              {answer?.users[0]?.fullname}
            </div>

            <div className="assessmentsMetric__noteIcon">
              {answer?.note?.content && <span className="icon-comment" />}
            </div>

            <div className="assessmentsMetric__score">
              {answer?.value === 0 || answer?.value ? (
                <>
                  {window.featureFlags['assessment-who-answered'] ? (
                    <Tippy
                      placement="top-end"
                      content={
                        <div className="assessmentsTooltip">
                          <div className="assessmentsTooltip__title">
                            {props.t('Scored')}
                          </div>
                          <div className="assessmentsTooltip__meta">
                            {answer?.edit_history &&
                              props.t('{{date}} by {{user}}', {
                                date: formatDate(
                                  moment.tz(
                                    // $FlowFixMe edit_history exists at this point
                                    answer.edit_history.date,
                                    timezones.orgTimezone
                                  )
                                ),
                                user:
                                  // $FlowFixMe edit_history exists at this point
                                  answer.edit_history.user.fullname,
                                interpolation: { escapeValue: false },
                              })}
                          </div>
                        </div>
                      }
                      theme="blue-border-tooltip"
                    >
                      <div
                        className="assessmentsMetric__value"
                        style={
                          window.featureFlags['scales-colours']
                            ? {
                                backgroundColor: answer.colour || null,
                                color:
                                  answer.colour && isColourDark(answer.colour)
                                    ? 'white'
                                    : null,
                              }
                            : {}
                        }
                      >
                        {getScoreAnswerValue(answer.value)}
                      </div>
                    </Tippy>
                  ) : (
                    <div
                      className="assessmentsMetric__value"
                      style={
                        window.featureFlags['scales-colours']
                          ? {
                              backgroundColor: answer.colour || null,
                              color:
                                answer.colour && isColourDark(answer.colour)
                                  ? 'white'
                                  : null,
                            }
                          : {}
                      }
                    >
                      {getScoreAnswerValue(answer.value)}
                    </div>
                  )}

                  {window.featureFlags['assessment-who-answered'] &&
                  (answer.previous_answer?.value === 0 ||
                    answer.previous_answer?.value) ? (
                    <Tippy
                      placement="top-end"
                      content={
                        <div className="assessmentsTooltip">
                          <div className="assessmentsTooltip__title">
                            {props.t('Scored')}
                          </div>
                          <div className="assessmentsTooltip__meta">
                            {answer.previous_answer?.edit_history &&
                              props.t('{{date}} by {{user}}', {
                                date: formatDate(
                                  moment.tz(
                                    answer.previous_answer?.edit_history.date,
                                    timezones.orgTimezone
                                  )
                                ),
                                user: answer.previous_answer?.edit_history?.user
                                  .fullname,
                                interpolation: { escapeValue: false },
                              })}
                          </div>
                        </div>
                      }
                      theme="blue-border-tooltip"
                    >
                      <div
                        className="assessmentsMetric__previousValue"
                        style={
                          window.featureFlags['scales-colours']
                            ? {
                                backgroundColor:
                                  answer.previous_answer?.colour || null,
                                color:
                                  answer.previous_answer?.colour &&
                                  isColourDark(answer.previous_answer.colour)
                                    ? 'white'
                                    : null,
                              }
                            : {}
                        }
                      >
                        {getScoreAnswerValue(answer.previous_answer?.value)}
                      </div>
                    </Tippy>
                  ) : (
                    <div
                      className="assessmentsMetric__previousValue"
                      style={
                        window.featureFlags['scales-colours']
                          ? {
                              backgroundColor:
                                answer.previous_answer?.colour || null,
                              color:
                                answer.previous_answer?.colour &&
                                isColourDark(answer.previous_answer.colour)
                                  ? 'white'
                                  : null,
                            }
                          : {}
                      }
                    >
                      {answer.previous_answer?.value === 0 ||
                      answer.previous_answer?.value
                        ? getScoreAnswerValue(answer.previous_answer?.value)
                        : '-'}
                    </div>
                  )}
                </>
              ) : (
                isCurrentSquad && (
                  <div
                    className={classnames('assessmentsMetric__addScore', {
                      'assessmentsMetric__addScore--disabled':
                        !permissions.answerAssessment,
                    })}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!permissions.answerAssessment) {
                        return;
                      }
                      setShowEditMetricForm(true);
                    }}
                  >
                    {props.t('Add score')}
                  </div>
                )
              )}
            </div>
          </div>
          {isCurrentSquad && (
            <TooltipMenu
              placement="bottom-start"
              offset={[0, 0]}
              menuItems={[
                {
                  description: props.t('Edit'),
                  onClick: () => {
                    setShowEditMetricForm(true);
                    TrackEvent('assessments', 'click', 'edit metric');
                  },
                  isDisabled:
                    !permissions.editAssessment &&
                    !permissions.answerAssessment,
                },
                {
                  description: props.t('Delete'),
                  onClick: () => {
                    setShowConfirmDeletion(true);
                    TrackEvent('assessments', 'click', 'delete metric');
                  },
                  isDestructive: true,
                  isDisabled: !permissions.deleteAssessment,
                },
              ]}
              tooltipTriggerElement={
                <button
                  type="button"
                  className={classnames('assessmentsMetric__dropdownMenuBtn', {
                    'assessmentsMetric__dropdownMenuBtn--disabled':
                      props.showReordering,
                  })}
                >
                  <i className="icon-more" />
                </button>
              }
              disabled={props.showReordering}
              kitmanDesignSystem
            />
          )}
        </header>

        {!showEditMetricForm && props.showNotes && answer.note?.content && (
          <div className="assessmentsMetric__noteContainer">
            <div className="assessmentsMetric__note">
              <header>
                <h3 className="assessmentsMetric__noteTitle">
                  {props.t('Comment')}
                </h3>
                {props.isCurrentSquad && (
                  <div
                    className={classnames('assessmentsMetric__editButton', {
                      'assessmentsMetric__editButton--disabled':
                        !permissions.answerAssessment,
                    })}
                    onClick={() => {
                      if (!permissions.answerAssessment) {
                        return;
                      }
                      setShowEditMetricForm(true);
                    }}
                  >
                    {props.t('Edit')}
                  </div>
                )}
              </header>
              <div className="assessmentsMetric__noteMeta">
                {window.featureFlags['assessment-who-answered'] &&
                  answer.note.edit_history &&
                  props.t('{{date}} by {{user}}', {
                    date: formatDate(
                      moment.tz(
                        // $FlowFixMe edit_history exists at this point
                        answer.note.edit_history.date,
                        timezones.orgTimezone
                      )
                    ),
                    user:
                      // $FlowFixMe edit_history exists at this point
                      answer.note.edit_history.user.fullname,
                    interpolation: { escapeValue: false },
                  })}
              </div>
              {window.featureFlags['rich-text-editor'] ? (
                <RichTextDisplay
                  value={answer.note.content}
                  isAbbreviated={false}
                />
              ) : (
                <div className="assessmentsMetric__noteText">
                  {answer.note.content}
                </div>
              )}
            </div>
          </div>
        )}

        {showConfirmDeletion && (
          <AppStatus
            status="warning"
            message={props.t('Delete metric?')}
            secondaryMessage={props.t(
              'Deleting this metric will delete any score, note and user.'
            )}
            deleteAllButtonText={props.t('Delete')}
            hideConfirmation={() => {
              setShowConfirmDeletion(false);
            }}
            confirmAction={() => {
              setShowConfirmDeletion(false);
              props.onClickDeleteMetric();
            }}
          />
        )}
      </div>

      {showEditMetricForm && (
        <MetricForm
          assessmentId={props.assessmentId}
          selectedAthlete={props.selectedAthlete}
          metric={props.metric}
          onClickSaveMetric={(metric) => {
            setShowEditMetricForm(false);
            props.onClickSaveMetric(metric);
          }}
          onClickClose={() => {
            setShowEditMetricForm(false);
          }}
          users={props.users}
          // Pass only the training variables not selected and the training variable of the metric
          // because the user can't select a variable already selected
          organisationTrainingVariables={props.organisationTrainingVariables.filter(
            (organisationTrainingVariable) =>
              organisationTrainingVariable.training_variable.id ===
                props.metric.training_variable.id ||
              !props.trainingVariablesAlreadySelected.includes(
                organisationTrainingVariable.training_variable.id
              )
          )}
        />
      )}
    </>
  );
};

export default Metric;
export const MetricTranslated = withNamespaces()(Metric);
