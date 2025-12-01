// @flow
import moment from 'moment';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import _cloneDeep from 'lodash/cloneDeep';
import { colors } from '@kitman/common/src/variables';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { IssueStatusEventResponse } from '@kitman/common/src/types/Issues';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import type { ReopeningReasonsResponse } from '@kitman/services/src/services/medical/getReopeningReasons';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { Modal, TextButton, TextTag } from '@kitman/components';
import { deleteLastEvent } from '@kitman/services';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import { AddAvailabilityEventsFormTranslated as AddAvailabilityEventsForm } from './AddAvailabilityEventsForm';
import useIssueFields from '../../../../shared/hooks/useIssueFields';
import style from './style';
import Toasts from '../../../../shared/containers/Toasts';
import { addToast } from '../../../../shared/redux/actions';
import { getInvalidFields } from '../../utils';

type RequestStatus = 'PENDING' | 'FAILURE' | null;

type Props = {
  injuryStatuses: InjuryStatuses,
  athleteData: AthleteData,
  reopeningReasons: ReopeningReasonsResponse,
};

const Event = ({
  event,
  eventDuration,
  eventNumber,
  startDate,
  endDate,
  isResolved,
  t,
}: I18nProps<{
  event: IssueStatusEventResponse,
  eventDuration: number,
  eventNumber: number,
  startDate: string,
  endDate: string,
  isResolved?: boolean,
}>) => (
  <ul css={style.availabilityDetails}>
    <li css={style.statusOrder}>{eventNumber}</li>
    <li css={style.statusDaterange}>
      <span css={style.detailLabel}>
        {startDate} - {endDate}:{' '}
      </span>
      {event.injury_status.description}
    </li>
    <li>
      <span css={style.detailLabel}>{t('Updated by')}: </span>
      {event.created_by?.fullname || '-'}
    </li>
    {!isResolved && (
      <li>
        <span css={style.detailLabel}>{t('Duration')}: </span>
        {t('{{duration}} days', {
          duration: eventDuration,
        })}
      </li>
    )}
  </ul>
);

