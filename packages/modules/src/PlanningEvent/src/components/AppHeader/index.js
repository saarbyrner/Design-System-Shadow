// @flow
import { useState, useMemo } from 'react';
import moment from 'moment-timezone';
import { withNamespaces } from 'react-i18next';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import type { Event } from '@kitman/common/src/types/Event';
import {
  AppStatus,
  TextButton,
  TooltipMenu,
  ToggleSwitch,
  IconButton,
} from '@kitman/components';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { isNotificationActionable } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';
import type { EventConditions } from '@kitman/services/src/services/getEventConditions';
import { formatGameDayPlusMinus } from '@kitman/common/src/utils/workload';
import deleteEvent from '@kitman/modules/src/PlanningHub/src/services/deleteEvent';
import { EditEventPanelTranslated as EventSidePanel } from '@kitman/modules/src/PlanningEventSidePanel';
import { getNewContentTypeColorfulIcons } from '@kitman/common/src/utils/mediaHelper';
import type { ToastDispatch } from '@kitman/components/src/types';
import type { ToastAction } from '@kitman/components/src/Toast/KitmanDesignSystem/hooks/useToasts';
import { buildParentsLabel } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/LocationSelect/utils';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import saveEvent from '@kitman/modules/src/PlanningEvent/src/services/saveEvent';
import { venueTypes } from '@kitman/common/src/consts/gameEventConsts';
import type { RequestStatus } from '@kitman/common/src/types/index';
import type { TooltipItem } from '@kitman/components/src/TooltipMenu';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { setOpponentName } from '@kitman/modules/src/PlanningEventSidePanel/src/components/gameLayoutV2/utils';
import { getEventName } from '@kitman/modules/src/PlanningEvent/src/helpers/utils';
import { typography, colors } from '@kitman/common/src/variables';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import { useGetNotificationTriggersQuery } from '@kitman/services/src/services/OrganisationSettings/Notifications';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { Typography, Stack } from '@kitman/playbook/components';
import Countdown from '@kitman/modules/src/MatchDay/components/Countdown';
import MatchDayStatusInfo from '@kitman/modules/src/shared/MatchDayStatusInfo';
import { getTeamMatchDayCompletionStatus } from '@kitman/common/src/utils/planningEvent';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { mailingList } from '@kitman/modules/src/Contacts/shared/constants';
import { EventActionModalTranslated as EventActionModal } from '@kitman/modules/src/shared/EventActionModal';
import { actionEnumLike } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/utils/enum-likes';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';

import { AddAthletesSidePanelTranslated as AddAthletesSidePanel } from '../AddAthletesSidePanel';
import { MatchDayHeaderButtonsTranslated as MatchDayHeaderButtons } from './MatchDayHeaderButtons';
import styles from './styles';
import { getMatchDayView } from '../../redux/selectors/planningEventSelectors';

const { temperatureSymbol } = typography;

type Props = {
  eventConditions: EventConditions,
  event: Event,
  leagueEvent: Event,
  orgTimezone: string,
  canEditEvent: boolean,
  canDeleteEvent: boolean,
  canManageWorkload: boolean,
  canViewIssues: boolean,
  withMetaInformation: boolean,
  onUpdateEvent: (Event, ?boolean) => void,
  onSaveParticipantsSuccess: Function,
  onDownloadPlan: () => void,
  onDuplicateEvent: () => void,
  setIsEditModalOpen: Function,
  toastAction: ToastDispatch<ToastAction>,
  squadName: string,
  isEditModalOpen: boolean,
  hasGameDetailsMissing: boolean,
};

