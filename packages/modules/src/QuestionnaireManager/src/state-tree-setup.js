/* eslint-disable flowtype/require-valid-file-annotation */
import { combineReducers } from 'redux';
import globalApiReducer from '@kitman/common/src/redux/global/reducers';
import athletes from '@kitman/common/src/reducers/athletes_reducer';
import dialogues from '@kitman/common/src/reducers/dialogues';
import {
  variables,
  checkedVariables,
  variablePlatforms,
  groupingLabels,
  templateData,
  templateNames,
  squadOptions,
} from './reducer';
import modal from './reducers/modal';

const StateTree = combineReducers({
  athletes,
  variables,
  checkedVariables,
  variablePlatforms,
  groupingLabels,
  modal,
  templateData,
  templateNames,
  squadOptions,
  dialogues,
  globalApi: globalApiReducer.globalApi,
});

export default StateTree;
