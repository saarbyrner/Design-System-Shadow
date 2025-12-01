import uuid from 'uuid';
import {
  alarmDefinitions,
  alarmDefinitionsForStatus,
  alarmSquadSearch,
  alarmsEditorModal,
  showDashboardFilters,
} from '../reducer';

const statusId = '6h8b5427-bbc3-11e6-b8cc-438769632287';

const positions = {
  27: 'Loose Prop',
  89: 'Tight Prop',
};
const positionOrder = [89, 27];

const positionGroups = {
  21: 'Forwards',
  43: 'Backs',
};
const positionGroupOrder = [21, 43];
const athletes = {
  12: {
    id: 12,
    firstname: 'John',
    lastname: 'Wayne',
  },
  77: {
    id: 77,
    firstname: 'Greg',
    lastname: 'Smith',
  },
};
const athleteOrder = [77, 12];

describe('Dashboard feature reducer', () => {
  describe('alarmsEditorModal', () => {
    test('returns correct state on SHOW_ALARMS_EDITOR_MODAL action', () => {
      const initialState = {
        visible: false,
      };

      const expected = {
        isVisible: true,
        statusId: '5e3b5427-bbc3-11e6-b8cc-438769327787',
      };

      const action = {
        type: 'SHOW_ALARMS_EDITOR_MODAL',
        statusId: '5e3b5427-bbc3-11e6-b8cc-438769327787',
      };

      const nextState = alarmsEditorModal(initialState, action);
      expect(nextState).toEqual(expected);
    });

    test('returns correct state on HIDE_ALARMS_EDITOR_MODAL action', () => {
      const initialState = {
        isVisible: true,
        statusId: '5e3b5427-bbc3-11e6-b8cc-438769327787',
      };

      const expected = {
        isVisible: false,
      };

      const action = {
        type: 'HIDE_ALARMS_EDITOR_MODAL',
      };

      const nextState = alarmsEditorModal(initialState, action);
      expect(nextState).toEqual(expected);
    });
  });

  describe('showDashboardFilters', () => {
    test('returns correct state on TOGGLE_DASHBOARD_FILTERS action', () => {
      const initialState = {
        showDashboardFilters: false,
      };

      const newShowDashboardFilters = true;
      const action = {
        type: 'TOGGLE_DASHBOARD_FILTERS',
        payload: {
          isFilterShown: initialState.showDashboardFilters,
        },
      };

      const nextState = showDashboardFilters(initialState, action);
      expect(nextState).toEqual(newShowDashboardFilters);
    });
  });
});

