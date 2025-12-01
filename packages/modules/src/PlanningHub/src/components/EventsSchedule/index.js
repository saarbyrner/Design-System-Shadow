// @flow
import { useEffect, useMemo, useState } from 'react';
import _groupBy from 'lodash/groupBy';
import { withNamespaces } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment-timezone';
import { RRule } from 'rrule';
import classNames from 'classnames';

import { AppStatus, Link } from '@kitman/components';
import { colors } from '@kitman/common/src/variables';
import {
  formatGameDayPlusMinus,
  getEventName,
} from '@kitman/common/src/utils/workload';
import { interpolateRRuleIntoDisplayableText } from '@kitman/modules/src/PlanningEventSidePanel/src/components/common/RepeatEvent/RepeatEventCustomConfigModal/utils/config-helpers';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import { Chip, CircularProgress } from '@kitman/playbook/components';
import type { EventFilters } from '@kitman/modules/src/PlanningHub/types';
import { getFormattedStartTime } from '@kitman/modules/src/shared/FixtureScheduleView/helpers';
import getEvents from '@kitman/modules/src/PlanningHub/src/services/getEvents';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { useBrowserTabTitle } from '@kitman/common/src/hooks';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getIsRepeatEvent } from '@kitman/common/src/utils/events';
import { createPlanningEventUrl } from '@kitman/modules/src/CalendarPage/src/components/EventTooltip/utils/helpers';

import { getEventsWithRecurringEvents } from './utils';

import style from './style';

type Props = I18nProps<{
  eventFilters: EventFilters,
  orgTimezone: string,
}>;