const AppHeader = (props: I18nProps<Props>) => {
  const { isLeagueStaffUser, isOrgSupervised } = useLeagueOperations();
  const { preferences } = usePreferences();

  const matchDayView = useSelector(getMatchDayView());

  const { data: notificationTriggers } = useGetNotificationTriggersQuery(
    undefined,
    {
      refetchOnMountOrArgChange: false,
    }
  );

  const isImportedGame =
    props.event?.type === 'game_event' && props.event?.league_setup;

  const dmnAndDmrPreferences =
    preferences?.league_game_team || preferences?.league_game_information;

  const isMatchDayFlow = isImportedGame && dmnAndDmrPreferences;

  const viewableEvent =
    isMatchDayFlow && isLeagueStaffUser ? props.leagueEvent : props.event;

  const isPitchViewToggleEnabled =
    window.getFlag('planning-game-events-field-view') &&
    viewableEvent.type === 'game_event';

  const originalStartTime = useLocationSearch().get('original_start_time');
  const isVirtualEvent = !!originalStartTime;
  const [openDeletionMenu, setOpenDeletionMenu] = useState<boolean>(false);

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null); // this request triggers the loading app status
  const [eventCompleteRequestStatus, setEventCompleteRequestStatus] =
    useState<RequestStatus>(null); // this request doesn't trigger the loading app status
  const gameDayPlusMinus = useMemo(
    () => formatGameDayPlusMinus(viewableEvent),
    [viewableEvent]
  );
  const [isAddAthletesPanelOpen, setIsAddAthletesPanelOpen] = useState(false);
  let opponentInfo =
    viewableEvent.type !== 'custom_event'
      ? viewableEvent.opponent_squad || viewableEvent.opponent_team
      : {};
  opponentInfo = setOpponentName(opponentInfo);

  const formatDate = (date: moment): string => {
    if (
      window.getFlag('standard-date-formatting') ||
      isPitchViewToggleEnabled
    ) {
      return DateFormatter.formatStandard({
        date,
        showTime: !isPitchViewToggleEnabled,
        displayLongDate: true,
      });
    }

    return date.format('LLL');
  };

  const formatTime = (date: moment): string => {
    if (
      window.getFlag('standard-date-formatting') ||
      isPitchViewToggleEnabled
    ) {
      return DateFormatter.formatJustTime(date);
    }

    return date.format('h:mm a');
  };

  const changeEventCompleteValue = () => {
    setEventCompleteRequestStatus('PENDING');
    const newValue = !props.event.event_collection_complete;
    // The type is correct but saveEvent expects only some fields of `Event`
    // type, even though it can accept the whole `Event`.
    // $FlowIgnore[incompatible-type]
    const newEvent = {
      ...props.event,
      event_collection_complete: newValue,
    };

    saveEvent({
      event: { id: props.event.id, event_collection_complete: newValue },
    })
      .then(() => {
        setEventCompleteRequestStatus('SUCCESS');
        props.onUpdateEvent(newEvent, true);
      })
      .catch(() => {
        setEventCompleteRequestStatus('FAILURE');
      });
  };

  const renderMatchDayNoticeHeaderInfo = (startOrgDate: Date) => {
    let homeStatus;
    let awayStatus;

    const eventLockTime = moment(viewableEvent.game_participants_lock_time);
    const isDmrLockedFromTime = moment().isAfter(eventLockTime);
    const isDmrPastStartTime = moment().isAfter(viewableEvent?.start_date);

    const isDmrLocked = isDmrLockedFromTime || isDmrPastStartTime;

    if (isLeagueStaffUser) {
      homeStatus = getTeamMatchDayCompletionStatus({
        competitionConfig: viewableEvent?.competition,
        dmrStatuses: viewableEvent?.home_dmr,
        isHomeStatuses: true,
      });
      awayStatus = getTeamMatchDayCompletionStatus({
        competitionConfig: viewableEvent?.competition,
        dmrStatuses: viewableEvent?.away_dmr,
      });
    } else {
      homeStatus = getTeamMatchDayCompletionStatus({
        competitionConfig: viewableEvent?.competition,
        dmrStatuses: viewableEvent?.dmr,
        isHomeStatuses: viewableEvent?.venue_type?.name === venueTypes.home,
      });
    }

    let iconName = KITMAN_ICON_NAMES.Email;
    let iconColor: string | null = null;

    if (
      (matchDayView === mailingList.Dmn &&
        viewableEvent?.dmn_notification_status) ||
      (matchDayView === mailingList.Dmr &&
        viewableEvent?.dmr_notification_status)
    ) {
      iconName = KITMAN_ICON_NAMES.MarkEmailReadIcon;
    }

    if (
      matchDayView === mailingList.Dmr &&
      props.leagueEvent?.skip_automatic_game_team_email
    ) {
      iconName = KITMAN_ICON_NAMES.MailLockIcon;
      iconColor = colors.red_100;
    }

    return (
      <>
        <Typography variant="body1" sx={styles.subtitle}>
          {props.t('Countdown')} <Countdown targetDate={startOrgDate} />
        </Typography>
        <MatchDayStatusInfo homeStatus={homeStatus} awayStatus={awayStatus} />
        <KitmanIcon
          name={
            isDmrLocked ? KITMAN_ICON_NAMES.Lock : KITMAN_ICON_NAMES.LockOpen
          }
          sx={{
            fontSize: '20px',
          }}
        />

        <KitmanIcon
          name={iconName}
          sx={{
            fontSize: '20px',
            color: iconColor,
          }}
        />
      </>
    );
  };

  const renderEventDateTimes = () => {
    const startOrgDate = moment.tz(viewableEvent.start_date, props.orgTimezone);
    const endOrgDate = moment.tz(viewableEvent.end_date, props.orgTimezone);

    const renderAdditionalTimeInfo = () => {
      if (isMatchDayFlow && preferences?.league_game_team_lock_minutes)
        return renderMatchDayNoticeHeaderInfo(startOrgDate);

      let timeText = '';
      if (
        props.event.local_timezone !== props.orgTimezone &&
        !isPitchViewToggleEnabled
      )
        timeText += ` (${formatTime(
          moment.tz(viewableEvent.start_date, viewableEvent.local_timezone)
        )} ${props.event.local_timezone})`;

      timeText += isPitchViewToggleEnabled
        ? ` ${formatTime(startOrgDate)} - ${formatTime(endOrgDate)}`
        : viewableEvent.duration && ` (${viewableEvent.duration} min)`;

      return timeText;
    };

    return (
      <Stack
        direction="row"
        gap={1}
        sx={{
          alignItems: 'center',
        }}
        className="planningEventHeader__eventTime"
      >
        {formatDate(startOrgDate)}, {renderAdditionalTimeInfo()}
      </Stack>
    );
  };

  const getEventActionProperties = () => {
    const editProperties = {
      description: isPitchViewToggleEnabled
        ? props.t('Game Details')
        : props.t('Edit details'),
      onClick: () => props.setIsEditModalOpen(true),
    };

    const deleteProperties = {
      description: props.t('Delete'),
      onClick: () => setOpenDeletionMenu(true),
    };
    const downloadPlanProperties = {
      description: props.t('Print/Download'),
      onClick: props.onDownloadPlan,
    };

    const markSessionCompleteDescription = props.event.event_collection_complete
      ? props.t('Mark session as incomplete')
      : props.t('Mark session as complete');

    const markGameCompleteDescription = props.event.event_collection_complete
      ? props.t('Mark game as incomplete')
      : props.t('Mark game as complete');

    const markEventCompleteProperties = {
      description:
        props.event.type === 'session_event'
          ? markSessionCompleteDescription
          : markGameCompleteDescription,
      onClick: changeEventCompleteValue,
    };
    const duplicateEventPlanProperties = {
      description: props.t('Duplicate event'),
      onClick: props.onDuplicateEvent,
    };

    const canDownloadPlan =
      window.getFlag('planning-tab-sessions') &&
      props.event.type === 'session_event';

    const canDuplicateEvent =
      ((window.getFlag('planning-tab-sessions') &&
        window.getFlag('selection-tab-displaying-in-session')) ||
        window.getFlag('duplicate-event-inside-an-event-nfl')) &&
      props.event.type === 'session_event';

    const canDeleteEvent = props.canDeleteEvent && !isImportedGame;

    const canMarkEventComplete =
      window.getFlag('event-collection-complete') &&
      (props.event.type === 'session_event' ||
        props.event.type === 'game_event');

    const tooltipMenu: Array<TooltipItem> = [
      canDownloadPlan ? downloadPlanProperties : null,
      canDuplicateEvent && !preferences.display_duplication_main_event_page
        ? duplicateEventPlanProperties
        : null,
      canDeleteEvent ? deleteProperties : null,
    ].filter(Boolean);

    return {
      editProperties,
      markEventCompleteProperties,
      canMarkEventComplete,
      tooltipMenu,
      canDuplicateEvent,
      duplicateEventPlanProperties,
    };
  };

  const renderAppHeaderButtons = () => {
    const {
      editProperties,
      markEventCompleteProperties,
      canMarkEventComplete,
      tooltipMenu,
      canDuplicateEvent,
      duplicateEventPlanProperties,
    } = getEventActionProperties();

    const renderDesktopViewButtons = () => (
      <div className="planningEventHeader__actions planningEventHeader__actions--desktop">
        {isPitchViewToggleEnabled ? (
          <>
            {props.canEditEvent && (
              <>
                {window.getFlag('event-collection-complete') &&
                  props.event.type === 'game_event' && (
                    <div css={styles.eventCompleteToggle}>
                      <ToggleSwitch
                        isSwitchedOn={props.event.event_collection_complete}
                        toggle={changeEventCompleteValue}
                        label={props.t('Complete')}
                        kitmanDesignSystem
                      />
                    </div>
                  )}
                <TextButton
                  onClick={editProperties.onClick}
                  text={editProperties.description}
                  type="primary"
                  kitmanDesignSystem
                />
              </>
            )}
          </>
        ) : (
          <>
            {props.canEditEvent && (
              <>
                {canMarkEventComplete && (
                  <div css={styles.eventCompleteToggle}>
                    <ToggleSwitch
                      isSwitchedOn={props.event.event_collection_complete}
                      toggle={changeEventCompleteValue}
                      label={props.t('Complete')}
                      kitmanDesignSystem
                    />
                  </div>
                )}
                {window.getFlag('planning-game-events-tab-v-2') &&
                  props.event.type !== 'session_event' &&
                  props.event.type !== 'custom_event' && (
                    <TextButton
                      onClick={() => setIsAddAthletesPanelOpen(true)}
                      text={props.t('Add Athletes')}
                      type="primary"
                      kitmanDesignSystem
                    />
                  )}
                <TextButton
                  text={editProperties.description}
                  onClick={editProperties.onClick}
                  type="secondary"
                  kitmanDesignSystem
                />
              </>
            )}
          </>
        )}
        {canDuplicateEvent &&
          preferences.display_duplication_main_event_page && (
            <TextButton
              onClick={duplicateEventPlanProperties.onClick}
              text={duplicateEventPlanProperties.description}
              type="secondary"
              kitmanDesignSystem
              testId="duplicate-event-button-outside-tooltip-menu"
            />
          )}
        {tooltipMenu.length > 0 && (
          <TooltipMenu
            placement="bottom-end"
            menuItems={tooltipMenu}
            tooltipTriggerElement={
              <TextButton
                iconAfter="icon-more"
                type="secondary"
                kitmanDesignSystem
              />
            }
            kitmanDesignSystem
          />
        )}
      </div>
    );

    const renderMobileViewButtons = () => (
      <div className="planningEventHeader__actions planningEventHeader__actions--mobile">
        <TooltipMenu
          placement="bottom-end"
          menuItems={[
            ...(canMarkEventComplete ? [markEventCompleteProperties] : []),
            ...(props.canEditEvent ? [editProperties] : []),
            ...(canDuplicateEvent &&
            preferences.display_duplication_main_event_page
              ? [duplicateEventPlanProperties]
              : []),
            ...tooltipMenu,
          ]}
          tooltipTriggerElement={
            <TextButton
              iconAfter="icon-more"
              type="secondary"
              kitmanDesignSystem
            />
          }
          kitmanDesignSystem
        />
      </div>
    );

    if (isMatchDayFlow && (isLeagueStaffUser || isOrgSupervised)) {
      return (
        <MatchDayHeaderButtons
          eventId={props.event.id}
          isLeague={isLeagueStaffUser}
        />
      );
    }

    if (props.canEditEvent || props.canDeleteEvent)
      return (
        <>
          {renderDesktopViewButtons()}
          {renderMobileViewButtons()}
        </>
      );

    return null;
  };

  const renderAttachments = () => {
    const downloadableFiles = props.event?.attachments
      ?.filter(
        (eventAttachment) => eventAttachment.attachment?.confirmed === true
      )
      .map((eventAttachment) => {
        return (
          <div
            key={eventAttachment.attachment?.filename}
            className="planningEventHeader__attachmentMargin"
          >
            <a
              href={eventAttachment.attachment?.download_url}
              className="planningEventHeader__attachments"
              rel="noreferrer"
            >
              <i
                className={classNames(
                  getNewContentTypeColorfulIcons(
                    eventAttachment.attachment?.filetype
                  ),
                  'planningEventHeader__attachmentIcons'
                )}
              />
              {eventAttachment.attachment?.name ||
                eventAttachment.attachment?.filename}
            </a>
          </div>
        );
      });
    return (
      <div css={styles.metaInfo}>
        <h4>{props.t('Attachments')}</h4>
        <div className="planningEventHeader__attachmentList">
          {downloadableFiles}
        </div>
      </div>
    );
  };

  const renderLinks = () => {
    const downloadableLinks = props.event?.attached_links?.map((eventLink) => {
      return (
        <div
          key={eventLink.attached_link?.title}
          className="planningEventHeader__attachmentMargin"
        >
          <a
            target="_blank"
            href={eventLink.attached_link?.uri}
            className="planningEventHeader__attachments"
            rel="noreferrer"
          >
            <i className="icon-link" />
            {eventLink.attached_link?.title}
          </a>
        </div>
      );
    });
    return (
      <div css={styles.metaInfo}>
        <h4>{props.t('Links')}</h4>
        <div className="planningEventHeader__attachmentList">
          {downloadableLinks}
        </div>
      </div>
    );
  };

  const renderEventLocation = (eventLocation) => {
    return (
      <div css={styles.metaInfo}>
        <h4>{props.t('Location')}</h4>
        <p>{buildParentsLabel(eventLocation)}</p>
      </div>
    );
  };

  const renderMandatoryFieldsBanner = () => {
    return (
      props.hasGameDetailsMissing && (
        <div css={styles.bannerContainer}>
          <i className="icon-warning-active" css={styles.iconStyling} />
          <p css={styles.warningMessage}>
            {props.t('Mandatory game details missing')}
          </p>
          <button
            css={styles.editGameButton}
            onClick={() => props.setIsEditModalOpen(true)}
            type="button"
          >
            {props.t('Edit Game Details')}
          </button>
        </div>
      )
    );
  };

  const onConfirmDelete = (deletionParams) => {
    setOpenDeletionMenu(false);
    setRequestStatus('PENDING');
    let queryParams;
    if (getIsRepeatEvent(props.event)) {
      queryParams = {
        original_start_time: originalStartTime,
        scope: deletionParams?.recurrenceChangeScope,
      };
    }
    deleteEvent(props.event.id, queryParams).then(
      () => window.location.assign('/planning_hub/events'),
      () => setRequestStatus('FAILURE')
    );
  };

  const onDismissDelete = () => setOpenDeletionMenu(false);

  const renderDeleteModal = () => (
    <EventActionModal
      isOpen={openDeletionMenu}
      action={actionEnumLike.Delete}
      onClose={onDismissDelete}
      onConfirm={onConfirmDelete}
      // $FlowIgnore[prop-missing] valid due to getIsRepeatEvent check
      shouldLimitScopeToNext={!props.event.recurrence?.recurring_event_id}
      eventType={props.event.type}
      eventId={props.event.id}
      isRepeatEvent={getIsRepeatEvent(props.event)}
      isNotificationActionable={isNotificationActionable(notificationTriggers)}
    />
  );

  return (
    <>
      {renderMandatoryFieldsBanner()}
      <header className="planningEventHeader">
        <div className="planningEventHeader__head">
          <div>
            {window.getFlag('calendar-back-button-in-events') && (
              <span css={styles.backToCalendarButtonWrapper}>
                <IconButton
                  isSmall
                  isBorderless
                  icon="icon-next-left"
                  customStyles={{ color: colors.grey_100 }}
                  text={props.t('Calendar')}
                  onClick={() => {
                    if (!props.event?.start_date) return;
                    const params = new URLSearchParams({
                      date: props.event.start_date,
                    });
                    window.location.href = `/calendar?${params.toString()}`;
                  }}
                />
              </span>
            )}

            <h1 className="planningEventHeader__title">
              {getEventName({
                event: viewableEvent,

                squadName: props.squadName,
                isPitchViewToggleEnabled,
                isDmnDmrLeagueGame: isMatchDayFlow && isLeagueStaffUser,
              })}
            </h1>
          </div>

          {renderAppHeaderButtons()}
        </div>
        {renderEventDateTimes()}
        {props.event.event_collection_complete && (
          <p css={{ marginTop: '.375rem' }}>
            {props.t('Event collection complete')}
          </p>
        )}
        {props.event.type === eventTypePermaIds.custom.type &&
          props.event.custom_event_type && (
            <div className="custom_event_type">
              <div css={styles.metaInfo}>
                <h4>{props.t('Type')}</h4>
                <p>
                  {props.event.type === eventTypePermaIds.custom.type &&
                    props.event?.custom_event_type?.name}
                </p>
              </div>
            </div>
          )}
        {props.event.type === 'session_event' && props.event.session_type && (
          <div className="session_type">
            <div css={styles.metaInfo}>
              <h4>{props.t('Type')}</h4>
              <p>
                {props.event.type !== 'custom_event' &&
                  props.event?.session_type?.name}
              </p>
            </div>
          </div>
        )}
        {props.event.type === 'session_event' && props.event.theme?.name && (
          <div css={{ display: 'inline-block' }}>
            <div css={styles.metaInfo}>
              <h4>{props.t('Theme')}</h4>
              {/* $FlowIgnore[prop-missing] */}
              <p>{props.event.theme?.name}</p>
            </div>
          </div>
        )}
        {props.withMetaInformation && (
          <div
            data-testid="AppHeader|metaInformations"
            css={{ marginTop: '2px', display: 'inline-block' }}
          >
            {window.getFlag('planning-custom-org-event-details') &&
              props.event.type === 'session_event' &&
              opponentInfo && (
                <div css={styles.metaInfo}>
                  <h4>{props.t('Opposing Team')}</h4>
                  <p>{opponentInfo?.name}</p>
                </div>
              )}
            {gameDayPlusMinus && (
              <div css={styles.metaInfo}>
                <h4>{props.t('Game day')}</h4>
                <p>{gameDayPlusMinus}</p>
              </div>
            )}
            {viewableEvent.type === 'game_event' &&
              viewableEvent.venue_type && (
                <div css={styles.metaInfo}>
                  <h4>{props.t('Venue')}</h4>
                  <div className="planningEventHeader__eventDescription">
                    <p>
                      {viewableEvent.type === 'game_event' &&
                        viewableEvent.venue_type?.name}
                    </p>
                  </div>
                </div>
              )}
            {viewableEvent.type === 'game_event' &&
              viewableEvent.competition && (
                <div css={styles.metaInfo}>
                  <h4>{props.t('Competition')}</h4>
                  <div className="planningEventHeader__eventDescription">
                    <p>
                      {viewableEvent.type === 'game_event' &&
                        viewableEvent.competition?.name}
                    </p>
                  </div>
                </div>
              )}
            {!window.getFlag('nfl-hide-surface-type') ? (
              <>
                {viewableEvent.surface_type && (
                  <div css={styles.metaInfo}>
                    <h4>{props.t('Surface type')}</h4>
                    <p>{viewableEvent.surface_type?.name}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {props.event.nfl_field_type &&
                  props.event.nfl_surface_composition && (
                    <div css={styles.metaInfo}>
                      <h4>{props.t('Surface type')}</h4>
                      <p>
                        {props.event.nfl_field_type?.name} -{' '}
                        {props.event.nfl_surface_composition?.name}
                      </p>
                    </div>
                  )}
              </>
            )}
            {viewableEvent.surface_quality && (
              <div css={styles.metaInfo}>
                <h4>{props.t('Surface quality')}</h4>
                <p>{viewableEvent.surface_quality?.title}</p>
              </div>
            )}
            {viewableEvent.weather && (
              <div css={styles.metaInfo}>
                <h4>{props.t('Weather')}</h4>
                <p>{viewableEvent.weather?.title}</p>
              </div>
            )}
            {window.getFlag('planning-custom-org-event-details') && (
              <>
                {viewableEvent.temperature && (
                  <div css={styles.metaInfo}>
                    <h4>{props.t('Temperature')}</h4>
                    <p>
                      {viewableEvent.temperature} {temperatureSymbol}
                      {props.eventConditions.temperature_units}
                    </p>
                  </div>
                )}
                {viewableEvent.humidity && (
                  <div css={styles.metaInfo}>
                    <h4>{props.t('Humidity')}</h4>
                    <p>{viewableEvent.humidity}%</p>
                  </div>
                )}
                {viewableEvent.type !== 'custom_event' &&
                  viewableEvent.field_condition && (
                    <div css={styles.metaInfo}>
                      <h4>{props.t('Field Condition')}</h4>
                      <p>
                        {viewableEvent.type !== 'custom_event' &&
                          typeof viewableEvent.field_condition === 'object' &&
                          viewableEvent.field_condition?.name}
                      </p>
                    </div>
                  )}

                {window.getFlag('nfl-location-feed') &&
                  props.event.nfl_location_feed && (
                    <div css={styles.metaInfo}>
                      <h4>{props.t('Location')}</h4>
                      <p>{props.event.nfl_location_feed?.name}</p>
                    </div>
                  )}
              </>
            )}
            {viewableEvent.description && (
              <div css={styles.metaInfo}>
                <h4>{props.t('Description')}</h4>
                <p>{viewableEvent.description}</p>
              </div>
            )}
          </div>
        )}
        {window.getFlag('optimized-calendar') && (
          <p css={styles.squad}>{props.event.squad.name}</p>
        )}
        {window.getFlag('event-locations') &&
          viewableEvent.event_location &&
          renderEventLocation(viewableEvent.event_location)}
        {window.getFlag('event-attachments') && (
          <div data-testid="EventAttachments|AppHeader">
            {viewableEvent.attachments &&
              viewableEvent.attachments?.filter(
                (eventAttachment) =>
                  eventAttachment.attachment?.confirmed === true
              ).length > 0 &&
              viewableEvent.type !== 'custom_event' &&
              renderAttachments()}
            {!!viewableEvent.attached_links &&
              viewableEvent.attached_links.length > 0 &&
              renderLinks()}
          </div>
        )}
        {openDeletionMenu && renderDeleteModal()}
        {requestStatus === 'PENDING' && <AppStatus status="loading" />}
        {(requestStatus === 'FAILURE' ||
          eventCompleteRequestStatus === 'FAILURE') && (
          <AppStatus status="error" />
        )}
        <EventSidePanel
          isOpen={props.isEditModalOpen}
          panelType="SLIDING"
          panelMode="EDIT"
          planningEvent={props.event}
          eventConditions={props.eventConditions}
          canManageWorkload={props.canManageWorkload}
          redirectToEventOnClose={isVirtualEvent}
          onSaveEventSuccess={(updatedEvent) => {
            props.setIsEditModalOpen(false);
            props.onUpdateEvent(updatedEvent);
          }}
          onClose={() => {
            props.setIsEditModalOpen(false);
          }}
          onFileUploadStart={(fileId, fileName) =>
            props.toastAction({
              type: 'CREATE_TOAST',
              toast: {
                id: fileId,
                title: `Uploading ${fileName}`,
                status: 'LOADING',
              },
            })
          }
          onFileUploadSuccess={(fileName, fileId) =>
            props.toastAction({
              type: 'UPDATE_TOAST',
              toast: {
                id: fileId,
                title: `${fileName} uploaded successfully`,
                status: 'SUCCESS',
              },
            })
          }
          onFileUploadFailure={(fileName, fileId) =>
            props.toastAction({
              type: 'UPDATE_TOAST',
              toast: {
                id: fileId,
                title: `${fileName} upload failed`,
                status: 'ERROR',
              },
            })
          }
        />
        {window.getFlag('planning-game-events-tab-v-2') && (
          <AddAthletesSidePanel
            event={props.event}
            isOpen={isAddAthletesPanelOpen}
            onClose={() => setIsAddAthletesPanelOpen(false)}
            onSaveParticipantsSuccess={() => {
              props.onSaveParticipantsSuccess();
              setIsAddAthletesPanelOpen(false);
            }}
          />
        )}
      </header>
    </>
  );
};

export const AppHeaderTranslated = withNamespaces()(AppHeader);
export default AppHeader;
