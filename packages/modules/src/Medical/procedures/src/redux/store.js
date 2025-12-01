/* eslint-disable flowtype/require-valid-file-annotation */

import { configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';

import { isDevEnvironment } from '@kitman/common/src/utils';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
import { medicalApi } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import { medicalSharedApi } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import rootReducer from '@kitman/modules/src/Medical/procedures/src/redux/reducers';

const initialStore = {
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
