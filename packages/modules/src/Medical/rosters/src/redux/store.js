/* eslint-disable flowtype/require-valid-file-annotation */

import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import thunkMiddleware from 'redux-thunk';
import { userMovementApi } from '@kitman/modules/src/UserMovement/shared/redux/services';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { conditionalFieldsApi } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import { formAnswerSetsApi } from '@kitman/services/src/services/formAnswerSets';
import rootReducer from './reducers';
import getDefaultAddIssuePanelStore from '../../../shared/redux/stores/addIssuePanel';
import { medicalApi } from '../../../shared/redux/services/medical';
import { medicalSharedApi } from '../../../shared/redux/services/medicalShared';

export const initialStore = {
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
  addProcedureSidePanel: {
    isOpen: false,
    initialInfo: {
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
  app: {
    requestStatus: 'PENDING',
  },
  grid: {
    columns: [],
    current_id: null,
    next_id: null,
    rows: [],
  },
  commentsGrid: {
    columns: [],
    next_id: null,
    rows: [],
  },
  filters: {
    athlete_name: '',
    positions: [],
    squads: [],
    availabilities: [],
    issues: [],
  },
  commentsFilters: {
    athlete_name: '',
    positions: [],
    squads: [],
    availabilities: [],
    issues: [],
  },
  toasts: [],
  medicalToasts: { value: [] }, // Appended to from slice actions
  medicalHistory: {},
  medicalApi: {},
  medicalSharedApi: {},
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
      userMovementApi.middleware,
      thunkMiddleware,
      globalApi.middleware,
      medicalApi.middleware,
      medicalSharedApi.middleware,
      conditionalFieldsApi.middleware,
      formAnswerSetsApi.middleware,
    ]),
});
