// @flow
import type { Toast } from '@kitman/components/src/types';
import type { WorkersCompSubmitPayload } from '@kitman/services/src/services/medical/submitWorkersComp';
import type { ConcussionTestProtocol } from '@kitman/modules/src/Medical/shared/types';

export type Store = {
  addDiagnosticSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addDiagnosticLinkSidePanel: {
    isOpen: boolean,
    diagnosticId: number,
    athleteId: number,
  },
  addMedicalNotePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addModificationSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addMedicationSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addTreatmentsSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addConcussionTestResultsSidePanel: {
    isOpen: boolean,
    initialInfo: {
      testProtocol: ConcussionTestProtocol,
      isAthleteSelectable: boolean,
    },
  },
  addConcussionAssessmentSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  selectAthletesSidePanel: {
    isOpen: boolean,
  },
  treatmentCardList: {
    athleteTreatments: {},
    invalidEditTreatmentCards: Array<string>,
  },
  addWorkersCompSidePanel: {
    isOpen: boolean,
    page: number,
    submitModal: {
      isOpen: boolean,
      formState: WorkersCompSubmitPayload,
    },
    showPrintPreview: {
      sidePanel: boolean,
      card: boolean,
    },
    claimInformation: {
      personName: { value: number, label: string },
      contactNumber: string,
      policyNumber: string,
      lossDate: string,
      lossTime: string,
      lossCity: string,
      lossState: string,
      lossJurisdiction: string,
      lossDescription: string,
      side: number,
      sideName: string,
      bodyArea: number,
      bodyAreaName: string,
    },
    additionalInformation: {
      firstName: string,
      lastName: string,
      address1: string,
      address2: string,
      city: string,
      state: string,
      zipCode: string,
      phoneNumber: string,
    },
  },
  addOshaFormSidePanel: {
    isOpen: boolean,
    page: number,
    showPrintPreview: {
      sidePanel: boolean,
      card: boolean,
    },
    initialInformation: {
      issueDate: string,
      reporter: {
        label: string,
        value: number,
      },
      reporterPhoneNumber: string,
      title: string,
    },
    employeeDrInformation: {
      city: string,
      dateHired: string,
      dateOfBirth: string,
      emergencyRoom: false,
      facilityCity: string,
      facilityName: string,
      facilityState: string,
      facilityStreet: string,
      facilityZip: string,
      fullName: string,
      hospitalized: false,
      physicianFullName: string,
      sex: string,
      state: string,
      street: string,
      zip: string,
    },
    caseInformation: {
      athleteActivity: string,
      caseNumber: string,
      dateInjured: string,
      dateOfDeath: string,
      issueDescription: string,
      noTimeEvent: boolean,
      objectSubstance: string,
      timeBeganWork: string,
      timeEvent: string,
      whatHappened: string,
    },
  },
  toasts: Array<Toast>,
};
