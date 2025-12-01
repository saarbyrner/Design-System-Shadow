import moment from 'moment-timezone';
import { colors } from '@kitman/common/src/variables';
import {
  convertFullCalEvent,
  defaultBackgroundColor,
  defaultBorderColor,
  defaultTextColor,
  convertPlanningEventsToCalendarEvents,
  convertTSOEventsToCalendarEvents,
  eventFormDataToCalendarBaseEvent,
  getDateWithCurrentTime,
  getEventTypeText,
  emptyRecurrence,
} from '../utils/eventUtils';

describe('Calendar Page Event Utils', () => {
  const commonDetails = {
    title: 'Test Title',
    duration: 60,
    id: '123456',
    description: 'Test description',
    local_timezone: 'Europe/Dublin',
    start_time: '2023-08-09T16:36:20Z',
    background_color: colors.white,
    border_color: colors.white,
    text_color: colors.white,
    start_date: '2021-07-12T09:30:00+00:00',
  };

  beforeEach(() => {
    const fakeTime = new Date('2022-06-10T09:12:00Z'); // UTC FORMAT
    jest.useFakeTimers();
    jest.setSystemTime(fakeTime);
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.useRealTimers();
  });

  it('returns correct event type name for all event types', () => {
    expect(getEventTypeText({ type: 'CUSTOM_EVENT' })).toBe('Event');
    expect(getEventTypeText({ type: 'GAME' })).toBe('Game');
    expect(getEventTypeText({ type: 'TRAINING_SESSION' })).toBe(
      'Training Session'
    );
    expect(getEventTypeText({ type: 'EVENT' })).toBe('Event');
  });

  it('can apply the current time to a date string', () => {
    const result = getDateWithCurrentTime('2021-07-12T10:00:16+00:00', false);
    expect(result).toBe('2021-07-12T09:12:00+00:00');

    const roundedResult = getDateWithCurrentTime('2021-07-12T10:00:16+00:00');
    expect(roundedResult).toBe('2021-07-12T09:10:00+00:00');
  });

  it('can convert EventInput to CalendarBaseEvent', () => {
    const fullCalEvent = {
      allDay: false,
      title: 'Test event',
      extendedProps: {
        type: 'game_event',
        templateId: 'template_01',
        allDay: false,
        defaultStartTime: '09:30:00',
        defaultDurationMins: 30,
      },
      start: new Date('2021-07-12T10:00:16.000Z'),
      end: new Date('2021-07-12T10:30:16.000Z'),
    };

    const expectedEvent = {
      allDay: false,
      background_color: defaultBackgroundColor,
      border_color: defaultBorderColor,
      calendarEventId: undefined,
      defaultDurationMins: 30,
      defaultStartTime: '09:30:00',
      duration: 30,
      local_timezone: 'Europe/Dublin',
      name: 'Test event',
      templateId: 'template_01',
      start_date: '2021-07-12T10:00:16+00:00',
      text_color: defaultTextColor,
      type: 'game_event',
    };

    const convertedEvent = convertFullCalEvent(fullCalEvent, 'Europe/Dublin');
    expect(convertedEvent).toEqual(expectedEvent);
  });

  it('can convert SelectionInfo to CalendarBaseEvent', () => {
    const start = new Date('2022-01-21T09:11:46Z');
    const end = new Date('2022-01-21T10:11:46Z');
    const selectionInfo = {
      start,
      end,
      startStr: start.toISOString(),
      endStr: end.toISOString(),
      allDay: false,
    };

    const expectedEvent = {
      allDay: false,
      background_color: defaultBackgroundColor,
      border_color: defaultBorderColor,
      calendarEventId: undefined,
      duration: 60,
      local_timezone: 'Europe/Dublin',
      name: 'New event',
      start_date: '2022-01-21T09:11:46+00:00',
      text_color: defaultTextColor,
      type: 'UNKNOWN',
    };

    const convertedEvent = convertFullCalEvent(selectionInfo, 'Europe/Dublin');
    expect(convertedEvent).toEqual(expectedEvent);
  });

  it('converts event maintaining colours if set', () => {
    const fullCalEvent = {
      allDay: false,
      title: 'Test event',
      extendedProps: {
        type: 'game_event',
        templateId: 'template_01',
        allDay: false,
        defaultStartTime: '09:30:00',
        defaultDurationMins: 30,
      },
      start: new Date('2021-07-12T10:00:16.000Z'),
      end: new Date('2021-07-12T10:30:16.000Z'),
      backgroundColor: colors.white,
      borderColor: colors.green_200,
      textColor: colors.blue_100,
      id: '100',
    };

    const expectedEvent = {
      allDay: false,
      background_color: colors.white,
      border_color: colors.green_200,
      calendarEventId: '100',
      defaultDurationMins: 30,
      defaultStartTime: '09:30:00',
      duration: 30,
      type: 'game_event',
      local_timezone: 'Europe/Dublin',
      name: 'Test event',
      start_date: '2021-07-12T10:00:16+00:00',
      templateId: 'template_01',
      text_color: colors.blue_100,
    };

    const convertedEvent = convertFullCalEvent(fullCalEvent, 'Europe/Dublin');
    expect(convertedEvent).toEqual(expectedEvent);
  });

  it('uses a default starting time and applies duration when required', () => {
    const fullCalEvent = {
      allDay: true,
      title: 'Test event',
      extendedProps: {
        type: 'game_event',
        templateId: 'template_01',
        allDay: false,
        defaultStartTime: '09:30:00',
        defaultDurationMins: 20,
      },
      start: new Date('2021-07-12'),
    };

    const expectedEvent = {
      allDay: false,
      background_color: defaultBackgroundColor,
      border_color: defaultBorderColor,
      calendarEventId: undefined,
      defaultDurationMins: 20,
      defaultStartTime: '09:30:00',
      duration: 20,
      start_date: '2021-07-12T09:30:00+00:00',
      local_timezone: 'Europe/Dublin',
      name: 'Test event',
      templateId: 'template_01',
      text_color: defaultTextColor,
      type: 'game_event',
    };

    const convertedEvent = convertFullCalEvent(fullCalEvent, 'Europe/Dublin');
    expect(convertedEvent).toEqual(expectedEvent);
  });

  it('can convert from a Training Session Planning Event to a Calendar Event', () => {
    const inputEvents = [
      {
        id: '5',
        type: 'session_event',
        background_color: colors.white,
        start_date: '2021-07-12T09:30:00+00:00',
        duration: 20,
        session_type: { name: 'Session Name' },
      },
    ];

    const output = [
      {
        backgroundColor: colors.white,
        borderColor: colors.white,
        editable: false,
        end: '2021-07-12T09:50:00.000Z',
        textColor: colors.grey_100,
        id: '5',
        incompleteEvent: false,
        start: '2021-07-12T09:30:00.000Z',
        type: 'TRAINING_SESSION',
        title: 'Session Name',
        url: '/planning_hub/events/5',
        description: null,
        recurrence: { ...emptyRecurrence },
      },
    ];

    const conversion = convertPlanningEventsToCalendarEvents(inputEvents);
    expect(conversion).toEqual(output);
  });

  it('can convert from a Game Planning Event to a Calendar Event', () => {
    const inputEvents = [
      {
        id: '5',
        type: 'game_event',
        background_color: colors.white,
        start_date: '2021-07-12T09:30:00+00:00',
        duration: 20,
        opponent_team: { name: 'Game Name' },
      },
    ];

    const output = [
      {
        backgroundColor: colors.white,
        borderColor: colors.white,
        textColor: colors.grey_100,
        editable: false,
        id: '5',
        start: '2021-07-12T09:30:00.000Z',
        end: '2021-07-12T09:50:00.000Z',
        type: 'GAME',
        title: 'Game Name',
        url: '/planning_hub/events/5',
        incompleteEvent: false,
        description: null,
        recurrence: { ...emptyRecurrence },
      },
    ];

    const conversion = convertPlanningEventsToCalendarEvents(inputEvents);
    expect(conversion).toEqual(output);
  });

  it('can convert from a Custom Planning Event to a Calendar Event', () => {
    const inputEvents = [
      {
        ...commonDetails,
        type: 'custom_event',
        custom_event_type: { name: 'Test Custom Type' },
      },
    ];

    const output = [
      {
        backgroundColor: commonDetails.background_color,
        borderColor: commonDetails.border_color,
        textColor: commonDetails.text_color,
        editable: false,
        id: commonDetails.id,
        start: '2021-07-12T09:30:00.000Z',
        end: '2021-07-12T10:30:00.000Z',
        type: 'CUSTOM_EVENT',
        title: inputEvents[0].custom_event_type.name,
        url: `/planning_hub/events/${commonDetails.id}`,
        incompleteEvent: false,
        description: commonDetails.description,
        recurrence: { ...emptyRecurrence },
      },
    ];

    const conversion = convertPlanningEventsToCalendarEvents(inputEvents);
    expect(conversion).toEqual(output);
  });

  it('can convert from CustomEventFormData to CalendarBaseEvent', () => {
    const inputEvent = {
      ...commonDetails,
      type: 'custom_event',
      custom_event_type: {
        id: 11,
        name: 'Monthly Catchup',
        organisation_id: 6,
      },
      athlete_ids: [1, 2, 3],
      attached_links: [
        {
          id: 5,
          event_attachment_categories: [{ id: 23, name: 'Player Profile' }],
          created_at: '2023-08-22T18:00:07+01:00',
          updated_at: '2023-08-22T18:00:07+01:00',
          attached_link: {},
        },
      ],
      attachments: [],
      user_ids: [87, 65],
    };

    const actualResult = eventFormDataToCalendarBaseEvent(inputEvent);
    const { title, ...expectedDetails } = inputEvent;
    const output = { ...expectedDetails, name: commonDetails.title };

    expect(actualResult).toEqual(output);
  });

  it('can convert from a Game EventFormData to a CalendarBaseEvent', () => {
    const inputEvent = {
      allDay: false,
      background_color: colors.white,
      border_color: colors.white,
      competition_id: 4,
      description: 'Test description',
      duration: 20,
      local_timezone: 'Europe/Dublin',
      name: 'Dublin Game',
      opponent_score: 9,
      organisation_team_id: 2,
      id: 5,
      score: 8,
      start_date: '2021-07-12T09:30:00+00:00',
      surface_quality: 6,
      surface_type: 7,
      team_id: 79,
      temperature: '-10',
      type: 'game_event',
      venue_type_id: 1,
      weather: 5,
    };

    const output = {
      allDay: false,
      background_color: colors.white,
      border_color: colors.white,
      competition: { id: 4 },
      description: 'Test description',
      duration: 20,
      id: '5',
      local_timezone: 'Europe/Dublin',
      name: 'Dublin Game',
      opponent_score: 9,
      opponent_team: { id: 79 },
      organisation_team: { id: 2 },
      score: 8,
      start_date: '2021-07-12T09:30:00+00:00',
      surface_quality: { id: 6 },
      surface_type: { id: 7 },
      temperature: '-10',
      type: 'game_event',
      venue_type: { id: 1 },
      weather: { id: 5 },
    };
    const conversion = eventFormDataToCalendarBaseEvent(inputEvent);
    expect(conversion).toEqual(output);
  });

  it('can convert from a Training Session EventFormData to a CalendarBaseEvent', () => {
    const inputEvent = {
      allDay: false,
      background_color: colors.white,
      description: 'Test description',
      duration: 20,
      id: 5,
      local_timezone: 'Europe/Dublin',
      team_id: 7,
      title: 'Override name',
      surface_type: 7,
      surface_quality: 6,
      temperature: '-10',
      weather: 5,
      session_type_id: 1,
      session_type: { isJointPractice: true },
      season_type_id: 1,
      start_date: '2021-07-12T09:30:00+00:00',
      type: 'session_event',
      workload_type: 1,
      workload_units: { id: 'something' },
    };

    const output = {
      allDay: false,
      background_color: colors.white,
      description: 'Test description',
      duration: 20,
      id: '5',
      local_timezone: 'Europe/Dublin',
      name: 'Override name',
      surface_type: { id: 7 },
      surface_quality: { id: 6 },
      temperature: '-10',
      weather: { id: 5 },
      session_type: { id: 1, isJointPractice: true },
      season_type: { id: 1 },
      start_date: '2021-07-12T09:30:00+00:00',
      type: 'session_event',
      workload_type: 1,
      workload_units: { id: 'something' },
      opponent_team: { id: 7 },
    };

    const conversion = eventFormDataToCalendarBaseEvent(inputEvent);
    expect(conversion).toEqual(output);
  });

  it('can spreads the session type correctly', () => {
    const falseJointSessionInput = {
      team_id: null,
      title: 'New Title',
      duration: 20,
      season_type_id: 1,
      start_date: '2021-07-12T09:30:00+00:00',
      type: 'session_event',
      workload_type: 1,
      session_type_id: 1,
      session_type: { isJointPractice: false },
    };

    const falseJointSessionOutput = {
      opponent_team: null,
      name: 'New Title',
      duration: 20,
      season_type: { id: 1 },
      start_date: '2021-07-12T09:30:00+00:00',
      type: 'session_event',
      workload_type: 1,
      session_type: { id: 1, isJointPractice: false },
      weather: null,
      surface_type: null,
      surface_quality: null,
    };

    expect(eventFormDataToCalendarBaseEvent(falseJointSessionInput)).toEqual(
      falseJointSessionOutput
    );
  });

  it('can convert team id field correctly for a Training Session EventFormData to a CalendarBaseEvent', () => {
    const teamIdNullInput = {
      team_id: null,
      title: 'New Title',
      duration: 20,
      season_type_id: 1,
      start_date: '2021-07-12T09:30:00+00:00',
      type: 'session_event',
      workload_type: 1,
      session_type_id: 1,
      session_type: { isJointPractice: false },
    };

    const teamIdNullOutput = {
      opponent_team: null,
      name: 'New Title',
      duration: 20,
      season_type: { id: 1 },
      start_date: '2021-07-12T09:30:00+00:00',
      type: 'session_event',
      workload_type: 1,
      session_type: { id: 1, isJointPractice: false },
      weather: null,
      surface_type: null,
      surface_quality: null,
    };

    expect(eventFormDataToCalendarBaseEvent(teamIdNullInput)).toEqual(
      teamIdNullOutput
    );
  });

  it('can convert from a TSO Event to a Calendar Event', () => {
    const mockTSOEvent = [
      {
        Id: 2356,
        KitmanTeamId: 123,
        StartDate: '2023-05-21T09:30:00Z',
        EndDate: '2023-05-21T13:30:00Z',
        Name: 'U14 Albert Phelan Cup Final 2022/23',
        Description:
          'U14 Albert Phelan Cup Final 2022/23\r\nManchester United U14 v Chelsea U14\r\nSunday 21 May 2023\r\n12pm KO\r\nBurton Albion FC, Pirelli Stadium',
        Team: {
          Id: 1000000,
          Name: 'Premier League Pool',
          Order: 1,
          ClubId: 100,
          Club: null,
          OptaTeamId: null,
          IsFirstTeam: true,
          TeamType: 0,
          IsHiddenFromClub: false,
        },
        IsShared: true,
      },
    ];

    const mockMappedEvent = [
      {
        id: '2356',
        start: '2023-05-21T09:30:00Z',
        end: '2023-05-21T13:30:00Z',
        title: 'U14 Albert Phelan Cup Final 2022/23',
        description:
          'U14 Albert Phelan Cup Final 2022/23\r\nManchester United U14 v Chelsea U14\r\nSunday 21 May 2023\r\n12pm KO\r\nBurton Albion FC, Pirelli Stadium',
        url: '/events_management',
        type: 'EVENT',
        backgroundColor: colors.teal_300,
        borderColor: colors.teal_300,
        allDay: false,
        recurrence: { ...emptyRecurrence },
        squad: {
          id: 123,
          name: '',
        },
      },
    ];

    const conversion = convertTSOEventsToCalendarEvents(mockTSOEvent);
    expect(conversion).toEqual(mockMappedEvent);
  });

  it('should correctly identify that a TSO event is allDay', () => {
    const mockTSOEvent = [
      {
        Id: 2356,
        StartDate: '2023-05-21T00:00:00Z',
        EndDate: '2023-06-21T00:00:00Z',
        Name: 'U14 Albert Phelan Cup Final 2022/23',
        Description:
          'U14 Albert Phelan Cup Final 2022/23\r\nManchester United U14 v Chelsea U14\r\nSunday 21 May 2023\r\n12pm KO\r\nBurton Albion FC, Pirelli Stadium',
        Team: {
          Id: 1000000,
          Name: 'Premier League Pool',
          Order: 1,
          ClubId: 100,
          Club: null,
          OptaTeamId: null,
          IsFirstTeam: true,
          TeamType: 0,
          IsHiddenFromClub: false,
        },
        IsShared: true,
      },
    ];

    const conversion = convertTSOEventsToCalendarEvents(mockTSOEvent);
    expect(conversion[0].allDay).toBe(true);
  });
});
