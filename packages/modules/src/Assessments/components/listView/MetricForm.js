// @flow
import { useState, useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import classnames from 'classnames';
import $ from 'jquery';

import { isColourDark } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OrganisationTrainingVariables } from '@kitman/common/src/types/Workload';
import {
  Dropdown,
  FormValidator,
  InfoTooltip,
  RichTextEditor,
  Textarea,
  TextButton,
} from '@kitman/components';
import useScoreDropdown from '@kitman/common/src/hooks/useScoreDropdown';
import PermissionsContext from '../../contexts/PermissionsContext';
import type { Metric, User } from '../../types';

type Props = {
  assessmentId: number,
  selectedAthlete: number,
  metric?: Metric,
  onClickClose: Function,
  onClickSaveMetric: Function,
  users: Array<User>,
  organisationTrainingVariables: Array<OrganisationTrainingVariables>,
};

const MetricForm = (props: I18nProps<Props>) => {
  const coachingAndDevelopmentTextScoreFlag = window.getFlag(
    'coaching-and-development-training-variable-text-score'
  );

  const permissions = useContext(PermissionsContext);
  const [lastRequest, setLastRequest] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);
  const [previousValueColour, setPreviousValueColour] = useState(null);
  const [isProtected, setIsProtected] = useState(props.metric?.is_protected);
  const [trainingVariableId, setTrainingVariableId] = useState(
    props.metric ? props.metric.training_variable.id : null
  );
  const answer =
    props.metric?.answers.find((a) => a.athlete_id === props.selectedAthlete) ||
    props.metric?.answers[0];
  const [answers, setAnswers] = useState([
    {
      id: answer?.id ? answer.id : null,
      value: answer?.value ? answer.value : null,
      note: answer?.note ? answer.note.content : '',
      user_ids: answer && answer.users.length > 0 ? [answer.users[0].id] : [],
      ...(window.featureFlags['assessments-multiple-athletes']
        ? {
            athlete_id: answer?.athlete_id
              ? answer.athlete_id
              : props.selectedAthlete,
          }
        : {}),
    },
  ]);

  let scoreDropdownItems = useScoreDropdown(
    props.organisationTrainingVariables,
    trainingVariableId
  );
  if (coachingAndDevelopmentTextScoreFlag)
    scoreDropdownItems = [
      { id: 1, name: props.t('Below Level') },
      { id: 2, name: props.t('Average') },
      { id: 3, name: props.t('Good') },
      { id: 4, name: props.t('Above Level') },
    ];

  const formType = props.metric ? 'EDIT' : 'CREATE';
  const isCreatingMetricAvailable =
    props.organisationTrainingVariables.length > 0;

  useEffect(() => {
    if (trainingVariableId) {
      if (lastRequest) {
        lastRequest.abort();
      }

      setPreviousValue(null);
      setRequestStatus('PENDING');

      const url = window.featureFlags['assessments-multiple-athletes']
        ? `/assessment_groups/${props.assessmentId}/items/previous_answer?training_variable_id=${trainingVariableId}&athlete_id=${props.selectedAthlete}`
        : `/assessments/${props.assessmentId}/items/previous_answer?training_variable_id=${trainingVariableId}`;

      const request = $.ajax({
        url,
        method: 'GET',
      })
        .done((data) => {
          setRequestStatus(null);
          setPreviousValue(data.previous_answer?.value);
          setPreviousValueColour(data.previous_answer?.colour);
        })
        .fail(() => {
          setRequestStatus('FAILURE');
        });

      // $FlowFixMe JQueryPromise can be set to a state as it is an object
      setLastRequest(request);
    }
  }, [trainingVariableId]);

  const isTrainingVariableProtected = (value: number) => {
    const selectedTrainingVariable = props.organisationTrainingVariables.find(
      (trainingVariables) => trainingVariables.training_variable.id === value
    );

    return !!selectedTrainingVariable?.is_protected;
  };

  const disableIfEdit = window.featureFlags['assessments-multiple-athletes']
    ? formType === 'EDIT'
    : formType === 'EDIT' && !permissions.editAssessment;

  return (
    <FormValidator
      successAction={() => {
        props.onClickSaveMetric({
          id: props.metric?.id || null,
          training_variable_id: trainingVariableId,
          answers,
        });
      }}
      inputNamesToIgnore={['metric_score', 'metric_note', 'metric_user']}
    >
      <div className="assessmentsMetricForm">
        <div
          className={[
            'assessmentsMetricForm__form',
            coachingAndDevelopmentTextScoreFlag ? 'wideScore' : '',
          ].join(' ')}
        >
          <Dropdown
            label={props.t('Metric')}
            items={props.organisationTrainingVariables.map(
              (organisationTrainingVariable) =>
                organisationTrainingVariable.training_variable
            )}
            onChange={(value) => {
              setIsProtected(isTrainingVariableProtected(value));
              setTrainingVariableId(value);
              setAnswers((prevAnswers) => [
                {
                  ...prevAnswers[0],
                  value: null,
                },
              ]);
            }}
            value={trainingVariableId}
            name="metric_metric"
            disabled={
              disableIfEdit ||
              (formType === 'CREATE' && !permissions.createAssessment) ||
              !isCreatingMetricAvailable
            }
            searchable
          />
          {isCreatingMetricAvailable ? (
            <>
              <div className="assessmentsMetricForm__score">
                <Dropdown
                  label={props.t('Score')}
                  items={scoreDropdownItems}
                  onChange={(value) => {
                    setAnswers((prevAnswers) => [
                      {
                        ...prevAnswers[0],
                        value,
                      },
                    ]);
                  }}
                  value={answers[0]?.value}
                  name="metric_score"
                  disabled={
                    !trainingVariableId ||
                    !permissions.answerAssessment ||
                    (!permissions.viewProtectedMetrics && isProtected)
                  }
                  clearBtn
                  onClickClear={() => {
                    setAnswers((prevAnswers) => [
                      {
                        ...prevAnswers[0],
                        value: null,
                      },
                    ]);
                  }}
                />
                {requestStatus !== 'FAILURE' && (
                  <div
                    className={classnames(
                      'assessmentsMetricForm__previousValue',
                      {
                        'assessmentsMetricForm__previousValue--loading':
                          requestStatus === 'PENDING',
                      }
                    )}
                    style={
                      window.featureFlags['scales-colours']
                        ? {
                            backgroundColor: previousValueColour || null,
                            color:
                              previousValueColour &&
                              isColourDark(previousValueColour)
                                ? 'white'
                                : null,
                          }
                        : {}
                    }
                  >
                    {previousValue === 0 || previousValue ? previousValue : '-'}
                  </div>
                )}

                {requestStatus === 'FAILURE' && (
                  <InfoTooltip
                    placement="top-end"
                    content={props.t(
                      'An error occured when retrieving the score. Reload the page to try again.'
                    )}
                    errorStyle
                  >
                    <div className="icon-error assessmentsMetricForm__fetchPreviousValueError" />
                  </InfoTooltip>
                )}
              </div>
              <div className="assessmentsMetricForm__note">
                {window.featureFlags['rich-text-editor'] ? (
                  <div className="col-md-12 annotationModal__row">
                    <RichTextEditor
                      label={props.t('Comment')}
                      onChange={(note) =>
                        setAnswers((prevAnswers) => [
                          {
                            ...prevAnswers[0],
                            note:
                              note
                                // Make sure to remove HTML tags and empty linebreaks from the note to check if it's empty.
                                .replace(/<\/?[a-zA-Z]{1,2}\/?>/g, '')
                                .replace(/[\r\n]+/g, '') !== ''
                                ? note
                                : '',
                          },
                        ])
                      }
                      value={answers[0]?.note || ''}
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
                      value={answers[0]?.note}
                      onChange={(note) =>
                        setAnswers((prevAnswers) => [
                          {
                            ...prevAnswers[0],
                            note,
                          },
                        ])
                      }
                      disabled={
                        !permissions.answerAssessment ||
                        (!permissions.viewProtectedMetrics && isProtected)
                      }
                      name="metric_note"
                    />
                  </div>
                )}
              </div>
              <div className="assessmentsMetricForm__user">
                <Dropdown
                  label={props.t('User')}
                  items={props.users}
                  onChange={(userId) =>
                    setAnswers((prevAnswers) => [
                      {
                        ...prevAnswers[0],
                        user_ids: [userId],
                      },
                    ])
                  }
                  value={answers[0]?.user_ids[0] || null}
                  name="metric_user"
                  clearBtn
                  onClickClear={() => {
                    setAnswers((prevAnswers) => [
                      {
                        ...prevAnswers[0],
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
            </>
          ) : (
            <p className="assessmentsMetricForm__warningText">
              {props.t('All metrics are currently in use')}
            </p>
          )}
        </div>
        <footer className="assessmentsMetricForm__footer">
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

export default MetricForm;
export const MetricFormTranslated = withNamespaces()(MetricForm);
