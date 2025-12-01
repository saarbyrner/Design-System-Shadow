// @flow
import $ from 'jquery';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { data as mockedDiagnostics } from '@kitman/services/src/mocks/handlers/medical/getDiagnostics';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { IssueType } from '../types';

type AthleteIssue = IssueOccurrenceRequested & {};

const mockedEnhancedOsics = {
  osics_pathology: 'Ankle Fracture',
  osics_classification: 'Fracture',
  osics_body_area: 'Ankle',
};
const mockedEnhancedInjuryStatus = {
  injury_status: {
    id: 1,
    description: 'Causing unavailability (time-loss)',
    cause_unavailability: true,
    restore_availability: false,
  },
  created_by: {
    id: 9876,
    fullname: 'Bob Sacamano',
  },
  updated_at: '2018-08-29T15:53:17+01:00',
};
const mockedEnhancedIssue = {
  side: 'Right',
  bamic_grade: {
    grade: '2',
    name: 'Grade 2',
  },
  bamic_site: {
    site: 'b',
    name: 'b - myotendinous / muscular',
  },
  onset: 'Acute',
};
const mockedEnhancedGame = {
  event: {
    competition: {
      id: 1,
      name: 'Champions League',
    },
    opponent_score: 1,
    opponent_team: {
      id: 1,
      name: 'Chelsea',
    },
    score: 2,
    type: 'game_event',
    venue_type: {
      id: 2,
      name: 'Away',
    },
  },
};
export const mockedConditionalFields = [
  {
    id: 1,
    parent_rule_id: null,
    question: 'Did he do a sufficient warm up prior?',
    question_type: 'multiple-choice',
    question_metadata: [
      { value: 'Yes', order: 1 },
      { value: 'No', order: 2 },
    ],
    order: 1,
    answer: { value: 'Yes' },
  },
  {
    id: 2,
    parent_rule_id: 1,
    question: 'Which exercises?',
    question_type: 'multiple-choice',
    question_metadata: [
      { value: 'Nordic', order: 1 },
      { value: 'Leg Curl', order: 2 },
    ],
    order: 2,
    answer: { value: 'Nordic' },
  },
];
const mockedICDCoding = {
  [codingSystemKeys.ICD]: {
    id: 123,
    code: 'S92',
    diagnosis: 'Fracture of foot and toe, except ankle',
    body_part: null,
    pathology_type: null,
    side: null,
  },
};
const mockedDATALYSCoding = {
  [codingSystemKeys.DATALYS]: {
    id: 123,
    code: 'S92',
    pathology: 'Fracture of foot and toe, except ankle',
    datalys_body_area: null,
    datalys_classification: null,
    datalys_tissue_type: null,
    side_id: null,
    side: null,
  },
};
const mockedCICoding = {
  [codingSystemKeys.CLINICAL_IMPRESSIONS]: {
    id: 123,
    code: 'S92',
    pathology: 'Fracture of foot and toe, except ankle',
    clinical_impression_body_area: null,
    clinical_impression_classification: null,
    side_id: null,
    side: null,
    secondary_pathologies: [
      {
        id: null,
        record: {
          id: 2993,
          code: '338201',
          pathology: 'Man gets hit by football',
          clinical_impression_body_area: 'Urogenital/Anogenital',
          clinical_impression_body_area_id: 27,
          clinical_impression_classification: 'Gen Stress',
          clinical_impression_classification_id: 10,
        },
        side: 1,
      },
    ],
  },
};
const mockedOSICSCoding = {
  [codingSystemKeys.OSICS_10]: {
    osics_id: 'WUPM',
    osics_pathology_id: 1394,
    osics_classification_id: 9,
    osics_body_area_id: 20,
    icd: 'NC54',
    side_id: 2,
    ...mockedEnhancedOsics,
  },
};
export const mockedIssue = {
  id: 3,
  activity: 'Being tackled',
  activity_id: 9,
  activity_type: 'game',
  occurrence_date: '2022-01-13T00:00:00+00:00',
  examination_date: '2022-02-09T00:00:00+00:00',
  association_period_id: null,
  occurrence_min: 223,
  training_session: null,
  training_session_id: null,
  game: mockedEnhancedGame,
  game_id: 47576,
  position_when_injured: 'Quarterback',
  position_when_injured_id: 72,
  session_completed: false,
  created_by: 'Hugo Beuzeboc',
  created_at: '2022-02-10T15:42:39+00:00',
  closed: true,
  supplementary_pathology: null,
  events: [
    {
      id: 4,
      injury_status_id: 2,
      event_date: '2022-01-13T00:00:00+00:00',
      date: '2022-01-13T00:00:00+00:00',
      ...mockedEnhancedInjuryStatus,
    },
    {
      id: 6,
      injury_status_id: 1,
      event_date: '2022-02-10T00:00:00+00:00',
      date: '2022-02-10T00:00:00+00:00',
      ...mockedEnhancedInjuryStatus,
    },
    {
      id: 7,
      injury_status_id: 3,
      event_date: '2022-02-11T00:00:00+00:00',
      date: '2022-02-11T00:00:00+00:00',
      ...mockedEnhancedInjuryStatus,
    },
  ],
  is_first_occurrence: true,
  is_last_occurrence: true,
  athlete_id: 15642,
  osics: mockedOSICSCoding[codingSystemKeys.OSICS_10],
  side_id: 2,
  bamic_grade_id: null,
  bamic_site_id: null,
  issue_id: 72632,
  type_id: 4,
  has_recurrence: false,
  events_order: [4, 6, 7],
  diagnostics: [mockedDiagnostics.diagnostics],
  notes: [
    {
      id: 1224591,
      date: '2022-02-10T15:42:39+00:00',
      note: 'Mocked note',
      created_by: 'John Doe',
      restricted: false,
      psych_only: false,
    },
  ],
  modification_info: 'sdf',
  total_duration: 29,
  unavailability_duration: 1,
  events_duration: { '4': 28, '6': 1, '7': 3 },
  treatment_sessions: [],
  rehab_sessions: [],
  ...mockedEnhancedIssue,
  conditional_questions: mockedConditionalFields,
  coding: mockedOSICSCoding,
  constraints: {
    read_only: false,
  },
  extended_attributes: [],
};

export const mockedIssueWithICD = {
  ...mockedIssue,
  osics: null,
  coding: mockedICDCoding,
};

export const mockedIssueWithDATALYS = {
  ...mockedIssue,
  osics: null,
  coding: mockedDATALYSCoding,
};
export const mockedIssueWithClinicalImpressions = {
  ...mockedIssue,
  osics: null,
  coding: mockedCICoding,
};

const getAthleteIssue = (
  athleteId: number,
  issueId: number,
  issueType: IssueType
): Promise<AthleteIssue> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url:
        issueType === 'Injury'
          ? `/athletes/${athleteId}/injuries/${issueId}`
          : `/athletes/${athleteId}/illnesses/${issueId}`,
      data: { scope_to_org: true, detailed: true },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getAthleteIssue;
