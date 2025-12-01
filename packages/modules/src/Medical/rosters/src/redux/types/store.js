// @flow
import type {
  SecondaryPathology,
  Coding,
} from '@kitman/common/src/types/Coding';
import type { Toast } from '@kitman/components/src/types';
import type { Question as QuestionType } from '@kitman/common/src/types/Issues';
import type { DuplicateTreatmentSession } from '@kitman/modules/src/Medical/shared/components/AddTreatmentSidePanel/types';
import type { MedicalNote } from '@kitman/modules/src/Medical/shared/types/medical';
import type { MedicalHistories } from '@kitman/services/src/services/getAthleteMedicalHistory';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import type { MultiCodingV2Pathology } from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type { GridRow as CommentsGridRow } from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/types';
import type {
  Column,
  IssueAttachments,
  GridRow,
  RosterFilters,
} from '../../../types';
import type {
  ConditionalFieldAnswer,
  GameEventOption,
  RequestStatus,
  TrainingSessionEventOption,
  ConcussionTestProtocol,
} from '../../../../shared/types';

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
      athlete: number,
      athleteData: AthleteData,
      diagnosisDate: string,
      reportedDate: string,
      initialNote: string,
      issueId: number,
      previousIssueId: number,
      squadId: string,
      isAthleteSelectable: boolean,
      recurrenceOutsideSystem: boolean,
    },
    diagnosisInfo: {
      enteredSupplementalPathology: string,
      supplementalPathology: string,
      examinationDate: string,
      onset: string,
      onsetDescription: string,
      onsetFreeText: string,
      side: string,
      statuses: Array<{ status: string, date: string }>,
      relatedChronicIssues: Array<string>,
      concussion_assessments: Array<number>,
      coding: Coding,
      supplementaryCoding: Coding,
      isBamic: boolean,
      bamicSite: number,
      bamicGrade: number,
      secondary_pathologies: Array<SecondaryPathology>,
      selectedCodingSystemPathology: ?MultiCodingV2Pathology,
    },
    eventInfo: {
      diagnosisDate: string,
      event: string,
      events: {
        games: Array<GameEventOption>,
        sessions: Array<TrainingSessionEventOption>,
      },
      eventType: string,
      sessionCompleted: string,
      timeOfInjury: string,
      mechanismDescription: string,
      presentationTypeId: number,
      presentationTypeFreeText: string,
      issueContactType: number,
      issueContactFreetext: string,
      injuryMechanismId: number,
      injuryMechanismFreetext: string,
      primaryMechanismFreetext: string,
    },
    additionalInfo: {
      annotations: Array<IssueAttachments>,
      conditionalFieldsAnswers: Array<ConditionalFieldAnswer>,
      untransformedFiles: Array<File>,
      requestStatus: RequestStatus,
      questions: Array<QuestionType>,
      linkedIssues: {
        injuries: Array<number>,
        illness: Array<number>,
      },
    },
    page: number,
    pathologyGroupRequestStatus: RequestStatus,
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
  addConcussionTestResultsSidePanel: {
    isOpen: boolean,
    initialInfo: {
      testProtocol: ConcussionTestProtocol,
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
  app: {
    requestStatus: RequestStatus,
  },
  grid: {
    columns: Array<Column>,
    next_id?: number,
    current_id: number | null,
    rows: Array<GridRow>,
  },
  commentsGrid: {
    columns?: Array<Column>,
    next_id?: number,
    rows: Array<CommentsGridRow>,
  },
  commentsFilters: RosterFilters,
  filters: RosterFilters,
  toasts: Array<Toast>,
  medicalHistory: {
    [id: string]: MedicalHistories,
  },
};
