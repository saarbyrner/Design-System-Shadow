// @flow
import { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { DropdownItem } from '@kitman/components/src/types';
import {
  DatePicker,
  Dropdown,
  FormValidator,
  InputText,
  LegacyModal as Modal,
  SessionSelector,
  TextButton,
} from '@kitman/components';
import { getEventName } from '@kitman/common/src/utils/workload';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Turnaround } from '@kitman/common/src/types/Turnaround';
import type { Event } from '@kitman/common/src/types/Event';

import type { AssessmentTemplate, Assessment } from '../types';

type Props = {
  assessment?: Assessment,
  event?: Event,
  orgTimezone: string,
  permissions: Object,
  onClickSubmit: Function,
  onClickClose: Function,
  assessmentTemplates?: Array<AssessmentTemplate>,
  turnaroundList: Array<Turnaround>,
  hideTemplateDropdown?: boolean,
};

const getAssessmentSessionType = (assessment, event = undefined) => {
  if (!window.featureFlags['game-ts-assessment-area']) {
    return 'Date';
  }

  if (assessment) {
    if (!assessment.event_type && event) {
      if (event.type === 'game_event') return 'Game';
      if (event.type === 'session_event') return 'TrainingSession';
    }

    if (!assessment.event_type) {
      return 'Date';
    }

    return assessment.event_type;
  }

  return null;
};

