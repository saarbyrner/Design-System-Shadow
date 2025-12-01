// @flow
import { useMemo, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import moment from 'moment-timezone';
import type { RRule } from 'rrule';

import { InputText, Checkbox } from '@kitman/components';
import useDebouncedCallback from '@kitman/common/src/hooks/useDebouncedCallback';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { StatusChangedCallback } from '@kitman/components/src/Select/hoc/withServiceSuppliedOptions';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  getIsRepeatableEvent,
  getIsRepeatEvent,
} from '@kitman/common/src/utils/events';
import { type RecurrencePreferencesOptions } from '@kitman/services/src/services/planning/getRecurrencePreferences';
import style from '@kitman/modules/src/PlanningEventSidePanel/src/style';
import {
  type EditEventPanelMode,
  type CommonAttributesValidity,
  type EventFormData,
  type OnUpdateEventStartTime,
  type OnUpdateEventDuration,
  type OnUpdateEventDate,
  type OnUpdateEventTimezone,
  type OnUpdateEventTitle,
  type OnUpdateEventDetails,
} from '@kitman/modules/src/PlanningEventSidePanel/src/types';

import { EventDateTimeTranslated as EventDateTime } from '../EventDateTime';
import { RepeatEventSelectTranslated as RepeatEventSelect } from './RepeatEvent/RepeatEventSelect';
import { LocationSelectTranslated as LocationSelection } from './LocationSelect/LocationSelect';
import Attendance from './Attendance/Attendance';

export type Props = {
  panelMode: EditEventPanelMode,
  event: EventFormData,
  eventValidity: CommonAttributesValidity,
  allowEditTitle?: boolean,
  onUpdateEventStartTime: OnUpdateEventStartTime,
  onUpdateEventDuration: OnUpdateEventDuration,
  onUpdateEventDate: OnUpdateEventDate,
  onUpdateEventTimezone: OnUpdateEventTimezone,
  onUpdateEventTitle: OnUpdateEventTitle,
  onUpdateEventDetails: OnUpdateEventDetails,
  onDataLoadingStatusChanged: StatusChangedCallback,
};

export const Separator = ({
  shouldRender = true,
}: {
  shouldRender?: boolean,
}) => Boolean(shouldRender) && <div css={style.separator} />;