const AvailabilityHistory = (props: I18nProps<Props>) => {
  const { issue, issueType, updateIssue, isContinuationIssue, isReadOnly } =
    useIssue();
  const { permissions } = usePermissions();
  const { organisation } = useOrganisation();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const dispatch = useDispatch();
  const allowValidation = window.featureFlags['incomplete-injury-fields'];

  /*
   * events ordered from the latest to the earliest
   * It is more convenient as it is the order in which we render them
   */
  const order = issue?.events_order || [];
  const reverseOrderedEvents = [...order]
    .reverse()
    .map((eventId) => issue.events.find(({ id }) => id === eventId));

  const currentEvent =
    reverseOrderedEvents.length > 0 ? reverseOrderedEvents[0] : null;
  const previousEvents =
    reverseOrderedEvents.length > 1 ? reverseOrderedEvents.slice(1) : [];

  const getEventEndDate = (event, index) => {
    const startDate = moment(event.event_date);
    let suitableEndDate;
    const isFirstPreviousEvent = index === 0;
    // if we're at the first previous event
    // The end date is the day before the current event's start date
    if (isFirstPreviousEvent) {
      suitableEndDate = moment(currentEvent?.event_date).subtract(1, 'days');
    } else {
      // Otherwise we use the start date of the preceding (more recent) start date
      suitableEndDate = moment(previousEvents[index - 1]?.event_date).subtract(
        1,
        'days'
      );
    }

    if (startDate.isAfter(suitableEndDate)) {
      suitableEndDate = isFirstPreviousEvent
        ? moment(currentEvent?.event_date) // Use the current event start date
        : moment(event.event_date); // Use this events start date
    }

    return DateFormatter.formatStandard({
      date: suitableEndDate,
    });
  };

  const { getFieldLabel, validate } = useIssueFields({
    issueType: issueType === 'Injury' ? 'injury' : 'illness',
    skip: false,
  });

  const invalidFields = useMemo(() => {
    const fields = getInvalidFields(
      organisation,
      issue,
      issueType,
      isContinuationIssue
    );

    return validate(fields, 'full');
  }, [issue, issueType, validate]);

  // When we return the status' from the BE, the last item in the list is ALWAYS the resolver
  // We need to keep track of this as the first status cannot be resolved immediately
  // However, if we have a status already set, then we must exclude this status from the list of initallly
  // available statuses
  // Adding a '1' as default in case of the unlikely event we hit an out of bounds exception
  // It shouldn't happen, but just in case it does

  // The statuses are not indexed at 0, the length will suffice
  const LAST_EVENT_ID =
    currentEvent?.injury_status.id || props.injuryStatuses?.length || 1;

  const checkInjuryStatusIfResolved = () => {
    const foundStatus = props.injuryStatuses.find(
      (status) => status.id === currentEvent?.injury_status.id
    );
    return !!foundStatus?.is_resolver;
  };

  const deleteCurrentStatus = () => {
    setRequestStatus('PENDING');
    deleteLastEvent(issue.athlete_id, issue.id, issueType).then(
      () => {
        const {
          events,
          events_duration: duration,
          events_order: eventOrder,
        } = _cloneDeep(issue);
        let { unavailability_duration: newUnavailabilityDuration } =
          _cloneDeep(issue);

        const deletedEvent = events.pop();
        const latestEvent = events[events.length - 1];

        if (currentEvent?.injury_status.cause_unavailability)
          newUnavailabilityDuration -= duration[deletedEvent.id];
        if (latestEvent?.injury_status.cause_unavailability)
          newUnavailabilityDuration += duration[deletedEvent.id];

        duration[latestEvent.id] += duration[deletedEvent.id];
        delete duration[deletedEvent.id];
        eventOrder.pop();

        updateIssue({
          ...issue,
          events,
          events_duration: duration,
          events_order: eventOrder,
          unavailability_duration: newUnavailabilityDuration,
        });

        setRequestStatus(null);
        setShowConfirmDeleteModal(false);
        dispatch(
          addToast({
            title: 'Status Deleted Successfully',
            description: '',
            status: 'SUCCESS',
            id: '',
          })
        );
      },
      () => {
        setRequestStatus('FAILURE');
        setShowConfirmDeleteModal(false);
      }
    );
  };

  const renderDeleteStatusModal = () => (
    <Modal
      isOpen={showConfirmDeleteModal}
      onPressEscape={() => setShowConfirmDeleteModal(false)}
      close={() => setShowConfirmDeleteModal(false)}
    >
      <Modal.Header>
        <Modal.Title>{props.t('Delete Status')}</Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {checkInjuryStatusIfResolved()
          ? props.t(
              'This will delete the current status and reopen the injury. You will not be able to undo this action.'
            )
          : props.t(
              'This will delete the current status. You will not be able to undo this action.'
            )}
      </Modal.Content>

      <Modal.Footer>
        <TextButton
          text={props.t('Cancel')}
          onClick={() => setShowConfirmDeleteModal(false)}
          isDisabled={requestStatus === 'PENDING'}
          kitmanDesignSystem
        />
        <TextButton
          text={props.t('Delete')}
          type="primaryDestruct"
          onClick={deleteCurrentStatus}
          isLoading={requestStatus === 'PENDING'}
          kitmanDesignSystem
        />
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      {renderDeleteStatusModal()}
      {window.featureFlags['preliminary-injury-illness'] &&
        invalidFields.length > 0 && (
          <section css={[style.section, style.preliminaryStatusSection]}>
            <header>
              <h2
                className="kitmanHeading--L2"
                css={[style.preliminaryStatusHeading]}
              >
                {props.t('Preliminary status: ')}
                <TextTag
                  content={props.t('{{numFields}} outstanding', {
                    numFields: invalidFields.filter(
                      (field) => getFieldLabel(field) !== ''
                    ).length,
                  })}
                  backgroundColor={colors.red_100_20}
                  textColor={colors.red_300}
                />
              </h2>
            </header>
            <ul css={style.preliminaryStatusList}>
              {invalidFields.map((field) => {
                const label = getFieldLabel(field);

                if (label === '') {
                  return null;
                }

                return <li key={field}>{getFieldLabel(field)}</li>;
              })}
            </ul>
          </section>
        )}
      <section css={style.section} data-testid="AvailabilityHistory">
        <AddAvailabilityEventsForm
          athleteData={props.athleteData}
          issueHasOutstandingFields={invalidFields.length}
          lastEventId={LAST_EVENT_ID}
          injuryStatuses={props.injuryStatuses}
          reopeningReasons={props.reopeningReasons}
          editStatusOpen={editStatusOpen}
          setEditStatusOpen={setEditStatusOpen}
          currentEvent={currentEvent}
          isValidationCheckAllowed={allowValidation}
        />
        {currentEvent && !editStatusOpen && (
          <section
            css={style.availabilitySection}
            data-testid="AvailabilityHistory|CurrentStatusList"
          >
            <div css={style.currentStatusHeaderSection}>
              <h3 className="kitmanHeading--L3">{props.t('Current status')}</h3>
              {permissions.medical.injuryStatus.canDelete &&
                !issue.player_left_club &&
                issue.events.length > 1 &&
                !isReadOnly && (
                  <TextButton
                    onClick={() => setShowConfirmDeleteModal(true)}
                    testId="current-status-bin"
                    iconBefore="icon-bin"
                    type="subtle"
                    kitmanDesignSystem
                  />
                )}
              {permissions.medical.issues.canEdit &&
                !issue.player_left_club &&
                !isReadOnly &&
                issue.events.length === 1 && (
                  <TextButton
                    text={props.t('Edit')}
                    onClick={() => setEditStatusOpen(true)}
                    testId="edit-status-btn"
                    type="secondary"
                    kitmanDesignSystem
                  />
                )}
            </div>
            <ol css={style.statusList}>
              <Event
                event={currentEvent}
                eventDuration={issue.events_duration[currentEvent.id]}
                eventNumber={issue.events_order.length}
                startDate={DateFormatter.formatStandard({
                  date: moment(currentEvent.date),
                })}
                endDate={props.t('Present')}
                isResolved={checkInjuryStatusIfResolved()}
                t={props.t}
              />
            </ol>
          </section>
        )}

        {previousEvents.length > 0 && (
          <section
            css={style.availabilitySection}
            data-testid="AvailabilityHistory|PreviousStatusList"
          >
            <h3 className="kitmanHeading--L3">{props.t('Previous status')}</h3>

            <ol css={style.statusList}>
              {previousEvents.map(
                (event, index) =>
                  event && (
                    <Event
                      event={event}
                      eventDuration={issue.events_duration[event.id]}
                      eventNumber={previousEvents.length - index}
                      startDate={DateFormatter.formatStandard({
                        date: moment(event.date),
                      })}
                      endDate={getEventEndDate(event, index)}
                      key={event.id}
                      t={props.t}
                    />
                  )
              )}
            </ol>
          </section>
        )}

        <section
          css={style.availabilitySection}
          data-testid="AvailabilityHistory|AvailabilitySummary"
        >
          <h3 className="kitmanHeading--L3">
            {props.t('Availability summary')}
          </h3>
          <ul css={[style.availabilityDetails, style.availabilitySummary]}>
            <li>
              <span css={style.detailLabel}>{props.t('Total duration')}: </span>
              {props.t('{{duration}} days', {
                duration: issue.total_duration,
              })}
            </li>
            <li>
              <span css={style.detailLabel}>
                {props.t('Total unavailability')}:{' '}
              </span>
              {props.t('{{duration}} days', {
                duration: issue.unavailability_duration,
              })}
            </li>
          </ul>
        </section>
      </section>
      <Toasts />
    </>
  );
};

export const AvailabilityHistoryTranslated =
  withNamespaces()(AvailabilityHistory);
export default AvailabilityHistory;
