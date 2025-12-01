import { buildAthlete } from '@kitman/common/src/utils/test_utils';
import {
  convertQuestionnaireVariablesToIdArray,
  checkedVariables,
  variablesHashToArray,
  formatDataForSaving,
  areAllVariablesFalse,
  isAthleteAllVariablesUnchecked,
  convertAthletesToIdArray,
  isQuestionnaireEmpty,
  formatSquadOptions,
} from '../utils';

describe('convertQuestionnaireVariablesToIdArray', () => {
  it('returns an array of IDs of the questionnaire variables', () => {
    const questionnaireVariables = [
      { id: 'tv_1', key: 'capture', name: '' },
      { id: 'indication_pain', key: 'well_being', name: '' },
      { id: 'injury', key: 'well_being', name: '' },
      { id: 'tv_3', key: 'msk', name: '' },
    ];
    const variablesArray = convertQuestionnaireVariablesToIdArray(
      questionnaireVariables
    );
    expect(variablesArray).toEqual([
      'tv_1',
      'indication_pain',
      'injury',
      'tv_3',
    ]);
  });

  it('returns an empty array if there are no questionnaire variables', () => {
    const questionnaireVariables = [];
    const variablesArray = convertQuestionnaireVariablesToIdArray(
      questionnaireVariables
    );
    expect(variablesArray).toEqual([]);
  });
});

describe('convertAthletesToIdArray', () => {
  it('returns an array of IDs of the athletes grouped by position', () => {
    const athletes = {
      group_1: [buildAthlete({ id: '10' }), buildAthlete({ id: '11' })],
      group_2: [buildAthlete({ id: '12' })],
    };
    const athleteIdsArray = convertAthletesToIdArray(athletes);
    expect(athleteIdsArray).toEqual(['10', '11', '12']);
  });

  it('returns an empty array if there are no athletes', () => {
    const athletes = []; // Function expects an object, but handles array gracefully
    const athletesArray = convertAthletesToIdArray(athletes);
    expect(athletesArray).toEqual([]);
  });
});

describe('checkedVariables', () => {
  it('creates an object of checked questionnaire variables from the athlete object', () => {
    const athletes = [
      {
        id: 1,
        variable_ids: ['tv_1', 'tv_2', 'tv_3', 'tv_4'],
      },
      {
        id: 2,
        variable_ids: [],
      },
    ];
    const checkedVariablesList = checkedVariables(athletes);
    const expectedCheckedVariablesList = {
      1: {
        tv_1: true,
        tv_2: true,
        tv_3: true,
        tv_4: true,
      },
      2: {},
    };
    expect(checkedVariablesList).toEqual(expectedCheckedVariablesList);
  });

  it('returns an empty object if there are no athletes', () => {
    const athletes = [];
    const checkedVariablesList = checkedVariables(athletes);
    expect(checkedVariablesList).toEqual({});
  });
});

describe('variablesHashToArray', () => {
  it('returns an array of questionnaire variables when given a questionnaire variable hash', () => {
    const variables = {
      tv_13: true,
      tv_45: true,
      tv_11: true,
      tv_99: false, // Should be filtered out
    };
    const expected = ['tv_13', 'tv_45', 'tv_11'];
    expect(variablesHashToArray(variables)).toEqual(expected);
  });

  it('returns an empty array if the hash is empty or contains only false values', () => {
    const variables1 = {};
    const variables2 = { tv_1: false, tv_2: false };
    expect(variablesHashToArray(variables1)).toEqual([]);
    expect(variablesHashToArray(variables2)).toEqual([]);
  });
});

describe('formatDataForSaving', () => {
  it('returns checked questionnaire variables formatted for saving', () => {
    const variableData = {
      67: {
        tv_11: true,
        tv_24: true,
        tv_53: true,
        tv_99: false, // Should be filtered out
      },
      198: {
        tv_45: true,
        tv_9: true,
      },
      300: {}, // Empty athlete should result in empty array
    };

    const expected = {
      67: ['tv_11', 'tv_24', 'tv_53'],
      198: ['tv_45', 'tv_9'],
      300: [],
    };

    expect(formatDataForSaving(variableData)).toEqual(expected);
  });

  it('returns an empty object if the input is empty', () => {
    expect(formatDataForSaving({})).toEqual({});
  });
});

