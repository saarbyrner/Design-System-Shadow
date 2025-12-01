// @flow
import type { Toast } from '@kitman/components/src/types';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { DuplicateTreatmentSession } from '@kitman/modules/src/Medical/shared/components/AddTreatmentSidePanel/types';
import type { MedicalHistories } from '@kitman/services/src/services/getAthleteMedicalHistory';
import type { DiagnosisAttachments } from '@kitman/modules/src/Medical/rosters/types';
import type {
  GameEventOption,
  TrainingSessionEventOption,
  ConcussionTestProtocol,
} from '@kitman/modules/src/Medical/shared/types';

export type Store = {
  addDiagnosticSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addDiagnosticAttachmentSidePanel: {
    isOpen: boolean,
    diagnosticId: number,
    athleteId: number,
  },
  addDiagnosticLinkSidePanel: {
    isOpen: boolean,
    diagnosticId: number,
    athleteId: number,
  },
  addIssuePanel: {
    isOpen: boolean,
    initialInfo: {
      type: string,
      athlete: string,
      diagnosisDate: string,
      reportedDate: string,
      initialNote: string,
      attachments: Array<DiagnosisAttachments>,
      squadId: string,
      isAthleteSelectable: boolean,
    },
    diagnosisInfo: {
      pathology: number,
      supplementalPathology: string,
      classification: number,
      bodyArea: number,
      osicsCode: number,
      icdCode: number,
      examinationDate: string,
      onset: string,
      onsetDescription: string,
      side: string,
      statuses: Array<{ status: string, date: string }>,
      coding: {},
      supplementaryCoding: {},
    },
    eventInfo: {
      diagnosisDate: string,
      event: string,
      events: {
        games: Array<GameEventOption>,
        sessions: Array<TrainingSessionEventOption>,
      },
      sessionCompleted: string,
      timeOfInjury: string,
    },
    additionalInfo: {
      annotations: Array<DiagnosisAttachments>,
    },
    page: number,
  },
  addMedicalNotePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
      isDuplicatingNote: boolean,
      duplicateNote?: ?MedicalNote,
    },
  },
  addModificationSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addTreatmentsSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
      isDuplicatingTreatment: boolean,
      duplicateTreatment?: ?DuplicateTreatmentSession,
    },
  },
  addVaccinationSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addAllergySidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addMedicalAlertSidePanel: {
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
  addProcedureSidePanel: {
    isOpen: boolean,
    initialInfo: {
      isAthleteSelectable: boolean,
    },
  },
  addProcedureAttachmentSidePanel: {
    isOpen: boolean,
    procedureId: number,
    athleteId: number,
  },
  addConcussionTestResultsSidePanel: {
    isOpen: boolean,
    initialInfo: {
      testProtocol: ConcussionTestProtocol,
      isAthleteSelectable: boolean,
    },
  },
  addTUESidePanel: {
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
  toasts: Array<Toast>,
  medicalHistory: {
    [id: string]: MedicalHistories,
  },
};