const CommonFields = (props: I18nProps<Props>) => {
  const eventDate: typeof moment = useMemo(
    () => moment.tz(props.event.start_time, props.event.local_timezone),
    [props.event.start_time, props.event.local_timezone]
  );

  const updateEventTitle = useDebouncedCallback((value: string) => {
    if (value !== props.event.title) {
      props.onUpdateEventTitle(value, true);
    }
  }, 50);

  const isRepeatableEvent = getIsRepeatableEvent(props.event.type);
  const shouldDisplayRepeatEvents = getIsRepeatEvent(props.event, false);

  // This planning FF below shows a separate location selector on sessions and
  // games, so even if the event locations FF is on, we need to hide it for all
  // other sessions and games, we still want the global location select to show
  const isNFLSessionOrGame =
    window.getFlag('planning-custom-org-event-details') && !isRepeatableEvent;

  return (
    <>
      {window.getFlag('planning-show-event-title-in-creation-and-edit') &&
        props.allowEditTitle && (
          <div css={style.fullWidthRow}>
            <InputText
              label={props.t('Title')}
              onValidation={({ value }) => updateEventTitle(value)}
              value={props.event.title || ''}
              showRemainingChars={false}
              showCharsLimitReached={false}
              maxLength={255}
              kitmanDesignSystem
              data-testid="CommonFields|Title"
              invalid={props.eventValidity.title?.isInvalid}
            />
          </div>
        )}

      <div css={style.fullWidthRow}>
        <EventDateTime
          eventValidity={props.eventValidity}
          eventDate={eventDate}
          duration={props.event.duration}
          timeZone={props.event.local_timezone}
          onSelectDate={(date) => {
            props.onUpdateEventDate(
              moment(date).format(DateFormatter.dateTransferFormat)
            );
          }}
          onUpdateStartTime={(value) => {
            props.onUpdateEventStartTime(
              value.format(DateFormatter.dateTransferFormat)
            );
          }}
          onUpdateDuration={(value) => {
            props.onUpdateEventDuration(value);
          }}
          onSelectTimezone={(value) => {
            props.onUpdateEventTimezone(value);
          }}
          data-testid="CommonFields|EventDateTime"
          disableDateTimeEdit={
            props.panelMode === 'EDIT' && !props.event.editable
          }
        />
      </div>

      {props.panelMode === 'CREATE' &&
        props.event.type === 'session_event' &&
        window.getFlag('create-session-no-participants') &&
        window.getFlag('planning-dual-write') &&
        window.getFlag(
          'full-participation-by-default-on-creation-of-sessions'
        ) &&
        !window.getFlag(
          'pac-event-sidepanel-sessions-games-show-athlete-dropdown'
        ) && (
          <div css={style.fullWidthRow}>
            <Checkbox
              name="noParticipants"
              id="noParticipants"
              label={props.t('Create with no participants')}
              isChecked={props.event.no_participants || false}
              kitmanDesignSystem
              toggle={({ checked }) => {
                props.onUpdateEventDetails({
                  no_participants: checked,
                });
              }}
              data-testid="SessionLayout|NoParticipants"
            />
          </div>
        )}

      {shouldDisplayRepeatEvents && (
        <div css={style.fullWidthRow}>
          <RepeatEventSelect
            eventDate={eventDate}
            onChange={(selectedRule: RRule) =>
              props.onUpdateEventDetails({
                recurrence: {
                  // This logic will only hit for custom_event or session_event
                  // $FlowIgnore[prop-missing]
                  ...(isRepeatableEvent && props.event.recurrence),
                  rule: selectedRule,
                },
              })
            }
            updateRecurrencePreferences={(
              recurrencePreferences: RecurrencePreferencesOptions | null | void
            ) =>
              props.onUpdateEventDetails({
                recurrence: {
                  // This logic will only hit for custom_event or session_event
                  // $FlowIgnore[prop-missing]
                  ...(isRepeatableEvent && props.event.recurrence),
                  preferences: recurrencePreferences,
                },
              })
            }
            // This logic will only hit for custom_event or session_event
            // $FlowIgnore[prop-missing]
            value={isRepeatableEvent && props.event.recurrence?.rule}
            selectedRecurrencePreferences={
              // This logic will only hit for custom_event or session_event
              // $FlowIgnore[prop-missing]
              props.event.recurrence?.preferences
            }
            eventType={props.event.type}
            // This logic will only hit for custom_event or session_event
            // $FlowIgnore[prop-missing]
            isParentEvent={!props.event.recurrence?.recurring_event_id}
            hasAthletes={
              Array.isArray(props.event.athlete_ids)
                ? props.event.athlete_ids.length > 0
                : false
            }
            panelMode={props.panelMode}
          />
        </div>
      )}

      {window.featureFlags['event-locations'] && !isNFLSessionOrGame && (
        <div css={style.fullWidthRow}>
          <LocationSelection
            event={props.event}
            onUpdateEventDetails={props.onUpdateEventDetails}
            eventValidity={props.eventValidity}
            onDataLoadingStatusChanged={props.onDataLoadingStatusChanged}
          />
        </div>
      )}

      {
        // Custom logic required for custom events, controlled in CustomEventLayout.js
        props.event.type !== 'custom_event' && (
          <div css={style.fullWidthRow}>
            <Separator
              shouldRender={window.getFlag(
                'pac-event-sidepanel-sessions-games-show-athlete-dropdown'
              )}
            />
            <Attendance
              onUpdateEventDetails={props.onUpdateEventDetails}
              event={props.event}
              eventValidity={props.eventValidity}
            />
            <Separator
              shouldRender={window.getFlag(
                'pac-event-sidepanel-sessions-games-show-athlete-dropdown'
              )}
            />
          </div>
        )
      }
    </>
  );
};

export const CommonFieldsTranslated: ComponentType<Props> =
  withNamespaces()(CommonFields);
export default CommonFields;
