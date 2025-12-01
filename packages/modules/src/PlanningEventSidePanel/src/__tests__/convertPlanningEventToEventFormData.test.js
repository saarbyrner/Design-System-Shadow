import { RRule } from 'rrule';

import { sessionThemeOptionTypes } from '@kitman/common/src/types/Event';
import { emptyRecurrence } from '@kitman/modules/src/CalendarPage/src/utils/eventUtils';

import {
  calculateStaffVisibilityValue,
  getAreArraysEqual,
  convertPlanningEventToEventFormData,
  getOrganisationFormatId,
  getFieldCondition,
} from '../convertPlanningEventToEventFormData';
import { StaffVisibilityOptions } from '../components/custom/utils';
import { LOCAL_CUSTOM_OPPOSITION_OPTION_ID } from '../components/gameLayoutV2/gameFieldsUtils';

describe('convertPlanningEventToEventFormData', () => {
  describe('getAreArraysEqual()', () => {
    it('returns true when arrays are in the same order', () => {
      const firstArray = [1, 2, 3, 4];
      const secondArray = [1, 2, 3, 4];
      const result = getAreArraysEqual(firstArray, secondArray);
      expect(result).toEqual(true);
    });

    it('returns true when arrays are not in the same order', () => {
      const firstArray = [1, 2, 3, 4];
      const secondArray = [4, 3, 2, 1];
      const result = getAreArraysEqual(firstArray, secondArray);
      expect(result).toEqual(true);
    });

    it('returns false when arrays are different', () => {
      const firstArray = [1, 2, 3, 4];
      const secondArray = [4, 3, 2, 1, 8];
      const result = getAreArraysEqual(firstArray, secondArray);
      expect(result).toEqual(false);

      const secondResult = getAreArraysEqual(secondArray, firstArray);
      expect(secondResult).toEqual(false);
    });
  });

  describe('calculateStaffVisibilityValue()', () => {
    it('when the visibility id array is empty, returns all staff', () => {
      const result = calculateStaffVisibilityValue([], [9, 8, 7]);
      expect(result).toEqual(StaffVisibilityOptions.allStaff);
    });

    it('when the visibility id and user id arrays are the same, returns only selected', () => {
      const resultUnordered = calculateStaffVisibilityValue(
        [7, 8, 9],
        [9, 8, 7]
      );
      expect(resultUnordered).toEqual(StaffVisibilityOptions.onlySelectedStaff);

      const resultOrdered = calculateStaffVisibilityValue([9, 8, 7], [9, 8, 7]);
      expect(resultOrdered).toEqual(StaffVisibilityOptions.onlySelectedStaff);
    });

    it('when the visibility id and user id array are different, return additional', () => {
      const result = calculateStaffVisibilityValue([7, 8, 9], [9, 8, 7, 12]);
      expect(result).toEqual(StaffVisibilityOptions.selectedStaffAndAdditional);
    });
  });

  describe('getOrganisationFormatId()', () => {
    it('should return organization_format_id when hasFormatId is true', () => {
      const event = {
        type: 'game_event',
        organisation_format: { id: '1' },
        organisation_format_id: '123',
      };
      const result = getOrganisationFormatId(event);
      expect(result).toEqual({ organisation_format_id: '123' });
    });

    it('should return organisation_format_id', () => {
      const event = {
        type: 'game_event',
        organisation_format_id: '123',
      };
      const result = getOrganisationFormatId(event);
      expect(result).toEqual({ organisation_format_id: '123' });
    });

    it('should return organization_format_id from event.organization_format if hasFormatButNoFormatId is true', () => {
      const event = {
        type: 'game_event',
        organisation_format: { id: '456' },
        organisation_format_id: null,
      };
      const result = getOrganisationFormatId(event);
      expect(result).toEqual({ organisation_format_id: '456' });
    });

    it('should return undefined when neither hasFormatId nor hasFormatButNoFormatId is true', () => {
      const event = {
        type: 'game_event',
        organisation_format: null,
        organisation_format_id: null,
      };
      const result = getOrganisationFormatId(event);
      expect(result).toEqual({ organisation_format_id: undefined });
    });

    it('should return undefined when event.type is not "game_event"', () => {
      const event = {
        type: 'other_event',
        organisation_format: 'Some format',
        organisation_format_id: '123',
      };
      const result = getOrganisationFormatId(event);
      expect(result).toEqual({});
    });
  });

  describe('getFieldCondition()', () => {
    it.each([
      {
        description: 'converts event.field_condition as an object correctly',
        input: { field_condition: { id: 0, name: 'n' } },
        expected: 0,
      },
      {
        description: 'converts event.field_condition as a number correctly',
        input: { field_condition: 0 },
        expected: 0,
      },
      {
        description:
          'doesn’t convert event.field_condition if it has an unexpected type',
        input: { field_condition: 's' },
        expected: 's',
      },
      {
        description: 'returns undefined if there’s no event.field_condition',
        input: {},
        expected: undefined,
      },
      {
        description:
          'doesn’t convert event.field_condition if it’s an empty object',
        input: { field_condition: {} },
        expected: {},
      },
      {
        description: 'returns undefined if event is undefined',
        input: undefined,
        expected: undefined,
      },
      {
        description: 'returns undefined if event is null',
        input: null,
        expected: undefined,
      },
    ])('$description', ({ input, expected }) =>
      expect(getFieldCondition(input)).toEqual(expected)
    );
  });

  describe('convertPlanningEventToEventFormData', () => {
    it('converts a basic game planning event to EventFormData', () => {
      const inputEvent = {
        type: 'game_event',
        id: '1',
        local_timezone: 'Europe/Dublin',
        start_date: '2024-04-20T07:00:48Z',
        duration: 20,
        score: '1',
        opponent_score: '2',
      };

      const result = convertPlanningEventToEventFormData({ event: inputEvent });
      expect(result.id).toEqual('1');
      expect(result.duration).toEqual(20);
      expect(result.type).toEqual('game_event');
      expect(result.local_timezone).toEqual('Europe/Dublin');
      expect(result.start_time).toEqual('2024-04-20T07:00:48Z');
      expect(result.score).toEqual('1');
      expect(result.opponent_score).toEqual('2');
      expect(result.turnaround_fixture).toEqual(true);
    });

    it('converts a basic game planning event with null duration to EventFormData', () => {
      const inputEvent = {
        type: 'game_event',
        id: '1',
        local_timezone: 'Europe/Dublin',
        start_date: '2024-04-20T07:00:48Z',
        duration: null,
        score: '1',
        opponent_score: '2',
      };

      const result = convertPlanningEventToEventFormData({
        event: inputEvent,
        activeEventPeriods: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
        ],
      });
      expect(result.id).toEqual('1');
      expect(result.duration).toEqual(null);
      expect(result.type).toEqual('game_event');
      expect(result.local_timezone).toEqual('Europe/Dublin');
      expect(result.start_time).toEqual('2024-04-20T07:00:48Z');
      expect(result.score).toEqual('1');
      expect(result.opponent_score).toEqual('2');
      expect(result.turnaround_fixture).toEqual(true);
      expect(result.number_of_periods).toEqual(5);
    });

    it('converts a basic game planning event with null scores to EventFormData', () => {
      const inputEvent = {
        type: 'game_event',
        id: '1',
        local_timezone: 'Europe/Dublin',
        start_date: '2024-04-20T07:00:48Z',
        duration: null,
        score: null,
        opponent_score: null,
      };

      const result = convertPlanningEventToEventFormData({
        event: inputEvent,
        activeEventPeriods: [{ id: 1 }],
      });
      expect(result.id).toEqual('1');
      expect(result.duration).toEqual(null);
      expect(result.type).toEqual('game_event');
      expect(result.local_timezone).toEqual('Europe/Dublin');
      expect(result.start_time).toEqual('2024-04-20T07:00:48Z');
      expect(result.score).toEqual(0);
      expect(result.opponent_score).toEqual(0);
      expect(result.turnaround_fixture).toEqual(true);
      expect(result.number_of_periods).toEqual(1);
    });

    it('converts a basic game planning event with custom org data to EventFormData', () => {
      const inputEvent = {
        type: 'game_event',
        id: '1',
        local_timezone: 'Europe/Dublin',
        start_date: '2024-04-20T07:00:48Z',
        duration: 20,
        score: '1',
        opponent_score: '2',
        nfl_location_id: '3',
        nfl_surface_type_id: '4',
        nfl_equipment_id: 5,
        field_condition: { id: 4, name: 'Normal/Dry' },
      };

      const result = convertPlanningEventToEventFormData({ event: inputEvent });
      expect(result.nfl_location_id).toEqual(3);
      expect(result.nfl_surface_type_id).toEqual(4);
      expect(result.nfl_equipment_id).toEqual(5);
      expect(result.field_condition).toEqual(4);
      expect(result.number_of_periods).toEqual(2);
    });

    describe('details planning event', () => {
      const inputEvent = {
        venue_type: {
          id: 2,
          name: 'Away',
        },
        opponent_team: {
          id: 77,
          name: 'New Zealand',
        },
        organisation_team: {
          id: 1479,
          name: 'Club Team',
        },
        opponent_score: 3,
        score: 2,
        round_number: 4,
        id: 19,
        name: 'custom name',
        start_date: '2022-05-05T14:40:00Z',
        duration: 15,
        type: 'game_event',
        local_timezone: 'Europe/Dublin',
        surface_type: {
          id: 16,
          name: 'Canvas',
        },
        surface_quality: {
          id: 13,
          title: 'Muddy',
        },
        weather: {
          id: 1,
          title: 'Sunny',
        },
        temperature: '22',
        humidity: null,
        workload_units: {},
        number_of_periods: 4,
        description: 'Test description',
        turnaround_fixture: false,
        turnaround_prefix: 'DK',
        editable: true,
        are_participants_duplicated: false,
        no_participants: false,
        event_collection_complete: false,
        athlete_events_count: 100,
        organisation_fixture_rating: { id: 1, name: 'A' },
        custom_period_duration_enabled: false,
      };

      const expectedResult = {
        id: 19,
        duration: 15,
        title: 'custom name',
        description: 'Test description',
        local_timezone: 'Europe/Dublin',
        start_time: '2022-05-05T14:40:00Z',
        surface_type: 16,
        surface_quality: 13,
        weather: 1,
        temperature: 22,
        humidity: null,
        type: 'game_event',
        league_setup: false,
        venue_type_id: 2,
        organisation_team_id: 1479,
        team_id: 77,
        score: 2,
        number_of_periods: 4,
        opponent_score: 3,
        round_number: 4,
        turnaround_fixture: false,
        turnaround_prefix: 'DK',
        workload_units: {},
        editable: true,
        are_participants_duplicated: false,
        duplicate_event_activities: undefined,
        no_participants: false,
        event_collection_complete: false,
        athlete_events_count: 100,
        organisation_fixture_rating_id: 1,
        organisation_format_id: undefined,
        event_location: undefined,
        competition: undefined,
        competition_category: undefined,
        competition_id: undefined,
        competition_category_id: undefined,
        fas_game_key: undefined,
        mls_game_key: undefined,
        opponent_squad: undefined,
        nfl_equipment_id: undefined,
        nfl_location_feed_id: undefined,
        nfl_location_id: undefined,
        nfl_surface_composition_id: undefined,
        nfl_surface_type_id: undefined,
        field_condition: undefined,
        opponent_team: {
          id: 77,
          name: 'New Zealand',
        },
        custom_periods: undefined,
        custom_opposition_name: '',
        custom_period_duration_enabled: false,
      };

      it('converts a detailed game planning event to EventFormData', () => {
        const result = convertPlanningEventToEventFormData({
          event: inputEvent,
        });
        expect(result).toEqual(expectedResult);
      });

      it('converts a detailed game event with a custom opposition name to EventFormData', () => {
        const customNameInput = {
          ...inputEvent,
          opponent_team: {
            ...inputEvent.opponent_team,
            custom: true,
          },
        };
        const result = convertPlanningEventToEventFormData({
          event: customNameInput,
        });
        expect(result).toEqual({
          ...expectedResult,
          opponent_team: { ...customNameInput.opponent_team },
          custom_opposition_name: inputEvent.opponent_team.name,
        });
      });

      it('converts a local unsaved detailed game event with a custom opposition name to EventFormData', () => {
        const customNameInput = {
          ...inputEvent,
          opponent_team: {
            id: LOCAL_CUSTOM_OPPOSITION_OPTION_ID,
          },
          custom_opposition_name: 'test name',
        };
        const result = convertPlanningEventToEventFormData({
          event: customNameInput,
        });
        expect(result).toEqual({
          ...expectedResult,
          team_id: LOCAL_CUSTOM_OPPOSITION_OPTION_ID,
          opponent_team: { ...customNameInput.opponent_team },
          custom_opposition_name: customNameInput.custom_opposition_name,
        });
      });

      it('converts a local unsaved detailed game event with a organisation fixture rating to EventFormData', () => {
        const customNameInput = {
          ...inputEvent,
          organisation_fixture_rating_id: 37,
        };
        const result = convertPlanningEventToEventFormData({
          event: customNameInput,
        });
        expect(result).toEqual({
          ...expectedResult,
          organisation_fixture_rating_id:
            customNameInput.organisation_fixture_rating_id,
        });
      });

      it('converts a local unsaved detailed game event with custom periods to EventFormData', () => {
        const mockCustomPeriods = [
          {
            name: 'Custom Period 1',
            absolute_duration_start: 30,
            absolute_duration_end: 90,
            duration: 60,
          },
        ];
        const customPeriodsInput = {
          ...inputEvent,
          custom_periods: mockCustomPeriods,
        };
        const result = convertPlanningEventToEventFormData({
          event: customPeriodsInput,
        });
        expect(result).toEqual({
          ...expectedResult,
          custom_periods: mockCustomPeriods,
        });
      });

      it('converts a local unsaved detailed game event with the passed in existing periods to EventFormData', () => {
        const mockCustomPeriods = [
          {
            name: 'Period 1',
            absolute_duration_start: 30,
            absolute_duration_end: 90,
            duration: 60,
          },
        ];
        const result = convertPlanningEventToEventFormData({
          event: inputEvent,
          activeEventPeriods: mockCustomPeriods,
        });
        expect(result).toEqual({
          ...expectedResult,
          number_of_periods: 1,
          custom_periods: mockCustomPeriods,
        });
      });

      it('on the calendar panel, converts the event number_of_periods to only be based on the events attribute', () => {
        const mockCustomPeriods = [
          {
            name: 'Period 1',
            absolute_duration_start: 30,
            absolute_duration_end: 90,
            duration: 60,
          },
        ];
        const result = convertPlanningEventToEventFormData({
          event: inputEvent,
          activeEventPeriods: mockCustomPeriods,
          isCalendarMode: true,
        });
        expect(result).toEqual({
          ...expectedResult,
          number_of_periods: 4,
          custom_periods: mockCustomPeriods,
        });
      });
    });

    it('converts a basic session planning event to EventFormData', () => {
      const inputEvent = {
        type: 'session_event',
        id: '1',
        local_timezone: 'Europe/Dublin',
        start_date: '2024-04-20T07:00:48Z',
        duration: 20,
        workload_type: 1,
        session_type: {
          id: 16,
          name: 'Academy Rugby',
        },
        editable: false,
      };

      const result = convertPlanningEventToEventFormData({ event: inputEvent });
      expect(result.id).toEqual('1');
      expect(result.duration).toEqual(20);
      expect(result.editable).toEqual(false);
      expect(result.type).toEqual('session_event');
      expect(result.local_timezone).toEqual('Europe/Dublin');
      expect(result.start_time).toEqual('2024-04-20T07:00:48Z');
      expect(result.workload_type).toEqual(1);
      expect(result.session_type_id).toEqual(16);
    });

    it(
      'converts a duplicate session planning event to EventFormData with the correct recurrence' +
        'object when isDuplicate is true',
      () => {
        const inputEvent = {
          type: 'session_event',
          id: '1',
          local_timezone: 'Europe/Dublin',
          start_date: '2024-04-20T07:00:48Z',
          duration: 20,
          workload_type: 1,
          session_type: {
            id: 16,
            name: 'Academy Rugby',
          },
          editable: false,
        };

        const result = convertPlanningEventToEventFormData({
          event: inputEvent,
          isDuplicate: true,
        });
        expect(result.recurrence).toEqual(emptyRecurrence);
      }
    );

    it('converts a detailed session planning event to EventFormData', () => {
      // When is_joint_practice is defined
      const inputEvent = {
        type: 'session_event',
        workload_type: 1,
        game_day_minus: 5,
        game_day_plus: 7,
        rpe_collection_kiosk: true,
        rpe_collection_athlete: true,
        mass_input: false,
        session_type: {
          id: 16,
          name: 'Academy Rugby',
          is_joint_practice: false,
          sessionTypeCategoryName: 'Practice',
        },
        background_color: '#01205d',
        id: 25,
        name: 'Test name',
        start_date: '2022-05-11T13:00:00Z',
        end_date: '2022-05-11T13:30:00Z',
        duration: 30,
        local_timezone: 'Europe/Dublin',
        surface_type: {
          id: 6,
          name: 'Hybrid',
        },
        surface_quality: {
          id: 9,
          title: 'Hard',
        },
        season_type: { id: 1, name: 'Voluntary Minicamp', is_archived: false },
        weather: null,
        temperature: 22,
        humidity: 13,
        workload_units: {},
        description: 'Test description',
        are_participants_duplicated: false,
        no_participants: true,
        event_collection_complete: false,
        opponent_team: { id: 5, name: 'Test Team' },
        athlete_events_count: 0,
        nfl_surface_composition: { id: 5, name: 'Test Surface Comp' },
        event_location: {
          id: 10,
          name: 'Test Location',
          parent_event_location_id: null,
          parents: [],
        },
        event_users: [
          {
            id: 1,
            user: {
              id: 234,
              firstname: 'Ash',
              lastname: 'Ketchum',
              fullname: 'Ash Ketchum',
            },
          },
        ],
        recurrence: {
          rule: 'DTSTART:20241203T121000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU',
          recurring_event_id: null,
          original_start_time: null,
          rrule_instances: null,
        },
      };

      const result = convertPlanningEventToEventFormData({ event: inputEvent });

      const expectedResult = {
        id: 25,
        duration: 30,
        title: 'Test name',
        description: 'Test description',
        editable: false,
        local_timezone: 'Europe/Dublin',
        start_time: '2022-05-11T13:00:00Z',
        surface_type: 6,
        surface_quality: 9,
        weather: undefined,
        temperature: 22,
        humidity: 13,
        type: 'session_event',
        session_type_id: 16,
        session_type: {
          id: 16,
          isJointSessionType: false,
          sessionTypeCategoryName: 'Practice',
          name: 'Academy Rugby',
        },
        workload_type: 1,
        game_day_minus: 5,
        game_day_plus: 7,
        workload_units: {},
        are_participants_duplicated: false,
        duplicate_event_activities: undefined,
        no_participants: true,
        event_collection_complete: false,
        season_type_id: 1,
        season_type: { id: 1, name: 'Voluntary Minicamp', is_archived: false },
        athlete_events_count: 0,
        nfl_surface_composition_id: 5,
        nfl_equipment_id: undefined,
        nfl_location_feed_id: undefined,
        nfl_location_id: undefined,
        nfl_surface_type_id: undefined,
        field_condition: undefined,
        // erase the team_id if this is switched to a non-joint session via Calendar workflow
        team_id: null,
        venue_type_id: null,
        event_location: {
          id: 10,
          name: 'Test Location',
          parent_event_location_id: null,
          parents: [],
        },
        user_ids: [234],
        recurrence: {
          ...inputEvent.recurrence,
          rule: RRule.fromString(inputEvent.recurrence.rule),
        },
      };

      expect(result).toEqual(expectedResult);

      // When is_joint_practice is undefined,and isJointPractice is already defined
      const input = {
        ...inputEvent,
        session_type: {
          id: 16,
          name: 'Academy Rugby',
          isJointSessionType: true,
          sessionTypeCategoryName: 'Practice',
        },
        venue_type: { id: 1, name: 'Home' },
      };

      const output = {
        ...expectedResult,
        session_type: {
          id: 16,
          isJointSessionType: true,
          sessionTypeCategoryName: 'Practice',
          name: 'Academy Rugby',
        },
        team_id: 5,
        venue_type_id: 1,
      };

      expect(convertPlanningEventToEventFormData({ event: input })).toEqual(
        output
      );
    });
    it('converts an event with unuploaded files correctly', () => {
      const inputFile = new File(['testFile.jpg'], {
        type: 'jpeg',
      });
      const inputEvent = {
        unUploadedFiles: [
          {
            id: 12,
            filename: 'other name.jpg',
            filenameWithoutExtension: 'other name',
            fileType: 'jpeg',
            fileSize: 342,
            fileTitle: 'testFile',
            file: inputFile,
            event_attachment_category_ids: [1],
          },
        ],
      };

      const result = convertPlanningEventToEventFormData({ event: inputEvent });

      expect(result.unUploadedFiles.length).toEqual(1);
      expect(result.unUploadedFiles[0]).toEqual({
        id: 12,
        filename: 'other name.jpg',
        filenameWithoutExtension: 'other name',
        fileType: 'jpeg',
        fileSize: 342,
        fileTitle: 'testFile',
        file: inputFile,
        event_attachment_category_ids: [1],
      });
    });

    it('converts an event with attachments and attached links correctly', () => {
      const inputEvent = {
        attachments: [
          {
            id: 12,
            filename: 'other name.jpg',
            name: 'testFile',
            download_url: 'url.com',
          },
          {
            id: 2,
            filename: 'other name 2.jpg',
            name: 'testFile 2',
            download_url: 'url.com2',
          },
        ],
        attached_links: [{ title: 'my custom title', uri: 'test uri' }],
      };

      const result = convertPlanningEventToEventFormData({ event: inputEvent });

      expect(result.attachments.length).toEqual(2);
      expect(result.attachments).toEqual([
        {
          id: 12,
          filename: 'other name.jpg',
          name: 'testFile',
          download_url: 'url.com',
        },
        {
          id: 2,
          filename: 'other name 2.jpg',
          name: 'testFile 2',
          download_url: 'url.com2',
        },
      ]);
      expect(result.attached_links.length).toEqual(1);
      expect(result.attached_links).toEqual([
        { title: 'my custom title', uri: 'test uri' },
      ]);
    });

    describe('custom events', () => {
      const customEvent = {
        local_timezone: 'Europe/Dublin',
        start_date: '2021-07-12T10:00:16+00:00',
        duration: 60,
        type: 'custom_event',
        editable: true,
        name: 'Coaches Sync',
        custom_event_type: { id: 7 },
        id: 456,
        athlete_ids: [123],
      };

      const undefinedProps = {
        are_participants_duplicated: undefined,
        duplicate_event_activities: undefined,
        athlete_events_count: undefined,
        description: undefined,
        event_location: undefined,
        no_participants: undefined,
        repeat_rule: undefined,
        staff_visibility: undefined,
        visibility_ids: undefined,
      };
      it('converts a custom planning event to custom event form data correctly', () => {
        const result = convertPlanningEventToEventFormData({
          event: customEvent,
        });
        expect(result).toEqual({
          id: 456,
          duration: 60,
          editable: true,
          event_collection_complete: false,
          custom_event_type: {
            id: 7,
          },
          local_timezone: 'Europe/Dublin',
          start_time: '2021-07-12T10:00:16+00:00',
          title: 'Coaches Sync',
          type: 'custom_event',
          ...undefinedProps,
          athlete_ids: [123],
        });
      });

      describe('when staff-visibility-custom-events is on', () => {
        it('converts properly', () => {
          window.featureFlags['staff-visibility-custom-events'] = true;

          const result = convertPlanningEventToEventFormData({
            event: {
              ...customEvent,
              user_ids: [3],
              visibility_ids: [9, 8, 7],
              staff_visibility:
                StaffVisibilityOptions.selectedStaffAndAdditional,
            },
          });
          expect(result).toEqual({
            id: 456,
            duration: 60,
            editable: true,
            event_collection_complete: false,
            custom_event_type: {
              id: 7,
            },
            local_timezone: 'Europe/Dublin',
            start_time: '2021-07-12T10:00:16+00:00',
            title: 'Coaches Sync',
            type: 'custom_event',
            ...undefinedProps,
            athlete_ids: [123],
            user_ids: [3],
            visibility_ids: [9, 8, 7],
            staff_visibility: StaffVisibilityOptions.selectedStaffAndAdditional,
          });

          window.featureFlags['staff-visibility-custom-events'] = false;
        });
      });
    });

    it('converts an event with session-theme-related fields', () => {
      const inputEvent = {
        theme: {
          id: 1,
          name: 'phase',
        },
        theme_type: sessionThemeOptionTypes.PhaseOfPlay,
        theme_id: 1,
      };

      const result = convertPlanningEventToEventFormData({ event: inputEvent });
      expect(result.theme).toEqual({ id: 1, name: 'phase' });
      expect(result.theme_type).toEqual(sessionThemeOptionTypes.PhaseOfPlay);
      expect(result.theme_id).toEqual(1);
    });

    it('converts an event with field_condition’s value as an object', () => {
      const inputEvent = {
        field_condition: { id: 1, name: 'field condition' },
      };

      const result = convertPlanningEventToEventFormData({ event: inputEvent });
      expect(result.field_condition).toEqual(1);
    });

    it('converts an event with field_condition’s value as a number', () => {
      const inputEvent = { field_condition: 1 };

      const result = convertPlanningEventToEventFormData({ event: inputEvent });
      expect(result.field_condition).toEqual(1);
    });
  });
});
