/* eslint-disable flowtype/require-valid-file-annotation */
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { setupReduxDevTools } from '@kitman/common/src/utils';
import i18n from '@kitman/common/src/utils/i18n';
import { ErrorBoundary } from '@kitman/components';
import {
  getActivityGroups,
  getGrades,
  getPositionGroups,
  getSides,
  getInjuryOsics,
  getIllnessOnset,
  getInjuryOnset,
  getInjuryStatuses,
  getIllnessOsicsPathologies,
  getInjuryOsicsPathologies,
  getInjuryOsicsClassifications,
  getIllnessOsicsClassifications,
  getInjuryOsicsBodyAreas,
  getIllnessOsicsBodyAreas,
  getCurrentAssociation,
} from '@kitman/services';
import App from './src/containers/App';
import {
  getBlankNote,
  getModalState,
  buildIssueState,
  getDefaultIssueState,
} from './src/utils';
import {
  ModalData,
  IssueData,
  CurrentNote,
  staticData,
  AppStatus,
} from './src/reducer';

// setup Redux dev tools
const middlewares = [thunkMiddleware];
const composeEnhancers = setupReduxDevTools(compose);
// setup state tree
const StateTree = combineReducers({
  ModalData,
  IssueData,
  CurrentNote,
  staticData,
  AppStatus,
});

const getStore = (IssueDataState, ModalDataState, bamicGrades, injuryOsics) =>
  createStore(
    StateTree,
    {
      ModalData: ModalDataState,
      IssueData: IssueDataState,
      CurrentNote: getBlankNote(),
      staticData: {
        bamicGrades,
        injuryOsics,
      },
      AppStatus,
    },
    composeEnhancers(applyMiddleware(...middlewares))
  );

const renderAthleteIssueEditor = (store, hideLoadingAnimation) => {
  hideLoadingAnimation('js-athleteInjuryEditLoader');

  ReactDOM.render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </I18nextProvider>
    </Provider>,
    document.getElementById('athleteIssueEditorContainer')
  );
};

const initAthleteIssueEditor = (
  formMode,
  formType,
  athlete,
  issueId,
  hideLoadingAnimation
) => {
  if (formMode === 'EDIT') {
    const url =
      formType === 'INJURY'
        ? `/athletes/${athlete.id}/injuries/${issueId}`
        : `/athletes/${athlete.id}/illnesses/${issueId}`;
    Promise.all([
      $.getJSON(url),
      getPositionGroups(),
      getSides(),
      getInjuryOsicsPathologies(),
      getIllnessOsicsPathologies(),
      getInjuryOsicsClassifications(),
      getIllnessOsicsClassifications(),
      getInjuryOsicsBodyAreas(),
      getIllnessOsicsBodyAreas(),
      getCurrentAssociation(),
      getInjuryOnset(),
      getIllnessOnset(),
      getActivityGroups(),
      getGrades(),
      getInjuryStatuses(),
      getInjuryOsics(),
    ]).then(
      ([
        issueData,
        positionGroups,
        sides,
        injuryOsicsPathologies,
        illnessOsicsPathologies,
        injuryOsicsClassifications,
        illnessOsicsClassifications,
        injuryOsicsBodyAreas,
        illnessOsicsBodyAreas,
        association,
        injuryOnset,
        illnessOnset,
        activityGroups,
        bamicGrades,
        injuryStatuses,
        injuryOsics,
      ]) => {
        const IssueDataState = buildIssueState(issueData, formType);
        const ModalDataState = getModalState(
          formMode,
          formType,
          athlete,
          IssueDataState,
          [],
          positionGroups,
          sides,
          injuryOsicsPathologies,
          illnessOsicsPathologies,
          injuryOsicsClassifications,
          illnessOsicsClassifications,
          injuryOsicsBodyAreas,
          illnessOsicsBodyAreas,
          association.periods || [],
          association.period_term,
          injuryOnset,
          illnessOnset,
          activityGroups,
          injuryStatuses
        );

        const store = getStore(
          IssueDataState,
          ModalDataState,
          bamicGrades,
          injuryOsics
        );
        renderAthleteIssueEditor(store, hideLoadingAnimation);
      },
      () => {} // TODO: handle failure
    );
  } else {
    Promise.all([
      $.getJSON(`/athletes/${athlete.id}/injuries/new`),
      getPositionGroups(),
      getSides(),
      getInjuryOsicsPathologies(),
      getIllnessOsicsPathologies(),
      getInjuryOsicsClassifications(),
      getIllnessOsicsClassifications(),
      getInjuryOsicsBodyAreas(),
      getIllnessOsicsBodyAreas(),
      getCurrentAssociation(),
      getInjuryOnset(),
      getIllnessOnset(),
      getActivityGroups(),
      getGrades(),
      getInjuryStatuses(),
      getInjuryOsics(),
    ]).then(
      ([
        priorIssues,
        positionGroups,
        sides,
        injuryOsicsPathologies,
        illnessOsicsPathologies,
        injuryOsicsClassifications,
        illnessOsicsClassifications,
        injuryOsicsBodyAreas,
        illnessOsicsBodyAreas,
        association,
        injuryOnset,
        illnessOnset,
        activityGroups,
        bamicGrades,
        injuryStatuses,
        injuryOsics,
      ]) => {
        const IssueDataState = getDefaultIssueState(
          athlete.id,
          athlete.modification_info
        );
        const ModalDataState = getModalState(
          formMode,
          formType,
          athlete,
          IssueDataState,
          priorIssues,
          positionGroups,
          sides,
          injuryOsicsPathologies,
          illnessOsicsPathologies,
          injuryOsicsClassifications,
          illnessOsicsClassifications,
          injuryOsicsBodyAreas,
          illnessOsicsBodyAreas,
          association.periods || [],
          association.period_term,
          injuryOnset,
          illnessOnset,
          activityGroups,
          injuryStatuses
        );

        const store = getStore(
          IssueDataState,
          ModalDataState,
          bamicGrades,
          injuryOsics
        );
        renderAthleteIssueEditor(store, hideLoadingAnimation);
      },
      () => {} // TODO: handle failure
    );
  }
};

// Export init function to be able to init the app on demand
export default initAthleteIssueEditor;