describe('Alarms feature reducer', () => {
  test('returns correct state on SET_ALARM_DEFINITIONS_FOR_STATUS action', () => {
    const initialState = {
      initialAlarms: [],
      alarms: [],
    };

    const alarms = [
      {
        alarm_id: '5e3b5427-bbc3-11e6-b8cc-438769327787',
        applies_to_squad: true,
        colour: 'colour1',
        condition: 'equals',
        value: '1.0',
      },
    ];

    const action = {
      type: 'SET_ALARM_DEFINITIONS_FOR_STATUS',
      payload: {
        alarms,
      },
    };

    const expected = {
      initialAlarms: alarms,
      alarms,
    };

    const nextState = alarmDefinitionsForStatus(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on ADD_ALARM_DEFINITION_FOR_STATUS action', () => {
    const initialState = {
      initialAlarms: [],
      alarms: [],
    };

    const alarmId = uuid.v4();

    const action = {
      type: 'ADD_ALARM_DEFINITION_FOR_STATUS',
      payload: {
        alarmId,
      },
    };

    const alarms = [
      {
        alarm_id: alarmId,
        alarm_type: 'numeric',
        percentage_alarm_definition: {},
        applies_to_squad: false,
        colour: 'colour1',
        condition: null,
        value: null,
        positions: [],
        position_groups: [],
        athletes: [],
      },
    ];
    const expected = JSON.parse(JSON.stringify(initialState));
    expected.alarms = alarms;

    const nextState = alarmDefinitionsForStatus(initialState, action);

    expect(nextState).toEqual(expected);
  });

  test('returns correct state on DELETE_ALARM_DEFINITION_FOR_STATUS action', () => {
    const alarmId = uuid.v4();

    const alarms = [
      {
        alarm_id: alarmId,
        applies_to_squad: true,
        colour: 'colour1',
        condition: 'equals',
        value: '3',
      },
    ];

    const initialState = {
      initialAlarms: alarms,
      alarms,
    };

    const action = {
      type: 'DELETE_ALARM_DEFINITION_FOR_STATUS',
      payload: {
        index: 0,
      },
    };

    const nextState = alarmDefinitionsForStatus(initialState, action);
    const expected = {
      initialAlarms: alarms,
      alarms: [],
    };

    expect(nextState).toEqual(expected);
  });

  test('returns correct state on DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS action', () => {
    const alarmId1 = uuid.v4();
    const alarmId2 = uuid.v4();

    const alarms = [
      {
        alarm_id: alarmId1,
        applies_to_squad: true,
        colour: 'colour1',
        condition: 'equals',
        value: '3',
      },
      {
        alarm_id: alarmId2,
        applies_to_squad: true,
        colour: 'colour2',
        condition: 'equals',
        value: '4',
      },
    ];

    const initialState = {
      initialAlarms: alarms,
      alarms,
    };

    const action = {
      type: 'DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS',
    };

    const nextState = alarmDefinitionsForStatus(initialState, action);
    const expected = {
      initialAlarms: alarms,
      alarms: [],
    };

    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SET_ALARM_CONDITION action', () => {
    const alarmId = uuid.v4();

    const alarms = [
      {
        alarm_id: alarmId,
        applies_to_squad: true,
        colour: 'colour1',
        condition: null,
        value: '1.0',
      },
    ];

    const initialState = {
      initialAlarms: alarms,
      alarms,
    };

    const action = {
      type: 'SET_ALARM_CONDITION',
      payload: {
        condition: 'greater_than',
        index: 0,
      },
    };

    const updatedAlarms = [
      {
        alarm_id: alarmId,
        applies_to_squad: true,
        colour: 'colour1',
        condition: 'greater_than',
        value: '1.0',
      },
    ];
    const expected = JSON.parse(JSON.stringify(initialState));
    expected.alarms = updatedAlarms;

    const nextState = alarmDefinitionsForStatus(initialState, action);

    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SET_ALARM_CALCULATION action', () => {
    const alarmId = uuid.v4();

    const alarms = [
      {
        alarm_id: alarmId,
        applies_to_squad: true,
        colour: 'colour1',
        condition: 'greater_than',
        percentage_alarm_definition: {
          calculation: '',
          period_length: null,
          period_scope: null,
          percentage: '',
        },
        value: '1.0',
      },
    ];

    const initialState = {
      initialAlarms: alarms,
      alarms,
    };

    const action = {
      type: 'SET_ALARM_CALCULATION',
      payload: {
        calculation: 'mean',
        index: 0,
      },
    };

    const updatedAlarms = [
      {
        alarm_id: alarmId,
        applies_to_squad: true,
        colour: 'colour1',
        condition: 'greater_than',
        percentage_alarm_definition: {
          calculation: 'mean',
          period_length: null,
          period_scope: null,
          percentage: '',
        },
        value: '1.0',
      },
    ];
    const expected = JSON.parse(JSON.stringify(initialState));
    expected.alarms = updatedAlarms;

    const nextState = alarmDefinitionsForStatus(initialState, action);

    expect(nextState).toEqual(expected);
  });

  test('returns correct state on SET_ALARM_PERCENTAGE action', () => {
    const alarmId = uuid.v4();

    const alarms = [
      {
        alarm_id: alarmId,
        alarm_type: 'percentage',
        applies_to_squad: true,
        colour: 'colour1',
        condition: 'greater_than',
        percentage_alarm_definition: {},
        value: '1.0',
      },
    ];

    const initialState = {
      initialAlarms: alarms,
      alarms,
    };

    const action = {
      type: 'SET_ALARM_PERCENTAGE',
      payload: {
        percentage: '44',
        index: 0,
      },
    };

    const updatedAlarms = [
      {
        alarm_id: alarmId,
        alarm_type: 'percentage',
        applies_to_squad: true,
        colour: 'colour1',
        condition: 'greater_than',
        percentage_alarm_definition: {
          percentage: '44',
        },
        value: '1.0',
      },
    ];
    const expected = JSON.parse(JSON.stringify(initialState));
    expected.alarms = updatedAlarms;

    const nextState = alarmDefinitionsForStatus(initialState, action);

    expect(nextState).toEqual(expected);
  });

  describe('SET_ALARM_VALUE action', () => {
    let initialState;
    let action;
    let updatedAlarms;
    let nextState;

    beforeEach(() => {
      const alarms = [
        {
          alarm_id: 'uuid',
          applies_to_squad: true,
          colour: 'colour1',
          condition: null,
          value: '1.0',
        },
      ];

      initialState = {
        initialAlarms: alarms,
        alarms,
      };
    });

    test('returns correct state when value is integer', () => {
      action = {
        type: 'SET_ALARM_VALUE',
        payload: {
          value: '2',
          index: 0,
        },
      };

      updatedAlarms = [
        {
          alarm_id: 'uuid',
          applies_to_squad: true,
          colour: 'colour1',
          condition: null,
          value: '2',
        },
      ];
      const expected = JSON.parse(JSON.stringify(initialState));
      expected.alarms = updatedAlarms;

      nextState = alarmDefinitionsForStatus(initialState, action);

      expect(nextState).toEqual(expected);
    });

    test('returns correct state when value is a positive float', () => {
      action = {
        type: 'SET_ALARM_VALUE',
        payload: {
          value: '2.5',
          index: 0,
        },
      };

      updatedAlarms = [
        {
          alarm_id: 'uuid',
          applies_to_squad: true,
          colour: 'colour1',
          condition: null,
          value: '2.5',
        },
      ];
      const expected = JSON.parse(JSON.stringify(initialState));
      expected.alarms = updatedAlarms;

      nextState = alarmDefinitionsForStatus(initialState, action);

      expect(nextState).toEqual(expected);
    });

    test('returns correct state when value is a negative float', () => {
      action = {
        type: 'SET_ALARM_VALUE',
        payload: {
          value: '-3.5',
          index: 0,
        },
      };

      updatedAlarms = [
        {
          alarm_id: 'uuid',
          applies_to_squad: true,
          colour: 'colour1',
          condition: null,
          value: '-3.5',
        },
      ];
      const expected = JSON.parse(JSON.stringify(initialState));
      expected.alarms = updatedAlarms;

      nextState = alarmDefinitionsForStatus(initialState, action);

      expect(nextState).toEqual(expected);
    });
  });
});

describe('alarmDefinitions reducer', () => {
  test('replaces the alarm definition on SET_ALARM_DEFINITIONS', () => {
    const initialState = {
      [statusId]: [],
      other_status: [],
    };
    const newAlarmDefinitions = {
      status_id1: [],
      status_id2: [],
    };

    const action = {
      type: 'SET_ALARM_DEFINITIONS',
      payload: {
        alarmDefinitions: newAlarmDefinitions,
      },
    };

    const nextState = alarmDefinitions(initialState, action);
    expect(nextState).toEqual(newAlarmDefinitions);
  });
});

describe('alarmSquadSearch reducer', () => {
  test('returns correct state on SET_ALARM_DEFINITIONS_FOR_STATUS action', () => {
    const initialState = {
      positions,
      positionOrder,
      positionGroups,
      positionGroupOrder,
      athletes,
      athleteOrder,
    };

    const action = {
      type: 'SET_ALARM_DEFINITIONS_FOR_STATUS',
      payload: {
        alarms: [
          {
            alarm_id: 'uuid',
            applies_to_squad: false,
            colour: 'colour1',
            condition: null,
            athletes: [],
            positions: [],
            position_groups: [],
            value: '1.0',
          },
        ],
      },
    };

    const expected = {
      positions,
      positionOrder,
      positionGroups,
      positionGroupOrder,
      athletes,
      athleteOrder,
      uuid: {
        isSearching: false,
        searchTerm: '',
        positionMatches: ['27', '89'],
        positionGroupMatches: ['21', '43'],
        athleteMatches: ['12', '77'],
      },
    };

    const nextState = alarmSquadSearch(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on ALARM_SEARCH_APPLIES_TO action', () => {
    const initialState = {
      positions,
      positionGroups,
      athletes,
      uuid: {
        isSearching: false,
        positionMatches: ['27', '89'],
        positionGroupMatches: ['21', '43'],
        athleteMatches: ['12', '77'],
      },
    };

    const action = {
      type: 'ALARM_SEARCH_APPLIES_TO',
      payload: {
        searchTerm: 'John',
        alarmId: 'uuid',
      },
    };

    const expected = {
      positions,
      positionGroups,
      athletes,
      uuid: {
        isSearching: true,
        searchTerm: 'John',
        positionMatches: [],
        positionGroupMatches: [],
        athleteMatches: ['12'],
      },
    };

    const nextState = alarmSquadSearch(initialState, action);
    expect(nextState).toEqual(expected);
  });

  test('returns correct state on ADD_ALARM_DEFINITION_FOR_STATUS action', () => {
    const initialState = {
      positions,
      positionGroups,
      athletes,
    };

    const action = {
      type: 'ADD_ALARM_DEFINITION_FOR_STATUS',
      payload: {
        alarmId: 'uuid',
      },
    };

    const expected = {
      positions,
      positionGroups,
      athletes,
      uuid: {
        isSearching: false,
        positionMatches: ['27', '89'],
        positionGroupMatches: ['21', '43'],
        athleteMatches: ['12', '77'],
      },
    };

    const nextState = alarmSquadSearch(initialState, action);
    expect(nextState).toEqual(expected);
  });
});