describe('areAllVariablesFalse', () => {
  it('returns false if there is at least one variable checked for the athlete', () => {
    const athleteVariables = {
      1: false,
      2: true,
      3: false,
    };
    const isAthleteInvalid = areAllVariablesFalse(athleteVariables);
    expect(isAthleteInvalid).toBe(false);
  });

  it('returns true if there are no variables checked for the athlete', () => {
    const athleteVariables = {
      1: false,
      2: false,
      3: false,
    };
    const isAthleteInvalid = areAllVariablesFalse(athleteVariables);
    expect(isAthleteInvalid).toBe(true);
  });

  it('returns true for an empty object', () => {
    expect(areAllVariablesFalse({})).toBe(true);
  });
});

describe('isAthleteAllVariablesUnchecked', () => {
  it('returns true if all variables are unchecked for all athletes', () => {
    const checkedVariablesState = {
      1: {
        tv_1: false,
        tv_2: false,
        tv_3: false,
      },
      2: {
        tv_1: false,
        tv_2: false,
        tv_3: false,
      },
    };
    const isMatrixInvalid = isAthleteAllVariablesUnchecked(
      checkedVariablesState
    );
    expect(isMatrixInvalid).toBe(true);
  });

  it('returns false if at least one athlete has at least one variable checked', () => {
    const checkedVariablesState = {
      1: {
        tv_1: false,
        tv_2: false,
        tv_3: true,
      },
      2: {
        tv_1: false,
        tv_2: true,
        tv_3: false,
      },
    };
    const isMatrixInvalid = isAthleteAllVariablesUnchecked(
      checkedVariablesState
    );
    expect(isMatrixInvalid).toBe(false);
  });

  it('returns false if the input is an empty object', () => {
    // The function checks if there is AT LEAST ONE athlete with all variables unchecked.
    // An empty object has no such athletes, so it should correctly return false.
    expect(isAthleteAllVariablesUnchecked({})).toBe(false);
  });
});

describe('isQuestionnaireEmpty', () => {
  it('returns true if all questionnaire variables are unchecked across all athletes', () => {
    const checkedVariablesState = {
      1: {
        tv_1: false,
        tv_2: false,
        tv_3: false,
      },
      2: {
        tv_1: false,
        tv_2: false,
        tv_3: false,
      },
    };
    const isEmpty = isQuestionnaireEmpty(checkedVariablesState);
    expect(isEmpty).toBe(true);
  });

  it('returns false if at least one questionnaire variable is checked for any athlete', () => {
    const checkedVariablesState = {
      1: {
        tv_1: false,
        tv_2: false,
        tv_3: true,
      },
      2: {
        tv_1: false,
        tv_2: false,
        tv_3: false,
      },
    };
    const isEmpty = isQuestionnaireEmpty(checkedVariablesState);
    expect(isEmpty).toBe(false);
  });

  it('returns true if the input is an empty object', () => {
    expect(isQuestionnaireEmpty({})).toBe(true);
  });
});

describe('formatSquadOptions', () => {
  const squads = [{ id: 1, name: 'Squirtle' }];
  const formattedSquads = squads.map((squad) => ({
    title: squad.name,
    id: squad.id,
  }));

  beforeEach(() => {
    // Reset feature flags before each test
    window.featureFlags = {};
  });

  it('should not return All when FF is on', () => {
    window.featureFlags['manage-forms-default-to-current-squad'] = true;
    expect(formatSquadOptions(squads)).toEqual(formattedSquads);
  });

  it('should return All when FF is off', () => {
    window.featureFlags['manage-forms-default-to-current-squad'] = false;
    expect(formatSquadOptions(squads)).toEqual([
      ...formattedSquads,
      { id: 'all', title: '#sport_specific__All_Squads' },
    ]);
  });
});
