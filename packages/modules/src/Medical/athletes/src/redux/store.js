/* eslint-disable flowtype/require-valid-file-annotation */
import { configureStore } from '@reduxjs/toolkit';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { isDevEnvironment } from '@kitman/common/src/utils';
import thunkMiddleware from 'redux-thunk';
import { formAnswerSetsApi } from '@kitman/services/src/services/formAnswerSets';
import getDefaultAddIssuePanelStore from '@kitman/modules/src/Medical/shared/redux/stores/addIssuePanel';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import rootReducer from './reducers';

const initialStore = {
  addDiagnosticSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addDiagnosticAttachmentSidePanel: {
    isOpen: false,
    diagnosticId: null,
    athleteId: null,
  },
  addDiagnosticLinkSidePanel: {
    isOpen: false,
    diagnosticId: null,
    athleteId: null,
  },
  addIssuePanel: getDefaultAddIssuePanelStore(),
  addMedicalNotePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addModificationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addTreatmentsSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addAllergySidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addMedicalAlertSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addMedicationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addProcedureSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addProcedureAttachmentSidePanel: {
    isOpen: false,
    procedureId: null,
    athleteId: null,
  },
  addVaccinationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addConcussionTestResultsSidePanel: {
    isOpen: false,
    initialInfo: {
      testProtocol: 'NPC',
      isAthleteSelectable: true,
    },
  },
  addTUESidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  selectAthletesSidePanel: {
    isOpen: false,
  },
  treatmentCardList: {
    athleteTreatments: {},
    invalidEditTreatmentCards: [],
  },
  toasts: [],
  medicalHistory: {},
  formAnswerSetsApi: {},
};

export default configureStore({
  reducer: rootReducer,
  preloadedState: initialStore,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      /**
       * Raw files(unserializable) passed to the Redux Store is highly discouraged.
       * Can "break the ability to persist and rehydrate the contents of a store,
       * as well as interfere with time-travel debugging." source on next line
       * https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state
       * Implementation to ignore the warning with source below
       * https://redux-toolkit.js.org/api/serializabilityMiddleware
       *
       */
      serializableCheck: {
        // Ignore these action types
        // ignoredActions: ['ADD_ACTIONS_HERE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.files'],
        // Ignore these paths in the state
        ignoredPaths: ['addIssuePanel.additionalInfo.annotations'],
      },
    }).concat([
      thunkMiddleware,
      medicalApi.middleware,
      globalApi.middleware,
      medicalSharedApi.middleware,
      formAnswerSetsApi.middleware,
    ]),
});