const AssessmentForm = (props: I18nProps<Props>) => {
  const [assessmentSessionType, setAssessmentSessionType] = useState(
    getAssessmentSessionType(props.assessment, props.event)
  );
  const [templateId, setTemplateId] = useState(
    props.assessment?.assessment_template?.id || null
  );
  const [name, setName] = useState(props.assessment?.name || '');
  const [date, setDate] = useState(
    (window.featureFlags['assessments-multiple-athletes']
      ? props.assessment?.assessment_group_date
      : props.assessment?.assessment_date) ||
      moment().tz(props.orgTimezone).format(DateFormatter.dateTransferFormat)
  );
  const event = props.assessment?.event || props.event;
  const [eventId, setEventId] = useState(event?.id || null);

  const assessmentSessions: Array<DropdownItem> = [
    { title: props.t('Date'), id: 'Date' },
    { title: props.t('Games'), id: 'Game' },
    { title: props.t('Session'), id: 'TrainingSession' },
  ];

  const getInitialDateRange = () => {
    // When editing an assessment associated to a game or a training session
    // The date range selector should be initiated from 1 day before the
    // event to 1 day after the event.
    if (props.assessment?.event) {
      return {
        start_date: moment(
          props.assessment?.event.date,
          DateFormatter.dateTransferFormat
        )
          .subtract(1, 'days')
          .tz(props.orgTimezone)
          .format(DateFormatter.dateTransferFormat),
        end_date: moment(
          // $FlowFixMe props.assessment exists
          props.assessment.event.date,
          DateFormatter.dateTransferFormat
        )
          .add(1, 'days')
          .tz(props.orgTimezone)
          .format(DateFormatter.dateTransferFormat),
      };
    }

    return null;
  };

  // If an event has been provided to the modal we won't ask the user to select event/date. The modal will default to event.
  const shouldShowSessionSelector = () =>
    props.event === undefined &&
    (assessmentSessionType === 'Game' ||
      assessmentSessionType === 'TrainingSession');

  const disableSave = () => {
    if (props.event === undefined) return false;
    if (props.permissions.createAssessment) return false;
    if (!props.permissions.createAssessment)
      return (
        props.permissions.createAssessmentFromTemplate && templateId === null
      );
    return true;
  };

  return (
    <Modal
      title={props.t('{{action}} form', {
        action: props.assessment ? props.t('Edit') : props.t('Add'),
      })}
      close={props.onClickClose}
      style={{ overflow: 'visible' }}
      width={450}
      isOpen
    >
      <FormValidator
        successAction={() => {
          const assessmentDate = assessmentSessionType === 'Date' ? date : null;
          const assessmentSessionTypeFetch =
            assessmentSessionType === 'Game' ||
            assessmentSessionType === 'TrainingSession'
              ? assessmentSessionType
              : null;
          const eventType =
            props.event !== undefined
              ? props.event?.type
              : assessmentSessionTypeFetch;
          const fetchedEventId =
            props.event?.id ||
            (assessmentSessionType === 'Game' ||
            assessmentSessionType === 'TrainingSession'
              ? eventId
              : null);

          const args = {
            id: props.assessment?.id || null,
            assessment_template_id: templateId,
            name,
            ...(window.featureFlags['assessments-multiple-athletes']
              ? {
                  assessment_group_date: assessmentDate,
                }
              : { assessment_date: assessmentDate }),
            event_type: eventType,
            event_id: fetchedEventId,
            participation_levels: undefined,
          };

          props.onClickSubmit(args);
        }}
      >
        <div data-testid="assessmentsAssessmentForm">
          {!props.hideTemplateDropdown && (
            <div className="assessmentsAssessmentForm__templateDropdown">
              <Dropdown
                onChange={(value) => setTemplateId(value)}
                items={props.assessmentTemplates}
                label={props.t('Template')}
                value={templateId}
                clearBtn
                onClickClear={() => {
                  setTemplateId(null);
                }}
                ignoreValidation={
                  props.permissions.createAssessment ||
                  !props.permissions.createAssessmentFromTemplate
                }
                disabled={
                  props.assessmentTemplates &&
                  props.assessmentTemplates.length === 0
                }
              />
            </div>
          )}
          <div className="assessmentsAssessmentForm__inputText">
            <InputText
              value={name}
              onValidation={({ value }) => setName(value)}
              label={props.t('Name')}
              maxLength={50}
            />
          </div>
          {!window.featureFlags['game-ts-assessment-area'] &&
            props.event === undefined && (
              <div className="assessmentsAssessmentForm__datepicker">
                <DatePicker
                  name={
                    window.featureFlags['assessments-multiple-athletes']
                      ? 'assessment_group_date'
                      : 'assessment_date'
                  }
                  label={props.t('Date')}
                  value={moment(date)
                    .tz(props.orgTimezone)
                    .format(DateFormatter.dateTransferFormat)}
                  onDateChange={(value) =>
                    setDate(
                      moment(value)
                        .tz(props.orgTimezone)
                        .format(DateFormatter.dateTransferFormat)
                    )
                  }
                  container=".ReactModal__Overlay"
                />
              </div>
            )}
          {window.featureFlags['game-ts-assessment-area'] && (
            <>
              {props.event === undefined && (
                <div className="assessmentsAssessmentForm__sessionTypeDropdown">
                  <Dropdown
                    onChange={(value) => setAssessmentSessionType(value)}
                    items={assessmentSessions}
                    label={props.t('Session / Date')}
                    value={assessmentSessionType}
                    clearBtn
                    onClickClear={() => {
                      setAssessmentSessionType(null);
                    }}
                  />
                </div>
              )}

              {assessmentSessionType === 'Date' && (
                <div className="assessmentsAssessmentForm__datepicker">
                  <DatePicker
                    name={
                      window.featureFlags['assessments-multiple-athletes']
                        ? 'assessment_group_date'
                        : 'assessment_date'
                    }
                    label={props.t('Date')}
                    value={moment(date)
                      .tz(props.orgTimezone)
                      .format(DateFormatter.dateTransferFormat)}
                    onDateChange={(value) =>
                      setDate(
                        moment(value)
                          .tz(props.orgTimezone)
                          .format(DateFormatter.dateTransferFormat)
                      )
                    }
                    container=".ReactModal__Overlay"
                  />
                </div>
              )}
              {props.event && (
                <>
                  <span className="assessmentsAssessmentForm__sessionLabel">
                    {props.t('Session')}
                  </span>
                  <div className="assessmentsAssessmentForm__sessionName">
                    {props.event && getEventName(props.event)}
                  </div>
                </>
              )}
              {shouldShowSessionSelector() && (
                <div className="assessmentsAssessmentForm__sessionSelector">
                  <SessionSelector
                    sessionType={assessmentSessionType}
                    onChange={(currentEventId) => setEventId(currentEventId)}
                    sessionId={eventId}
                    initialDateRange={getInitialDateRange()}
                    turnaroundList={props.turnaroundList}
                  />
                </div>
              )}
            </>
          )}
          <footer className="assessmentsAssessmentForm__footer">
            <TextButton
              text={props.t('Save')}
              type="primary"
              isSubmit
              isDisabled={disableSave()}
              kitmanDesignSystem
            />
          </footer>
        </div>
      </FormValidator>
    </Modal>
  );
};

export default AssessmentForm;
export const AssessmentFormTranslated = withNamespaces()(AssessmentForm);
