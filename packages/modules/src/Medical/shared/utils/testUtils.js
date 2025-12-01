// @flow
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { defaultConcussionPermissions } from '@kitman/common/src/contexts/PermissionsContext/concussion';

export const defaultMedicalPermissions =
  DEFAULT_CONTEXT_VALUE.permissions.medical;
export const defaultGeneralPermissions =
  DEFAULT_CONTEXT_VALUE.permissions.general;
export const mockedDefaultPermissionsContextValue = {
  permissions: {
    medical: {
      ...defaultMedicalPermissions,
    },
    concussion: {
      ...defaultConcussionPermissions,
    },
    general: {
      ...defaultGeneralPermissions,
    },
  },
  permissionsRequestStatus: 'SUCCESS',
};

export const mockedPastAthlete = {
  id: 5,
  fullname: 'Macho Man Randy Savage',
  avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
  availability: 'unavailable',
  date_of_birth: '12 Oct 1990',
  age: 31,
  height: null,
  country: 'Ireland',
  squad_names: [
    { id: 1, name: 'International Squad' },
    { id: 2, name: 'Academy Squad' },
  ],
  allergy_names: ['Penicillin allergy', 'Pollen allergy'],
  unresolved_issues_count: 2,
  position: 'Fullback',
  position_group: 'Back',
  constraints: {
    organisation_status: 'PAST_ATHLETE',
    active_periods: [
      {
        start: '2022-12-16T05:04:33',
        end: '2023-01-28T23:59:59',
      },
    ],
  },
};

export const mockedTrialAthlete = {
  id: 5,
  fullname: 'Stone Cold Steve Austin 3:16',
  avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
  availability: 'blackout',
  date_of_birth: 'December 18, 1964',
  age: 31,
  height: null,
  country: 'Merica',
  squad_names: [
    { id: 1, name: 'International Squad' },
    { id: 2, name: 'Academy Squad' },
  ],
  allergy_names: ['Bud Light', 'Macho Man Randy Savage'],
  unresolved_issues_count: 2,
  position: 'Beast',
  position_group: 'Front',
  constraints: {
    organisation_status: 'TRIAL_ATHLETE',
    active_periods: [
      {
        start: '2022-12-16T05:04:33',
        end: '2023-01-28T23:59:59',
      },
    ],
  },
};

export const mockedSquadAthletes = [
  {
    label: 'WWE',
    id: 24,
    options: [
      {
        value: 5,
        label: 'Macho Man Randy Savage',
      },
      {
        value: 2,
        label: 'Hulk Hogan',
      },
    ],
  },
  {
    label: 'TNT',
    id: 25,
    options: [
      {
        value: 3,
        label: 'Ric Flair',
      },
      {
        value: 4,
        label: 'Sting',
      },
    ],
  },
];

export const medicalGlobalAddButtonMenuItems = [
  { id: 'diagnostic', modalTitle: 'Add diagnostic' },
  { id: 'medical-note', modalTitle: 'Add medical note' },
  { id: 'modification', modalTitle: 'Add modification' },
  { id: 'allergy', modalTitle: 'Add allergy' },
  { id: 'medical-alert', modalTitle: 'Add medical alert' },
  { id: 'procedure', modalTitle: 'Add procedure' },
  { id: 'treatment', modalTitle: 'Add treatment' },
  { id: 'tue', modalTitle: 'Add TUE' },
  { id: 'workers-comp-claim', modalTitle: "Workers' comp claim" },
  {
    id: 'osha',
    modalTitle: 'OSHA’s Form 301 - Injury and Illness Incident Report',
  },
  { id: 'workers-comp-form', modalTitle: "Submit workers' comp form" },
  { id: 'document', modalTitle: 'Add documents' },
];

export const retrieveNestedAnswers = (questionsArray: Array<any>) => {
  return questionsArray.find(({ answers }) =>
    answers?.find(({ value }) => value === 'Deeply nested followup answer')
  );
};