const EventsSchedule = (props: Props) => {
  useBrowserTabTitle(props.t('Planning'));

  const [events, setEvents] = useState([]);
  const [nextId, setNextId] = useState(null);
  const [requestStatus, setRequestStatus] = useState('LOADING');

  const oneMLSEventExists = events.some((event: Object) => event?.mls_game_key);

  const getNextEvents = ({ resetList = false } = {}) => {
    setRequestStatus('LOADING');

    getEvents(props.eventFilters, nextId).then(
      (data) => {
        setEvents((prevEvents) =>
          resetList
            ? getEventsWithRecurringEvents(data.events)
            : [...prevEvents, ...getEventsWithRecurringEvents(data.events)]
        );
        setNextId(data.next_id);
        if (!data.next_id) {
          setRequestStatus('FULLY_LOADED');
        }
      },
      () => setRequestStatus('FAILURE')
    );
  };

  // Refetch the events when the filters are updated
  useEffect(() => {
    setEvents([]);
    setNextId(null);
    getNextEvents({ resetList: true });
  }, [props.eventFilters]);

  const formatDate = (date: typeof moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatStandard({ date });
    }

    return date.format('D MMM, ddd');
  };

  const eventsGroupedByDate = useMemo(
    () =>
      _groupBy(events, (event) =>
        formatDate(moment(event.start_date).tz(props.orgTimezone))
      ),
    [events]
  );

  const formatTime = (date: moment): string => {
    if (window.featureFlags['standard-date-formatting']) {
      return DateFormatter.formatJustTime(date);
    }

    return date.format('h:mm a');
  };

  const getEventTime = (event) => {
    if (event.mls_game_key) {
      return <div>{getFormattedStartTime(event)}</div>;
    }
    const orgTimezoneStartTime = formatTime(
      moment(event.start_date).tz(props.orgTimezone)
    );
    const localTimezoneStartTime = formatTime(
      moment(event.start_date).tz(event.local_timezone)
    );

    const orgTimezoneEndTime = formatTime(
      moment(event.end_date).tz(props.orgTimezone)
    );
    const localTimezoneEndTime = formatTime(
      moment(event.end_date).tz(event.local_timezone)
    );

    return (
      <>
        <div>
          {orgTimezoneStartTime} - {orgTimezoneEndTime}
        </div>
        {event.local_timezone !== props.orgTimezone && (
          <div className="planningEventsSchedule__eventLocalTime">
            ({localTimezoneStartTime} - {localTimezoneEndTime}{' '}
            {event.local_timezone})
          </div>
        )}
      </>
    );
  };

  return (
    <div
      id="planningEventsScheduleScrollableContent"
      className="planningEventsSchedule"
    >
      <InfiniteScroll
        dataLength={events.length}
        next={() => getNextEvents()}
        hasMore={requestStatus === 'LOADING'}
        loader={
          <div
            className="planningEventsSchedule__loadingText"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '12px 0',
            }}
          >
            <CircularProgress
              size={20}
              thickness={5}
              aria-label={props.t('Loading')}
            />
            <span>{props.t('Loading')}…</span>
          </div>
        }
      >
        {events.length > 0 && (
          <div className="planningEventsSchedule__tableWrapper">
            <table className="planningEventsSchedule__table">
              <tbody>
                {Object.entries(eventsGroupedByDate).map(
                  ([date, dateEvents]) => {
                    if (!Array.isArray(dateEvents)) return null;

                    return dateEvents.map((event: Object, index) => {
                      const firstEvent = (dateEvents[0]: Object);
                      return (
                        <tr
                          data-testid="planningEventsSchedule__row"
                          className={classNames('planningEventsSchedule__row', {
                            'planningEventsSchedule__row--first': index === 0,
                            'planningEventsSchedule__row--today': moment(
                              firstEvent.start_date
                            ).isSame(moment(), 'day'),
                            'planningEventsSchedule__row--past': moment(
                              firstEvent.start_date
                            ).isBefore(moment(), 'day'),
                          })}
                          key={event.reactKey}
                        >
                          {index === 0 && (
                            <th rowSpan={dateEvents.length}>
                              <div className="planningEventsSchedule__date">
                                {date}
                              </div>
                            </th>
                          )}
                          <td className="planningEventsSchedule__eventTime">
                            {getEventTime(event)}
                          </td>
                          <td className="planningEventsSchedule__eventDuration">
                            {event.duration && `${event.duration} mins`}
                          </td>
                          <td className="planningEventsSchedule__eventGameDay">
                            {formatGameDayPlusMinus(event)}
                          </td>
                          <td className="planningEventsSchedule__eventCompetition">
                            {event.competition ? event.competition.name : null}
                          </td>
                          {window.getFlag('event-collection-complete') && (
                            <td className="planningEventsSchedule__eventCompletion">
                              {event.event_collection_complete && (
                                <Chip
                                  label={props.t('Complete')}
                                  icon={
                                    <KitmanIcon
                                      name={KITMAN_ICON_NAMES.CheckCircle}
                                    />
                                  }
                                  color="success"
                                  size="small"
                                />
                              )}
                            </td>
                          )}
                          {oneMLSEventExists && (
                            <td className="planningEventsSchedule__eventMLSInfo">
                              {event?.mls_game_key
                                ? event?.mls_game_key?.split('-')[1]
                                : ''}
                            </td>
                          )}
                          {Number.isInteger(event.id) && (
                            <td className="event-name-cell">
                              <div
                                className="planningEventsSchedule__eventColour"
                                style={{
                                  backgroundColor: event.background_color,
                                  border:
                                    event.background_color === '#FFFFFF'
                                      ? `solid 1px ${colors.s17}`
                                      : null,
                                }}
                              />
                              <Link
                                href={createPlanningEventUrl({
                                  id: event.reactKey ?? event.id,
                                  start: event.start_date,
                                  url: `/planning_hub/events/${event.id}`,
                                  extendedProps: { type: event.type },
                                  openEventSwitcherSidePanel: false,
                                })}
                                className="planningEventsSchedule__eventName"
                              >
                                {getEventName(event)}
                              </Link>
                            </td>
                          )}
                          <td>
                            {getIsRepeatEvent(event) && (
                              <>
                                <KitmanIcon
                                  name={KITMAN_ICON_NAMES.SyncOutlined}
                                  fontSize="small"
                                  sx={style.repeatedEventIcon}
                                />
                                <span css={style.repeatedEventInfo}>
                                  {interpolateRRuleIntoDisplayableText(
                                    RRule.fromString(event.recurrence.rule),
                                    props.t,
                                    moment.tz(
                                      event.start_date,
                                      event.local_timezone
                                    )
                                  )}
                                </span>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    });
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </InfiniteScroll>

      {requestStatus === 'FULLY_LOADED' && events.length === 0 && (
        <div className="planningEventsSchedule__noEventText">
          {props.t('No events scheduled for this period')}
        </div>
      )}

      {requestStatus === 'FAILURE' && <AppStatus status="error" />}
    </div>
  );
};

export const EventsScheduleTranslated = withNamespaces()(EventsSchedule);
export default EventsSchedule;
