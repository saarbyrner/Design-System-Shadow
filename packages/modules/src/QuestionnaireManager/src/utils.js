// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { QuestionnaireVariable } from '@kitman/common/src/types';

export const checkedVariables = (athletes: Array<Athlete>) => {
  const checked = {};

  athletes.forEach((athlete: Athlete) => {
    checked[athlete.id] = {};
    // if athlete has variables
    if (athlete.variable_ids) {
      athlete.variable_ids.forEach((variableId) => {
        checked[athlete.id][variableId] = true;
      });
    } else {
      checked[athlete.id] = {};
    }
  });

  return checked;
};

export const convertAthletesToIdArray = (athletes: Object) => {
  const athleteIds = [];
  Object.keys(athletes).forEach((positionGroup) => {
    athletes[positionGroup].forEach((athlete) => {
      athleteIds.push(athlete.id);
    });
  });

  return athleteIds;
};

export const convertQuestionnaireVariablesToIdArray = (
  variables: Array<QuestionnaireVariable>
) => {
  const variablesIdArray = [];
  variables.forEach((variable) => {
    variablesIdArray.push(variable.id.toString());
  });

  return variablesIdArray;
};

export const convertHashMapToRadioOptionsArray = (hash: Object) => {
  const array = [];
  Object.keys(hash).forEach((key) => {
    array.push({
      name: hash[key],
      value: key,
    });
  });

  return array;
};

export const variablesHashToArray = (variables: {
  string: boolean,
}): Array<string> =>
  Object.keys(variables).filter((variableId) => variables[variableId] === true);

// formats the checked variable format for saving
export const formatDataForSaving = (variableData: {
  [string]: { [string]: boolean },
}) => {
  const formattedCheckedVariables = {};
  Object.keys(variableData).forEach((athleteId) => {
    formattedCheckedVariables[athleteId] = variablesHashToArray(
      variableData[athleteId]
    );
  });
  return formattedCheckedVariables;
};

export const areAllVariablesFalse = (athleteVariables: { [any]: boolean }) => {
  const variableIds = Object.keys(athleteVariables);
  for (let i = 0; i < variableIds.length; i++) {
    const key = variableIds[i];
    // we found one variable that is checked, so we're ok here, get out
    if (athleteVariables[key] === true) {
      return false;
    }
  }
  return true;
};

export const isAthleteAllVariablesUnchecked = (checkedVariablesState: {
  [string]: { [any]: boolean },
}) => {
  const athleteIdArray = Object.keys(checkedVariablesState);
  /*
   * Check all athletes if they have at least one variable checked.
   * If we find one, stop the loop, matrix is invalid anyway.
   */
  for (let i = 0; i < athleteIdArray.length; i++) {
    const athleteId = athleteIdArray[i];
    const athleteVars = checkedVariablesState[athleteId];
    if (areAllVariablesFalse(athleteVars)) {
      return true;
    }
  }
  return false;
};

export const formatSquadOptions = (
  squads: Array<{ id: number | string, name: string }>
): Array<Object> => {
  const formattedOptions = squads;
  if (!window.featureFlags['manage-forms-default-to-current-squad']) {
    formattedOptions.push({
      id: 'all',
      name: i18n.t('#sport_specific__All_Squads'),
    });
  }

  return formattedOptions.map((squad) => ({
    title: squad.name,
    id: squad.id,
  }));
};

export const isQuestionnaireEmpty = (checkedVariablesState: {
  [string]: { [any]: boolean },
}) => {
  const athleteIdArray = Object.keys(checkedVariablesState);
  /*
   * Check all athletes if they have at least one variable checked.
   * If we find one, stop the loop, matrix is invalid anyway.
   */
  for (let i = 0; i < athleteIdArray.length; i++) {
    const athleteId = athleteIdArray[i];
    const athleteVars = checkedVariablesState[athleteId];
    if (areAllVariablesFalse(athleteVars) === false) {
      return false;
    }
  }
  return true;
};
