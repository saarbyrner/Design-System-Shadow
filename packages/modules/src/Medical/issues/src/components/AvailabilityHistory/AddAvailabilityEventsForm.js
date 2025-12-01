/* eslint-disable no-unused-expressions */
// @flow
import { useEffect, useState } from 'react';
import type { Node } from 'react';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import {
  AppStatus,
  DatePicker,
  IconButton,
  InfoTooltip,
  Select,
  TextButton,
  Textarea,
  TextTag,
} from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { ReopeningReasonsResponse } from '@kitman/services/src/services/medical/getReopeningReasons';
import { saveIssue, updateLastEvent } from '@kitman/services';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { useIssueTabRequestStatus } from '../../hooks/useIssueTabRequestStatus';
import { updateFreetextComponentResults } from '../../../../shared/utils';

type AvailabilityEvent = {
  id: ?string,
  date: ?string,
  injury_status_id: ?number,
};

type AvailabilityEventsForm = {
  events: Array<AvailabilityEvent>,
  reopened_status: {
    reason: string,
  },
  freetext_value?: string,
};

type Props = {
  injuryStatuses: InjuryStatuses,
  lastEventId: number,
  issueHasOutstandingFields: boolean,
  reopeningReasons: ReopeningReasonsResponse,
  athleteData: AthleteData,
  editStatusOpen: boolean,
  setEditStatusOpen: (boolean) => void,
  currentEvent: AvailabilityEvent,
  isValidationCheckAllowed: boolean,
};

const style = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    h2: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: colors.grey_300,
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '24px',
    },
  },
  actions: {
    display: 'flex',
    button: {
      '&:not(:last-of-type)': {
        marginRight: '5px',
      },
    },
  },
  form: {
    paddingBottom: '16px',
    marginBottom: '16px',
    borderBottom: `1px solid ${colors.neutral_300}`,
    '.iconButton': {
      color: colors.grey_200,
      marginTop: '23px !important',
      height: '35px',
    },
  },
  reopenSection: {
    paddingBottom: '8px',
    marginBottom: '16px',
  },
  reopenReason: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  eventNumber: {
    color: colors.grey_100,
    fontSize: '20px',
    fontWeight: 600,
    width: '24px',
    marginRight: '12px',
    paddingTop: '32px',
  },
  event: {
    marginBottom: '16px',
    '.iconButton': {
      marginTop: '16px',
    },
    '.kitmanReactSelect': {
      flex: '1',
    },
  },
  eventFirstRow: {
    display: 'flex',
  },
  playerLeftToggleRow: {
    display: 'flex',
    borderBottom: `1px solid ${colors.neutral_300}`,
    borderTop: `1px solid ${colors.neutral_300}`,
    padding: '16px 0 16px 32px',
  },
  eventSecondRow: {
    marginTop: '14px',
    paddingLeft: '35px',
    '.datePicker': {
      width: '220px',
    },
  },
  addBtn: {
    paddingLeft: '35px',
  },
  datepickerWrapper: {
    marginTop: '14px',
    paddingLeft: '35px',
    width: '200px',
  },
  statusError: {
    color: colors.red_200,
    marginLeft: '36px',
    marginTop: '8px',
  },
};

type RequestStatus = 'PENDING' | 'FAILURE' | null;

const getAvailabilityEvent = (events = [], date, currentEvent) => ({
  id: currentEvent ? currentEvent.id : '',
  date: (currentEvent || !events.length) && date ? moment(date) : '',
  injury_status_id: currentEvent ? currentEvent.injury_status_id : null,
});

const getEmptyForm = (issue: IssueOccurrenceRequested) => ({
  events: [getAvailabilityEvent(issue.events, issue.occurrence_date)],
  reopened_status: issue.reopened_status || {
    reason: '',
  },
  freetext_value: '',
});

const SaveWrapper = (props: {
  shouldDisplayTooltip: boolean,
  tooltipContent: string,
  children: Node,
}) => {
  if (props.shouldDisplayTooltip) {
    return (
      <InfoTooltip content={props.tooltipContent}>
        <div>{props.children}</div>
      </InfoTooltip>
    );
  }

  return props.children;
};

