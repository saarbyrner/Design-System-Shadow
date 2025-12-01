/* eslint-disable flowtype/require-valid-file-annotation */

import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import rootReducer from './reducers';

const composeEnhancers = setupReduxDevTools(compose);

export default (initialData) =>
  createStore(
    rootReducer,
    {
      viewType: 'LIST',
      athletes: initialData.athletes,
      assessmentTemplates: initialData.assessmentTemplates,
      organisationTrainingVariables: initialData.organisationTrainingVariables,
      statusVariables: initialData.statusVariables,
      currentSquad: initialData.currentSquad,
      users: initialData.users,
      turnaroundList: initialData.turnaroundList,
      assessments: [],
      appState: {
        assessmentsRequestStatus: null,
        selectedAthlete: null,
        filteredTemplates: [],
        nextAssessmentId: null,
        fetchAssessmentsXHR: null,
      },
      appStatus: {
        status: null,
      },
      toasts: [],
    },
    composeEnhancers(applyMiddleware(...[thunkMiddleware]))
  );
