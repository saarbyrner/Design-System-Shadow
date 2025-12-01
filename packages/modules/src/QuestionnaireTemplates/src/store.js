/* eslint-disable flowtype/require-valid-file-annotation */
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import templatesToMap from './utils';
import {
  templates,
  modals,
  appStatus,
  reminderSidePanel,
  dialogues,
  filters,
  sorting,
} from './reducer';

// setup Redux dev tools
const middlewares = [thunkMiddleware];
const composeEnhancers = setupReduxDevTools(compose);

const StateTree = combineReducers({
  templates,
  modals,
  appStatus,
  reminderSidePanel,
  dialogues,
  filters,
  sorting,
});

export default (templatesData, defaultTimeZone) =>
  createStore(
    StateTree,
    {
      templates: templatesToMap(templatesData),
      modals: {
        addTemplateVisible: false,
        renameTemplateVisible: false,
        duplicateTemplateVisible: false,
        templateName: null,
      },
      appStatus: {
        status: null,
      },
      dialogues: {
        delete: {
          isVisible: false,
          templateId: null,
        },
        activate: {
          isVisible: false,
          templateId: null,
        },
      },
      reminderSidePanel: {
        templateId: null,
        isOpen: false,
        notifyAthletes: false,
        scheduledTime: null,
        localTimeZone: defaultTimeZone,
      },
      filters: {
        searchText: '',
        searchStatus: '',
        searchScheduled: '',
      },
      sorting: {
        column: 'status',
        direction: 'desc',
      },
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );
