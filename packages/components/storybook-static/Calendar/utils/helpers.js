// @flow
import type { EventContentArg, EventImpl, EventUi } from '@fullcalendar/core';

import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { extraSmallIconSize } from '@kitman/playbook/icons/consts';
import {
  calendarEventTypeEnumLike,
  calendarViewOptionEnumLike,
} from './enum-likes';
import { getEventTextStyles } from './styles';
import type { CalendarViewOption } from './types';

export const getEventContent = (
  currentCalendarView: CalendarViewOption,
  { borderColor, backgroundColor, textColor, timeText, event }: EventContentArg
) => {
  const { title: eventTitle, url, extendedProps, id } = event;
  const eventRenderText = `${eventTitle} ${timeText}`;
  const eventTextStyles = getEventTextStyles({
    borderColor,
    backgroundColor,
    textColor,
  });

  const displayCompleteCheckBox =
    window.getFlag('event-collection-complete') &&
    (extendedProps?.type === calendarEventTypeEnumLike.TrainingSession ||
      extendedProps?.type === calendarEventTypeEnumLike.Game);

  const displayCheckBox = () => {
    if (extendedProps?.eventCollectionComplete) {
      return (
        <KitmanIcon
          name={KITMAN_ICON_NAMES.CheckBox}
          fontSize={extraSmallIconSize}
        />
      );
    }
    return (
      <KitmanIcon
        name={KITMAN_ICON_NAMES.CheckBoxOutlineBlank}
        fontSize={extraSmallIconSize}
      />
    );
  };

  switch (currentCalendarView) {
    case calendarViewOptionEnumLike.dayGridMonth: {
      return (
        <div style={eventTextStyles[calendarViewOptionEnumLike.dayGridMonth]}>
          {displayCompleteCheckBox && displayCheckBox()}
          {eventRenderText}
        </div>
      );
    }
    case calendarViewOptionEnumLike.listWeek: {
      return (
        <div style={eventTextStyles[calendarViewOptionEnumLike.listWeek]}>
          <a href={url}>{eventRenderText}</a>
        </div>
      );
    }
    default: {
      const { calendarHeader, title, time, ...rest } = eventTextStyles.default;
      return (
        <div style={rest}>
          <div style={calendarHeader}>
            {displayCompleteCheckBox && displayCheckBox()}
            <p style={title}>{eventTitle}</p>
          </div>
          <p style={time}>{timeText}</p>
          {/* Using `id` to make sure this is an existing event, not a new one */}
          {window.featureFlags['optimized-calendar'] && !!id && (
            <p style={time}>{extendedProps?.squad?.name}</p>
          )}
        </div>
      );
    }
  }
};

type SortEventInput = EventImpl & EventUi;

export const sortEvents = (
  firstEvent: SortEventInput,
  secondEvent: SortEventInput
) => {
  const isFirstEventGame = firstEvent.type === calendarEventTypeEnumLike.Game;
  const isSecondEventGame = secondEvent.type === calendarEventTypeEnumLike.Game;

  // games should come before other type of events
  // the earliest on top
  if (
    isFirstEventGame &&
    isSecondEventGame &&
    firstEvent.start < secondEvent.start
  ) {
    return -1;
  }
  if (
    isFirstEventGame &&
    isSecondEventGame &&
    firstEvent.start > secondEvent.start
  ) {
    return 1;
  }
  if (isFirstEventGame && !isSecondEventGame) {
    return -1;
  }
  // rest of events are handled in the second parameter of the eventOrder prop
  return 0;
};
