// @flow
export type CalendarEventsPanelMode =
  | 'VIEW_TEMPLATES'
  | 'EDIT'
  | 'CREATE'
  | 'DUPLICATE';

export type CalendarEventConditions = {|
  surface_type?: ?{ id: number },
  surface_quality?: ?{ id: number },
  weather?: ?{ id: number },
  temperature?: ?string,
|};

export type CalendarCommonEventDetails = {|
  allDay?: boolean,
  background_color?: string,
  border_color?: string,
  text_color?: string,
  id?: string,
  calendarEventId?: string,
  name?: ?string,
  description?: ?string,
  duration?: number,
  local_timezone?: string,
  start_date?: string,
  templateId?: string,
  defaultDurationMins?: number,
  type: 'UNKNOWN',
  event_collection_complete?: boolean,
|};

export type GameEventDetails = {
  ...CalendarCommonEventDetails,
  ...CalendarEventConditions,
  type: 'game_event',
  organisation_team?: ?{ id: number, name?: string },
  opponent_team?: ?{
    id: number,
    name?: string,
  },
  opponent_squad?: ?{
    id: number,
    name?: string,
  },
  venue_type?: ?{
    id: number,
    name?: string,
  },
  competition?: ?{
    id: number,
    name?: string,
  },
  score?: string,
  opponent_score?: string,
  round_number?: string,
  number_of_periods?: ?number,
  workload_units?: ?Object,
  turnaround_prefix?: string,
  turnaround_fixture?: boolean,
};

export type TrainingSessionEventDetails = {
  ...CalendarCommonEventDetails,
  ...CalendarEventConditions,
  type: 'session_event',
  session_type?: ?{
    id: number,
    name?: string,
  },
  opponent_team?: ?{
    id: number,
    name?: string,
  },
  game_day_plus?: string,
  game_day_minus?: string,
  workload_type?: number,
  workload_units?: ?Object,
};

export type CalendarBaseEvent =
  | CalendarCommonEventDetails
  | GameEventDetails
  | TrainingSessionEventDetails;

export type EventCategory = {
  defaultDurationMins: number,
  defaultStartTime: string,
  displayName: ?string,
  events: Array<CalendarBaseEvent>,
  id: number,
};

export type EventGroup = {
  displayName: string,
  id: string,
  categories: Array<EventCategory>,
};

type closeCalendarEventsPanel = {
  type: 'CLOSE_CALENDAR_EVENTS_PANEL',
};

type openCalendarEventsPanel = {
  type: 'OPEN_CALENDAR_EVENTS_PANEL',
};

export type Action = closeCalendarEventsPanel | openCalendarEventsPanel;
