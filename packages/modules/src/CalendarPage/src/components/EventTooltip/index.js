// @flow
import type { EventImpl } from '@fullcalendar/core';
import { useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { RRule } from 'rrule';
import Tippy from '@tippyjs/react';
import moment from 'moment-timezone';

import { useGetActiveSquadQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { zIndices } from '@kitman/common/src/variables';
import { interpolateRRuleIntoDisplayableText } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/RepeatEventCustomConfigModal/utils/config-helpers';
import { calendarEventTypeEnumLike } from '@kitman/components/src/Calendar/utils/enum-likes';
import { TextButton, SegmentedControl } from '@kitman/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import type { Squad as ActiveSquad } from '@kitman/services/src/services/getActiveSquad';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';
import { type CustomEventPermissions } from '@kitman/modules/src/CalendarPage/src/types';
import { getEventTypeText } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';

import styling from './style';
import { repeatEventRecurrenceTestId } from './consts';
import hideOnEsc from './hideOnEsc';
import { createPlanningEventUrl } from './utils/helpers';

const noEventSquadId = -1;
const noUserCurrentSquadId = -2;

export type Props = {
  active: boolean,
  canCreateGames: boolean,
  canEditGames: boolean,
  canDeleteGames: boolean,
  isTrainingSessionsAdmin: boolean,
  customEventPermissions: CustomEventPermissions,
  currentUserId: number,
  calendarEvent: ?EventImpl,
  element: ?Element,
  onClickOutside: Function,
  onDeleteEvent: Function,
  onDuplicateEvent: Function,
  onEditEvent: Function,
  onEditNewEvent: Function,
  orgTimeZone: string,
};

const EventTooltip = (props: I18nProps<Props>) => {
  const [eventType, setEventType] = useState(null);
  const { isLeague } = useLeagueOperations();
  const { preferences } = usePreferences();
  const { permissions } = usePermissions();

  const calendarEventType = props.calendarEvent?.extendedProps?.type;

  const isCustomEvent =
    calendarEventType === calendarEventTypeEnumLike.CustomEvent;
  const isTrainingEvent =
    calendarEventType === calendarEventTypeEnumLike.TrainingSession;
  const isGamesEvent = calendarEventType === calendarEventTypeEnumLike.Game;
  const isTsoEvent = calendarEventType === calendarEventTypeEnumLike.Event;

  const isLeagueGameEvent =
    isGamesEvent && props.calendarEvent?.extendedProps?.leagueSetup;
  const canDeleteLeagueGameEvents = isLeague && isLeagueGameEvent;

  const checkBoxEventsColor = { color: props.calendarEvent?.backgroundColor };

  const locationAssign = useLocationAssign();

  const isDisabledForMatchDay =
    isGamesEvent &&
    props.calendarEvent?.extendedProps?.leagueSetup &&
    preferences?.league_game_schedule &&
    permissions?.leagueGame.manageGameTeam;

  const {
    data: userCurrentSquad,
    isSuccess: isSquadQuerySuccess,
  }: { data: ActiveSquad, isSuccess: boolean } = useGetActiveSquadQuery();

  useEffect(() => {
    setEventType(null);
  }, [props.active]);

  const style = styling(props);

  // if the user is NOT in the visibility array, they cannot view tooltip buttons for more info
  // UNLESS the array is empty, signaling EVERYONE can view the event
  const canViewCustomEvent =
    window.getFlag('custom-events') &&
    window.getFlag('staff-visibility-custom-events')
      ? !!(
          props.calendarEvent?.extendedProps?.visibilityIds?.includes(
            props.currentUserId
          ) ||
          props.calendarEvent?.extendedProps?.visibilityIds?.length === 0 ||
          props.customEventPermissions.isSuperAdmin
        )
      : true;

  const canCreateEvents =
    (props.canCreateGames && isGamesEvent) ||
    (props.isTrainingSessionsAdmin && isTrainingEvent);

  const canEditEvents =
    (props.canEditGames && isGamesEvent) ||
    (props.isTrainingSessionsAdmin && isTrainingEvent) ||
    (props.customEventPermissions.canEdit &&
      canViewCustomEvent &&
      isCustomEvent);

  const canDeleteGameEvents = isLeagueGameEvent
    ? canDeleteLeagueGameEvents
    : props.canDeleteGames && isGamesEvent;

  const canDeleteEvents =
    canDeleteGameEvents ||
    (props.isTrainingSessionsAdmin && isTrainingEvent) ||
    (props.customEventPermissions.canDelete &&
      canViewCustomEvent &&
      isCustomEvent);

  const canViewMoreDetails =
    isTrainingEvent || isGamesEvent || (canViewCustomEvent && isCustomEvent);

  const tooltipMode =
    calendarEventType === calendarEventTypeEnumLike.Unknown
      ? 'NEW_EVENT'
      : 'EXISTING_EVENT';

  const eventDate = `
  ${DateFormatter.formatStandard({
    date: moment(props.calendarEvent?.start),
    showCompleteDate: true,
    displayLongDate: true,
  })} - ${DateFormatter.formatJustTime(moment(props.calendarEvent?.end))}`;

  const eventSquadId = props.calendarEvent?.extendedProps?.squad
    ? props.calendarEvent.extendedProps.squad.id
    : noEventSquadId;

  const userCurrentSquadId =
    isSquadQuerySuccess && userCurrentSquad
      ? userCurrentSquad?.id
      : noUserCurrentSquadId;

  const isUserSquadDifferentFromEventSquad =
    eventSquadId !== userCurrentSquadId;

  const isVirtualSession =
    props.calendarEvent?.extendedProps?.isVirtualEvent &&
    calendarEventType === calendarEventTypeEnumLike.TrainingSession;
  const shouldShowDescription =
    props.calendarEvent?.extendedProps?.description &&
    (!isVirtualSession ||
      (isVirtualSession &&
        props.calendarEvent?.extendedProps?.recurrence?.preferences.some(
          (preference) => preference.perma_id === 'description'
        )));

  return (
    <Tippy
      plugins={[hideOnEsc]}
      offset={[0, -50]}
      maxWidth={400}
      content={
        <div css={style.eventTooltip}>
          <div css={style.header}>
            <div css={style.titleBlock}>
              {window.getFlag('event-collection-complete') &&
              (isTrainingEvent || isGamesEvent) ? (
                <>
                  {props.calendarEvent?.extendedProps
                    ?.eventCollectionComplete ? (
                    <KitmanIcon
                      name={KITMAN_ICON_NAMES.CheckBox}
                      sx={checkBoxEventsColor}
                    />
                  ) : (
                    <div
                      data-testid="emptyCheckBoxBlock"
                      css={[style.colorBlock, checkBoxEventsColor]}
                    />
                  )}
                </>
              ) : (
                <div css={style.colorBlock} />
              )}
              <h2 className="kitmanHeading--L2" css={style.titleText}>
                {props.calendarEvent?.title}
              </h2>
            </div>
            {window.getFlag('calendar-duplicate-event') &&
              canCreateEvents &&
              tooltipMode === 'EXISTING_EVENT' && (
                <TextButton
                  text={props.t('Duplicate')}
                  onClick={props.onDuplicateEvent}
                  type="subtle"
                  kitmanDesignSystem
                  isDisabled={!props.calendarEvent?.id}
                />
              )}
          </div>
          <div css={style.content}>
            {tooltipMode === 'NEW_EVENT' && (
              <div css={style.eventTypeSelection}>
                <SegmentedControl
                  width="inline"
                  buttons={[
                    {
                      name: props.t('Session'),
                      value: 'session_event',
                    },
                    ...(props.canCreateGames
                      ? [
                          {
                            name: props.t('Game'),
                            value: 'game_event',
                          },
                        ]
                      : []),
                    ...(props.customEventPermissions.canCreate
                      ? [{ name: props.t('Event'), value: 'custom_event' }]
                      : []),
                  ]}
                  selectedButton={eventType || undefined}
                  onClickButton={(value) => {
                    setEventType(value);
                    props.onEditNewEvent(value);
                  }}
                />
              </div>
            )}
            <div>{eventDate}</div>
            {tooltipMode === 'EXISTING_EVENT' &&
              getEventTypeText(props.calendarEvent)}
            {/* Squad will not exist in the extendedProps for new event */}
            {window.getFlag('optimized-calendar') &&
              props.calendarEvent?.extendedProps?.squad && (
                <p css={style.squad}>
                  {props.calendarEvent.extendedProps.squad.name}
                </p>
              )}

            {getIsRepeatEvent(props.calendarEvent?.extendedProps) && (
              <div css={style.iconContainer}>
                <KitmanIcon name={KITMAN_ICON_NAMES.SyncOutlined} />
                <p css={style.squad} data-testid={repeatEventRecurrenceTestId}>
                  {interpolateRRuleIntoDisplayableText(
                    RRule.fromString(
                      props.calendarEvent?.extendedProps?.recurrence.rule
                    ),
                    props.t,
                    moment.tz(
                      props.calendarEvent?.start,
                      props.calendarEvent?.local_timezone
                    )
                  )}
                </p>
              </div>
            )}

            {shouldShowDescription && (
              <div css={style.description}>
                {props.calendarEvent?.extendedProps.description}
              </div>
            )}
          </div>
          {window.getFlag('optimized-calendar') &&
          tooltipMode === 'EXISTING_EVENT' &&
          isUserSquadDifferentFromEventSquad ? (
            <p>
              {props.t(
                'To edit/view this event, please change to the relevant squad.'
              )}
            </p>
          ) : (
            <div css={style.footer}>
              <div css={style.buttonsLeft}>
                {canDeleteEvents && tooltipMode === 'EXISTING_EVENT' && (
                  <TextButton
                    text={props.t('Delete')}
                    onClick={props.onDeleteEvent}
                    type="destruct"
                    kitmanDesignSystem
                    isDisabled={!props.calendarEvent?.id}
                  />
                )}
              </div>
              <div css={style.buttonsRight}>
                {canEditEvents && tooltipMode === 'EXISTING_EVENT' && (
                  <TextButton
                    text={props.t('Edit')}
                    onClick={props.onEditEvent}
                    type="subtle"
                    kitmanDesignSystem
                    isDisabled={
                      !props.calendarEvent?.id ||
                      (isDisabledForMatchDay && !isLeague)
                    }
                  />
                )}
                {isTsoEvent && props.calendarEvent?.url && (
                  <TextButton
                    text={props.t('More details')}
                    onClick={() => {
                      locationAssign(
                        // $FlowFixMe[incompatible-type]
                        `/events_management?eventId=${props.calendarEvent?.id}`
                      );
                    }}
                    type="primary"
                    kitmanDesignSystem
                  />
                )}
                {[
                  tooltipMode === 'EXISTING_EVENT',
                  props.calendarEvent?.url,
                  !isTsoEvent,
                  canViewMoreDetails,
                ].every(Boolean) && (
                  <TextButton
                    text={props.t('More details')}
                    onClick={() => {
                      if (!props.calendarEvent) return;
                      window.open(
                        createPlanningEventUrl(props.calendarEvent),
                        '_self'
                      );
                    }}
                    type="primary"
                    kitmanDesignSystem
                  />
                )}
              </div>
            </div>
          )}
        </div>
      }
      theme="neutral-tooltip--kitmanDesignSystem"
      interactive
      appendTo={() => document.getElementsByClassName('fc-view-harness')[0]}
      reference={props.element}
      onClickOutside={props.onClickOutside}
      visible={props.active}
      zIndex={zIndices.calendarEventTooltip}
    />
  );
};

export const EventTooltipTranslated = withNamespaces()(EventTooltip);
export default EventTooltip;
