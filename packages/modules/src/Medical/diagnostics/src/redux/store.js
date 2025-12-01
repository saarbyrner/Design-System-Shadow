/* eslint-disable flowtype/require-valid-file-annotation */

import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import thunkMiddleware from 'redux-thunk';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import rootReducer from '@kitman/modules/src/Medical/diagnostics/src/redux/reducers';

const initialStore = {
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
  addDiagnosticSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: false,
    },
  },
  addMedicalNotePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },

  toasts: [],
  medicalHistory: {},
};

export default configureStore({
  reducer: rootReducer,
  preloadedState: initialStore,
  devTools: isDevEnvironment(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      thunkMiddleware,
      globalApi.middleware,
      medicalApi.middleware,
      medicalSharedApi.middleware,
    ]),
});
