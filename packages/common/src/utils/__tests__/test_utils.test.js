import {
  buildAlarms,
  buildAthlete,
  buildAthletes,
  buildDashboards,
  buildStatus,
  buildStatuses,
  buildStatusVariable,
  buildStatusVariables,
  buildTemplate,
  buildTemplates,
} from '../test_utils';

describe('Test Utils', () => {
  beforeEach(() => {
    Date.now = jest.fn(() => 1487076708000);
    jest.spyOn(Math, 'random').mockImplementation(() => 1);
  });

  const athleteInfo = (id) => ({
    availability: 'available',
    avatar_url: '',
    firstname: 'Foo',
    fullname: `Foo Bar Baz ${id}`,
    id,
    indications: {},
    last_screening: '2017-05-05T10:31:14+01:00',
    lastname: `Bar Baz ${id}`,
    position: 'Blindside Flanker',
    positionGroup: 'Back',
    positionGroupId: id,
    positionId: id,
    screened_today: false,
    shortname: `F. Bar Baz ${id}`,
    squad_ids: [],
    status_data: {
      'pretend-uuid-0': {
        alarms: [],
        data_points_used: 0,
        raw_value: null,
        value: null,
      },
      'pretend-uuid-1': {
        alarms: [],
        data_points_used: 1,
        raw_value: '23',
        value: '23',
      },
      'pretend-uuid-2': {
        alarms: [],
        data_points_used: 10,
        raw_value: '4000',
        value: '4000',
      },
      'pretend-uuid-3': {
        alarms: [],
        data_points_used: 0,
        raw_value: null,
        value: null,
      },
      'pretend-uuid-4': {
        alarms: [],
        data_points_used: 0,
        raw_value: null,
        value: null,
      },
      'pretend-uuid-5': {
        alarms: [],
        data_points_used: 1,
        raw_value: '21.43',
        value: '21.43',
      },
      'pretend-uuid-6': {
        alarms: [],
        data_points_used: 1,
        raw_value: 'true',
        value: 'true',
      },
      'pretend-uuid-7': {
        alarms: [],
        data_points_used: 0,
        raw_value: null,
        value: null,
      },
      'pretend-uuid-8': {
        alarms: [],
        data_points_used: 1,
        raw_value: 'false',
        value: 'false',
      },
      'pretend-uuid-9': {
        alarms: [],
        data_points_used: 5,
        raw_value: '321.892',
        value: '321.892',
      },
    },
  });

  describe('buildAthlete', () => {
    it('returns the default built athlete', () => {
      expect(buildAthlete({})).toEqual(athleteInfo(101));
    });
  });

  describe('buildAthletes', () => {
    it('returns multiple built athletes', () => {
      expect(buildAthletes(1)).toEqual([
        { ...athleteInfo(1), positionGroupId: 101, positionId: 101 },
      ]);
    });
  });

  describe('buildTemplate', () => {
    it('returns the build template', () => {
      expect(buildTemplate()).toEqual({
        created_at: '2017-08-16T11:10:08+01:00',
        editor: { firstname: '101', id: 101, lastname: '101' },
        id: '101',
        name: '',
        organisation: { id: '101', name: '101' },
        updated_at: '2017-08-16T11:10:08+01:00',
      });
    });
  });

  describe('buildTemplates', () => {
    it('returns the build templates', () => {
      expect(buildTemplates(1)).toEqual([
        {
          created_at: '2017-08-16T11:10:08+01:00',
          editor: { firstname: '101', id: 101, lastname: '101' },
          id: '101',
          name: '',
          organisation: { id: '101', name: '101' },
          updated_at: '2017-08-16T11:10:08+01:00',
        },
      ]);
    });
  });

  describe('buildStatus', () => {
    it('returns the build status', () => {
      expect(buildStatus(1)).toEqual({
        alarms: [],
        description: 'last value from today',
        is_custom_name: false,
        localised_unit: 'm',
        name: 'Status 2',
        period_length: null,
        period_scope: null,
        second_period_all_time: null,
        second_period_length: null,
        settings: {},
        source_key: 'kitman:tv|variable1',
        status_id: 'pretend-uuid-1',
        summary: null,
        type: 'scale',
        variables: [{ source: 'kitman:tv', variable: 'variable1' }],
      });
    });
  });

  describe('buildStatuses', () => {
    it('returns the build statuses', () => {
      expect(buildStatuses(1)).toEqual([
        {
          alarms: [],
          description: 'last value from today',
          is_custom_name: false,
          localised_unit: 'm',
          name: 'Status 1',
          period_length: null,
          period_scope: null,
          second_period_all_time: null,
          second_period_length: null,
          settings: {},
          source_key: 'kitman:tv|variable0',
          status_id: 'pretend-uuid-0',
          summary: null,
          type: 'scale',
          variables: [{ source: 'kitman:tv', variable: 'variable0' }],
        },
      ]);
    });
  });

  describe('buildStatusVariable', () => {
    it('returns the build status variable', () => {
      expect(buildStatusVariable(1)).toEqual({
        localised_unit: '',
        name: 'Variable 2',
        source_key: 'kitman:tv|variable1',
        source_name: 'Training Variable',
        type: 'Number',
      });
    });
  });

  describe('buildStatusVariables', () => {
    it('returns the build status variables', () => {
      expect(buildStatusVariables(1)).toEqual([
        {
          localised_unit: '',
          name: 'Variable 1',
          source_key: 'kitman:tv|variable0',
          source_name: 'Training Variable',
          type: 'Number',
        },
      ]);
    });
  });

  describe('buildDashboards', () => {
    it('returns the build dashboards', () => {
      expect(buildDashboards(1)).toEqual([
        {
          created_at: new Date(Date.now()),
          id: 1001,
          last_update_by: 1001,
          name: '',
          organisation_id: 1001,
          updated_at: new Date(Date.now()),
        },
      ]);
    });
  });

  describe('buildAlarms', () => {
    it('returns the build alarms', () => {
      expect(buildAlarms(1)).toEqual([
        {
          alarm_id: 'pretend-uuid-0',
          alarm_type: 'numeric',
          applies_to_squad: true,
          athletes: [],
          colour: 'colour1',
          condition: 'less_than',
          percentage_alarm_definition: {},
          position_groups: [],
          positions: [],
          value: 5,
        },
      ]);
    });
  });
});