const AddAvailabilityEventsForm = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { issue, issueType, updateIssue, isReadOnly } = useIssue();

  const { isIssueTabLoading, updateIssueTabRequestStatus } =
    useIssueTabRequestStatus();

  const isPastAthlete = !!props.athleteData?.org_last_transfer_record?.left_at;

  const maxPermittedReopeningDate = () => {
    if (isPastAthlete) {
      return props.athleteData?.org_last_transfer_record?.left_at
        ? props.athleteData.org_last_transfer_record.left_at
        : null;
    }
    return new Date();
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<AvailabilityEventsForm>(() =>
    getEmptyForm(issue)
  );
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [emptyStatuses, setEmptyStatuses] = useState<Array<number>>([]);
  const [identicalStatuses, setIdenticalStatuses] = useState<Array<number>>([]);

  const [isReopening, setIsReopening] = useState(false);

  const showPlayerMovementDatePicker = () => {
    return window.featureFlags['player-movement-aware-datepicker'];
  };

  const getDatePickerValue = (
    event: AvailabilityEvent,
    previousStatus = null
  ): ?string => {
    let dateValue;

    if (window.getFlag('pm-default-injury-status-date')) {
      if (isPastAthlete) {
        dateValue = props.athleteData.org_last_transfer_record?.left_at;
      } else {
        dateValue = null;
      }
    } else {
      dateValue = event.date || previousStatus?.date;
    }
    return dateValue;
  };

  useEffect(() => {
    if (props.editStatusOpen && props.currentEvent) {
      setIsFormOpen(true);
      setForm({
        ...form,
        events: [
          getAvailabilityEvent(
            issue.events,
            props.currentEvent.date,
            props.currentEvent
          ),
        ],
      });
    }
  }, [props.editStatusOpen, props.currentEvent]);

  // If the status is the first one of the form, look at the last saved status,
  // otherwise, look at the previous status in the form
  const getPreviousStatus = (formRowIndex) => {
    return formRowIndex === 0
      ? issue.events[issue.events.length - 1]
      : form.events[formRowIndex - 1];
  };

  const getIssueEndpoint = (athleteId, issueNumber) => {
    let finalUrl = '';

    if (issueType === 'Injury') {
      finalUrl = `/athletes/${athleteId}/injuries/${issueNumber}/update_last_event`;
    }
    if (issueType === 'Illness') {
      finalUrl = `/athletes/${athleteId}/illnesses/${issueNumber}/update_last_event`;
    }
    return finalUrl;
  };

  const onClickEditStatusSave = () => {
    const currentEventId = form.events[0].injury_status_id;
    const currentInjuryStatus = props.injuryStatuses.find(
      (status) => status.id === currentEventId
    );
    const issueEndpoint = getIssueEndpoint(issue.athlete_id, issue.id);

    if (currentEventId && currentInjuryStatus && issueEndpoint)
      updateLastEvent(issueEndpoint, currentEventId)
        .then(() => {
          setRequestStatus(null);
          setIsFormOpen(false);
          props.setEditStatusOpen(false);
          updateIssue({
            ...issue,
            events: [
              {
                ...issue.events[0],
                injury_status_id: currentEventId,
                injury_status: {
                  id: currentEventId,
                  description: currentInjuryStatus.description,
                  cause_unavailability:
                    currentInjuryStatus.cause_unavailability,
                  restore_availability:
                    currentInjuryStatus.restore_availability,
                },
              },
            ],
          });
          setForm(getEmptyForm(issue));
        })
        .catch(() => setRequestStatus('FAILURE'));
  };

  const onClickSave = () => {
    // Validation
    const updatedEmptyStatuses = [];
    const updatedIdenticalStatuses = [];

    form.events.forEach((event, index) => {
      // Statuses should not be empty
      if (event.injury_status_id === null) {
        updatedEmptyStatuses.push(index);
      }

      // Statuses should differ from their previous status
      const previousStatus = getPreviousStatus(index);
      if (previousStatus?.injury_status_id === event.injury_status_id) {
        updatedIdenticalStatuses.push(index);
      }
    });

    setEmptyStatuses(updatedEmptyStatuses);
    setIdenticalStatuses(updatedIdenticalStatuses);

    // If the validation fails, abort
    if (
      updatedEmptyStatuses.length > 0 ||
      updatedIdenticalStatuses.length > 0
    ) {
      return;
    }

    // If the validation succeed, save the statuses
    setRequestStatus('PENDING');
    updateIssueTabRequestStatus('PENDING');
    const uptoDateFreeTexts = updateFreetextComponentResults(
      issue.freetext_components,
      'issue_reopening_reasons',
      form.freetext_value
    );

    const payload: Object = {
      events: [
        ...issue.events,
        ...form.events.map((event) => {
          return {
            ...event,
            // Stripping the time from dates sent so data doesn't get poluted
            date: moment(event.date)
              .startOf('day')
              .format(DateFormatter.dateTransferFormat),
          };
        }),
      ],
      reopened_status: form.reopened_status.reason,
      issue_contact_type_id: issue.issue_contact_type?.id || null,
      injury_mechanism_id: issue.injury_mechanism_id || null,
      presentation_type_id: issue.presentation_type?.id || null,
      freetext_components: uptoDateFreeTexts,
    };

    saveIssue(issueType, issue, payload)
      .then((updatedIssue) => {
        setRequestStatus(null);
        updateIssue(updatedIssue);
        setIsFormOpen(false);
        setForm(getEmptyForm(updatedIssue));
        updateIssueTabRequestStatus('DORMANT');
      })
      .catch(() => {
        setRequestStatus('FAILURE');
        updateIssueTabRequestStatus('DORMANT');
      });
  };

  const willResolve = () => {
    if (!window.featureFlags['preliminary-injury-illness']) {
      return false;
    }
    // Get id of Resolved injury status
    const resolvedStatusId = props.injuryStatuses.find(
      (status) => status.is_resolver === true
      // $FlowFixMe
    ).id;

    return !!form.events.find((v) => v.injury_status_id === resolvedStatusId);
  };

  const isStatusFieldInvalid = (index: number, event: AvailabilityEvent) => {
    return props.isValidationCheckAllowed
      ? emptyStatuses.includes(index) ||
          identicalStatuses.includes(index) ||
          !event.injury_status_id
      : emptyStatuses.includes(index) || identicalStatuses.includes(index);
  };

  const discardChanges = () => {
    setIsFormOpen(false);
    setIsReopening(false);
    setForm(getEmptyForm(issue));
    props.setEditStatusOpen(false);
  };

  useEffect(() => {
    if (issue.player_left_club) discardChanges();
  }, [issue.player_left_club]);

  const isSaveDisabled = (): boolean => {
    const firstEvent = form.events[0];
    // When there is no availability status - the event value is set to a string date from BE
    // When a status already exists/or one added on the form - the date values will be a moment object
    const isDateStringAndNotMoment =
      typeof firstEvent.date === 'string' && !moment.isMoment(firstEvent.date);
    const isStatusMissing = !firstEvent.injury_status_id;
    const hasOutstandingFieldsAndWillResolve =
      props.issueHasOutstandingFields && willResolve();
    const disableParallelEdits = window.getFlag(
      'disable-parallel-injury-edits'
    );
    const isPending = requestStatus === 'PENDING';

    return (
      (disableParallelEdits && (isIssueTabLoading || isPending)) ||
      hasOutstandingFieldsAndWillResolve ||
      isStatusMissing ||
      isDateStringAndNotMoment ||
      isPending
    );
  };

  const getActionButtons = () => {
    if (isReadOnly) return null;
    if (!permissions.medical.issues.canEdit) return null;

    return !isFormOpen && !isReopening ? (
      <TextButton
        text={
          window.featureFlags['reason-for-reopening'] && issue.closed
            ? props.t('Reopen')
            : props.t('Add')
        }
        type="secondary"
        onClick={() => {
          window.featureFlags['reason-for-reopening'] && issue.closed
            ? setIsReopening(true)
            : null;
          setIsFormOpen(true);
        }}
        isDisabled={issue.player_left_club}
        kitmanDesignSystem
      />
    ) : (
      <div css={style.actions} data-testid="AddAvailabilityEventsForm|Actions">
        <TextButton
          text={props.t('Discard changes')}
          type="subtle"
          onClick={discardChanges}
          isDisabled={requestStatus === 'PENDING'}
          kitmanDesignSystem
        />
        <SaveWrapper
          shouldDisplayTooltip={
            props.issueHasOutstandingFields && willResolve()
          }
          tooltipContent={props.t(
            'Issues cannot be resolved while in a preliminary state'
          )}
        >
          <TextButton
            text={props.t('Save')}
            type="primary"
            onClick={() => {
              props.editStatusOpen ? onClickEditStatusSave() : onClickSave();
            }}
            isDisabled={isSaveDisabled()}
            kitmanDesignSystem
          />
        </SaveWrapper>
      </div>
    );
  };

  const mapStatusToOptions = (options) => {
    return options.map((status) => {
      return {
        label: status.description,
        value: status.id,
      };
    });
  };

  const getAvailabilityStatusOptions = (eventNumber, previousStatus) => {
    // If it's the first event, remove the resolver as we can't immediately resolve the issue
    if (!props.lastEventId) {
      return mapStatusToOptions(props.injuryStatuses.slice(0, -1));
    }
    //  Or if we have a previous event, remove the status id from the available options
    if (eventNumber === 1 && !props.editStatusOpen) {
      return mapStatusToOptions(
        props.injuryStatuses.filter((status) => status.id !== props.lastEventId)
      );
    }
    // if we are editing the first event no need for resolving conditions
    if (eventNumber === 1 && props.editStatusOpen) {
      return mapStatusToOptions(
        props.injuryStatuses.filter((status) => status.is_resolver !== true)
      );
    }
    // If we have a previous status, we only return the statuses that are not the previous status as sequential statuses cannot be the same
    if (previousStatus) {
      return mapStatusToOptions(
        props.injuryStatuses.filter(
          (status) => status.id !== previousStatus.injury_status_id
        )
      );
    }
    return mapStatusToOptions(props.injuryStatuses);
  };

  const renderRemoveRowIcon = (index: number) => {
    return (
      <IconButton
        icon="icon-bin"
        onClick={() => {
          // Remove row's form errors
          setEmptyStatuses((prevForm) => prevForm.filter((i) => i !== index));
          setIdenticalStatuses((prevForm) =>
            prevForm.filter((i) => i !== index)
          );

          // Remove row
          setForm((prevForm) => ({
            ...form,
            events: prevForm.events.filter((item, i) => i !== index),
          }));
        }}
        isDisabled={requestStatus === 'PENDING'}
        isTransparent
      />
    );
  };

  const renderStatusEvent = (event, index) => {
    let eventNumber = issue.events.length + index;
    if (!props.editStatusOpen) eventNumber += 1;
    const previousStatus = props.editStatusOpen
      ? null
      : getPreviousStatus(index);
    const minimumDate = previousStatus?.date || null;

    if (!event.date && previousStatus?.date)
      setForm((prevForm) => {
        const updatedEvents = [...prevForm.events];
        updatedEvents[index].date = previousStatus.date;
        return {
          ...form,
          events: updatedEvents,
        };
      });

    const renderStatusDatePicker = () => {
      return (
        <div css={style.eventSecondRow}>
          <DatePicker
            label={props.t('Date')}
            name="statusDate"
            onDateChange={(value) =>
              setForm((prevForm) => {
                const updatedEvents = [...prevForm.events];
                updatedEvents[index].date = value;

                return {
                  ...form,
                  events: updatedEvents,
                };
              })
            }
            value={getDatePickerValue(event, previousStatus)}
            minDate={minimumDate}
            maxDate={moment(maxPermittedReopeningDate())}
            disableFutureDates
            kitmanDesignSystem
            disabled={eventNumber === 1 || requestStatus === 'PENDING'}
          />
        </div>
      );
    };

    const renderStatusDatePickerNew = () => {
      const dateValue = getDatePickerValue(event, previousStatus);
      const minDate = minimumDate;
      return (
        <MovementAwareDatePicker
          athleteId={props.athleteData?.id}
          value={dateValue ? moment(dateValue) : null}
          onChange={(value) =>
            setForm((prevForm) => {
              const updatedEvents = [...prevForm.events];
              updatedEvents[index].date = value;

              return {
                ...form,
                events: updatedEvents,
              };
            })
          }
          name="statusDate"
          inputLabel={props.t('Date')}
          disabled={eventNumber === 1 || requestStatus === 'PENDING'}
          minDate={minDate && moment(minDate)}
          disableFuture
          kitmanDesignSystem
        />
      );
    };

    const selectStatusValidation = isStatusFieldInvalid(index, event);
    return (
      <div css={style.event} key={eventNumber}>
        <div css={style.eventFirstRow}>
          <span css={style.eventNumber}>{eventNumber}</span>
          <Select
            data-testid="AddAvailabilityEventsForm|Selectstatus"
            id="AddAvailabilityEventsFormSelect"
            appendToBody
            value={event.injury_status_id}
            label={props.t('Status')}
            options={getAvailabilityStatusOptions(eventNumber, previousStatus)}
            onChange={(value) => {
              // Remove row's form errors
              setEmptyStatuses((prevForm) =>
                prevForm.filter((i) => i !== index)
              );
              setIdenticalStatuses((prevForm) =>
                prevForm.filter((i) => i !== index)
              );

              // update field
              setForm((prevForm) => {
                const updatedEvents = [...prevForm.events];
                updatedEvents[index].injury_status_id = value;
                return {
                  ...form,
                  events: updatedEvents,
                };
              });
            }}
            placeholder={props.t('Select status')}
            isDisabled={requestStatus === 'PENDING'}
            invalid={selectStatusValidation}
            displayValidationText
          />
          {index !== 0 && renderRemoveRowIcon(index)}
        </div>

        {identicalStatuses.includes(index) && (
          <div
            css={style.statusError}
            data-testid="AddAvailabilityEventsForm|IdenticalStatus"
          >
            {props.t('This status is identical to the previous status')}
          </div>
        )}
        {showPlayerMovementDatePicker() ? (
          <div css={style.datepickerWrapper}>{renderStatusDatePickerNew()}</div>
        ) : (
          renderStatusDatePicker()
        )}
      </div>
    );
  };

  const renderReopenFormOptions = () => {
    const mappedReasons = props.reopeningReasons.map((reason) => {
      return {
        label: reason.name,
        value: reason.id,
      };
    });

    return (
      <section
        css={style.reopenSection}
        data-testid="AddAvailabilityReopen|ReopenInjury"
      >
        <h3 className="kitmanHeading--L3">{props.t('Reopen injury')}</h3>
        <div css={style.reopenReason}>
          <Select
            data-testid="AddAvailabilityReopen|ReopenStatus"
            id="AddAvailabilityEventsFormSelect"
            appendToBody
            value={form.reopened_status.reason}
            label={props.t('Reason for reopening')}
            options={mappedReasons}
            onChange={(reason) => {
              setForm(() => {
                return {
                  ...form,
                  reopened_status: {
                    ...form.reopened_status,
                    reason,
                  },
                };
              });
            }}
            placeholder={props.t('Select reason for reopening')}
            isDisabled={requestStatus === 'PENDING'}
          />
          {form.reopened_status.reason === 4 && (
            <Textarea
              label={props.t('Other reason')}
              value={form.freetext_value}
              onChange={(value) => {
                setForm(() => {
                  return {
                    ...form,
                    freetext_value: value,
                  };
                });
              }}
              name="AddAvailabilityReopen|OtherReason"
              maxLimit={65535}
              kitmanDesignSystem
            />
          )}
        </div>
      </section>
    );
  };

  const renderAddStatusForm = () => {
    return (
      <div css={style.form} data-testid="AddAvailabilityEventsForm|Form">
        {window.featureFlags['reason-for-reopening'] &&
          isReopening &&
          renderReopenFormOptions()}
        {form.events.map((event, index) => renderStatusEvent(event, index))}
        {!props.editStatusOpen && (
          <div
            css={style.addBtn}
            data-testid="AddAvailabilityEventsForm|AddStatusBtn"
          >
            <TextButton
              onClick={() =>
                setForm((prevForm) => ({
                  ...prevForm,
                  events: [
                    ...prevForm.events,
                    getAvailabilityEvent(issue.events),
                  ],
                }))
              }
              text={props.t('Add status')}
              isDisabled={requestStatus === 'PENDING'}
              kitmanDesignSystem
            />
          </div>
        )}
        {requestStatus === 'FAILURE' && <AppStatus status="error" />}
      </div>
    );
  };

  return (
    <>
      <header css={style.header}>
        <h2>
          {props.t('Availability history')}
          {props.isValidationCheckAllowed &&
            !isFormOpen &&
            !props.currentEvent && (
              <TextTag
                backgroundColor={colors.red_100_20}
                textColor={colors.red_300}
                content={props.t('Required')}
              />
            )}
        </h2>

        {getActionButtons()}
      </header>
      {isFormOpen && renderAddStatusForm()}
    </>
  );
};

export const AddAvailabilityEventsFormTranslated = withNamespaces()(
  AddAvailabilityEventsForm
);
export default AddAvailabilityEventsForm;
