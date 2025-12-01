/* eslint-disable flowtype/require-valid-file-annotation */
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import globalApiMiddleware from '@kitman/common/src/redux/global/middleware';
import {
  groupAthletesByName,
  groupAthletesByPosition,
  groupAthletesByPositionGroup,
  groupAthletesByAvailability,
  groupAthletesByScreening,
  getDefaultGroupBy,
  setupReduxDevTools,
  getFilteredAthletes,
} from '@kitman/common/src/utils';
import StateTree from './state-tree-setup';
import {
  checkedVariables,
  convertHashMapToRadioOptionsArray,
  formatSquadOptions,
} from './utils';

// setup Redux logging and Redux dev tools
const middlewares = [thunkMiddleware, ...globalApiMiddleware];
const composeEnhancers = setupReduxDevTools(compose);

export default ({
  athletes,
  variablePlatforms,
  squads,
  groupingLabels,
  variables,
  variablesByPlatform,
  template,
  squadFilter = null,
}) => {
  // group athletes
  const groupedAthletes = {
    position: groupAthletesByPosition(athletes),
    positionGroup: groupAthletesByPositionGroup(athletes),
    availability: groupAthletesByAvailability(athletes),
    last_screening: groupAthletesByScreening(athletes),
    name: groupAthletesByName(athletes),
  };

  const firstPlatform = Object.keys(variablePlatforms)[0];

  const groupBy = getDefaultGroupBy();

  return createStore(
    StateTree,
    {
      athletes: {
        all: athletes,
        grouped: groupedAthletes,
        currentlyVisible: getFilteredAthletes(groupedAthletes[groupBy], ''),
        groupBy,
        searchTerm: '',
        squadFilter,
      },
      squadOptions: {
        squads: formatSquadOptions(squads),
      },
      groupingLabels,
      variables: {
        byId: variables,
        byPlatform: variablesByPlatform,
        currentlyVisible: variablesByPlatform
          ? variablesByPlatform[firstPlatform]
          : null,
        selectedPlatform: firstPlatform,
      },
      checkedVariables: checkedVariables(athletes),
      variablePlatforms: convertHashMapToRadioOptionsArray(variablePlatforms),
      modal: {
        status: null,
        message: null,
      },
      templateData: template,
      templateNames: [],
      dialogues: {},
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );
};
