/* eslint-disable flowtype/require-valid-file-annotation */

import { configureStore } from '@reduxjs/toolkit';
import { isDevEnvironment } from '@kitman/common/src/utils';
import thunkMiddleware from 'redux-thunk';
import { globalApi } from '@kitman/common/src/redux/global/services/globalApi';
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
  addDiagnosticLinkSidePanel: {
    isOpen: false,
    diagnosticId: null,
    athleteId: null,
  },
  addMedicalNotePanel: {
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
  addProcedureSidePanel: {
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
  addConcussionAssessmentSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addTUESidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: false,
    },
  },
  addWorkersCompSidePanel: {
    isOpen: false,
    page: 1,
    submitModal: {
      isOpen: false,
      formState: {},
    },
    showPrintPreview: {
      sidePanel: false,
      card: false,
    },
    claimInformation: {
      personName: null,
      contactNumber: null,
      policyNumber: null,
      lossDate: null,
      lossTime: null,
      lossCity: null,
      lossState: null,
      lossJurisdiction: null,
      lossDescription: null,
      side: null,
      sideName: null,
      bodyArea: null,
      bodyAreaName: null,
    },
    additionalInformation: {
      firstName: null,
      lastName: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zipCode: null,
      phoneNumber: null,
    },
  },
  addOshaFormSidePanel: {
    isOpen: false,
    page: 1,
    showPrintPreview: {
      sidePanel: false,
      card: false,
    },
    initialInformation: {
      issueDate: null,
      reporter: {
        label: null,
        value: null,
      },
      reporterPhoneNumber: null,
      title: null,
    },
    employeeDrInformation: {
      city: null,
      dateHired: null,
      dateOfBirth: null,
      emergencyRoom: false,
      facilityCity: null,
      facilityName: null,
      facilityState: null,
      facilityStreet: null,
      facilityZip: null,
      fullName: null,
      hospitalized: false,
      physicianFullName: null,
      sex: 'M',
      state: null,
      street: null,
      zip: null,
    },
    caseInformation: {
      athleteActivity: null,
      caseNumber: null,
      dateInjured: null,
      dateOfDeath: null,
      issueDescription: null,
      noTimeEvent: false,
      objectSubstance: null,
      timeBeganWork: null,
      timeEvent: null,
      whatHappened: null,
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
