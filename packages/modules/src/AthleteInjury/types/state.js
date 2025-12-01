// @flow
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { DropdownItem } from '@kitman/components/src/types';
import type { Note, Osics } from '@kitman/common/src/types/Issues';
import type {
  Pathologies,
  Classifications,
  BodyAreas,
} from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type {
  IssueStatusEvent,
  Onset,
  PriorIssues,
  BamicGrades,
} from './_common';

export type IssueDataState = {
  id: number,
  activity_id: number,
  activity_type: string,
  occurrence_date: string,
  occurrence_min: number,
  training_session_id: string,
  game_id: string,
  position_when_injured_id: string,
  session_completed: boolean,
  created_by: $PropertyType<Athlete, 'firstname'>,
  events: { [$PropertyType<IssueStatusEvent, 'id'>]: IssueStatusEvent },
  athlete_id: $PropertyType<Athlete, 'id'>,
  osics: Osics,
  body_side_id: number,
  type_id: number,
  events_order: Array<$PropertyType<IssueStatusEvent, 'id'>>,
  notes: Array<Note>,
  modification_info: string,
  supplementary_pathology: string,
  total_duration: number,
  unavailability_duration: number,
  events_duration: { [$PropertyType<IssueStatusEvent, 'id'>]: number },
  prior_resolved_date?: ?string,
};

export type ModalDataState = {
  athleteId: $PropertyType<Athlete, 'id'>,
  athleteName: $PropertyType<Athlete, 'firstname'>,
  athletePositionId: $PropertyType<Athlete, 'position'>,
  osicsPathologyOptions: Array<DropdownItem>,
  osicsClassificationOptions: Array<DropdownItem>,
  bodyAreaOptions: Array<DropdownItem>,
  sideOptions: Array<DropdownItem>,
  issueTypeOptions: Array<DropdownItem>,
  activityGroupOptions: Array<DropdownItem>,
  gameOptions: Array<DropdownItem>,
  trainingSessionOptions: Array<DropdownItem>,
  positionGroupOptions: Array<DropdownItem>,
  injuryStatusOptions: Array<DropdownItem>,
  initialInjuryOccurrenceEventsOrder: Array<string>,
  formMode: 'EDIT' | 'CREATE',
  formType: 'INJURY' | 'ILLNESS',
  isFetchingGameAndTrainingOptions?: boolean,
  isFetchingIssueDetails?: boolean,
  priorIssues: PriorIssues,
  priorInjuryOptions: Array<DropdownItem>,
  priorIllnessOptions: Array<DropdownItem>,
  staticData: {
    injuryOsicsPathologies: Pathologies,
    illnessOsicsPathologies: Pathologies,
    injuryOsicsClassifications: Classifications,
    illnessOsicsClassifications: Classifications,
    injuryOsicsBodyAreas: BodyAreas,
    illnessOsicsBodyAreas: BodyAreas,
    injuryOnsets: Array<Onset>,
    illnessOnsets: Array<Onset>,
  },
};

export type AppStatusState = {
  status?: string,
  message?: string,
};

export type StaticDataState = {
  bamicGrades: BamicGrades,
};
