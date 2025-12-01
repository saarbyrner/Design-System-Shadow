/* eslint-disable flowtype/require-valid-file-annotation */
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';

export const pathologyQV4 = {
  code: 'QV4',
  coding_system_body_part: {
    coding_system_body_region: {
      coding_system_id: 5,
      id: 26,
      name: 'Lower limb',
    },
    coding_system_id: 5,
    id: 59,
    name: 'Lower leg',
  },
  coding_system_body_region: {
    coding_system_id: 5,
    id: 26,
    name: 'Lower limb',
  },
  coding_system_classification: {
    coding_system_id: 5,
    id: 233,
    name: 'Contusion/vascular',
  },
  coding_system_tissue: { coding_system_id: 5, id: 35, name: 'Vessels' },
  coding_system_version: {
    coding_system: { id: 5, key: 'osiics_15', name: 'OSIICS-15' },
    id: 5,
    name: 'OSIICS-15.1',
    order: null,
  },
  id: 6784,
  label: 'Popliteal artery entrapment - QV4',
  pathology: 'Popliteal artery entrapment',
};

export const baseIssueData = {
  id: 11,
  activity_id: 8,
  activity_type: 'game',
  occurrence_date: '2022-02-06T00:00:00+00:00',
  examination_date: '2022-02-23T00:00:00+00:00',
  association_period_id: null,
  occurrence_min: null,
  training_session_id: null,
  game_id: 48384,
  position_when_injured_id: 72,
  session_completed: false,
  created_by: "Jonny O'Mahony",
  created_at: '2022-02-23T12:02:24+00:00',
  closed: false,
  supplementary_pathology: null,
  events: [
    {
      id: 11,
      injury_status_id: 1,
      event_date: '2022-02-23T00:00:00+00:00',
      date: '2022-02-23T00:00:00+00:00',
    },
  ],
  is_first_occurrence: true,
  is_last_occurrence: true,
  athlete_id: 30693,
  osics: {
    osics_id: 'WUPC',
    osics_pathology_id: 1392,
    osics_classification_id: 9,
    osics_body_area_id: 20,
    icd: 'NC54.03',
  },
  side_id: 3,
  bamic_grade_id: null,
  bamic_site_id: null,
  issue_id: 73463,
  issue_occurrence_onset_id: 3,
  has_recurrence: false,
  events_order: [11],
  diagnostics: [],
  annotations: [],
  modification_info: 'Chatting at 16:11',
  total_duration: 0,
  unavailability_duration: 0,
  events_duration: { 11: 0 },
  treatment_sessions: [],
  rehab_sessions: [],
  additionalInfo: {
    conditionalFieldsAnswers: [],
    annotations: [],
  },
};

export const baseGetState = {
  addIssuePanel: {
    initialInfo: {
      athlete: 1161,
      initialNote: '',
      type: 'injury',
      previousIssue: null,
      diagnosisDate: '2022-02-23',
    },
    diagnosisInfo: {
      statuses: [
        {
          status: 'unavailable',
          date: '2021-12-01',
        },
      ],
      examinationDate: '2022-02-23',
      supplementalPathology: 'ouchy',
      onset: 3,
      onsetDescription: 'mocked onset description',
      mechanismDescription: 'mocked mechanism description',
      supplementaryCoding: {},
      coding: {
        [codingSystemKeys.OSICS_10]: {
          osics_id: 'WUPC',
          osics_pathology_id: 1392,
          osics_classification_id: 9,
          osics_body_area_id: 20,
          icd: 'NC54.03',
        },
      },
    },
    eventInfo: {
      activity: 'jumping',
      event_type: 'Up and down',
      athlete: 123,
      timeOfInjury: 123456,
      event: 'unlisted',
      positionWhenInjured: 'standing',
      sessionCompleted: 'NO',
      presentation_type: 1,
    },
    additionalInfo: {
      conditionalFieldsAnswers: [],
      annotations: [],
    },
  },
};

export const baseGridColumn = {
  row_key: 'athlete',
  datatype: 'object',
  name: 'Athlete',
  assessment_item_id: null,
  readonly: true,
  id: 1,
  default: true,
};

export const baseGridRowAthlete1 = {
  id: 7,
  athlete: {
    fullname: 'Deco 10',
    avatar_url: 'test_avatar_url.png',
  },
};

export const baseGridRowAthlete2 = {
  id: 8,
  athlete: {
    fullname: 'John Smith',
    avatar_url: 'test_avatar_url_2.png',
  },
};

export const baseGridData = {
  columns: [baseGridColumn],
  next_id: 12345,
  rows: [
    {
      ...baseGridRowAthlete1,
      accommodation: {
        value: 1,
        comment: {
          content: '<p>test</p>',
          created_at: 'fake_test_date_string',
        },
      },
    },
    {
      ...baseGridRowAthlete2,
      accommodation: { value: 3, comment: null },
    },
  ],
};

export const baseCommentsGridRowAthlete1 = {
  id: 40211,
  athlete: {
    fullname: 'Tomas Albornoz',
    position: 'Second Row',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_189778?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU1nJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
    availability: 'unavailable',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'unavailable',
    unavailable_since: '288 days',
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [
      {
        id: 13899,
        issue_id: 13900,
        name: 'Oct  6, 2022 - Abcess Ankle (excl. Joint) [Left]',
        status: 'Causing unavailability (time-loss)',
        causing_unavailability: true,
        issue_type: 'Illness',
      },
    ],
  },
  availability_comment: 'hhh2',
};

export const baseCommentsGridRowAthlete2 = {
  id: 95705,
  athlete: {
    fullname: 'Akanksha Athlete',
    position: 'Second Row',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    availability: 'available',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'available',
    unavailable_since: null,
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [],
  },
  availability_comment: 'Comment 1',
};

export const baseCommentsGridRowAthlete3 = {
  id: 93304,
  athlete: {
    fullname: 'Craig Athlete',
    position: 'Second Row',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    availability: 'available',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'available',
    unavailable_since: null,
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [],
  },
  availability_comment: 'asdfgrrrrr',
};

export const baseCommentsGridRowAthlete4 = {
  id: 80524,
  athlete: {
    fullname: 'Daniel Athlete Athlete',
    position: 'Loose-head Prop',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    availability: 'unavailable',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'unavailable',
    unavailable_since: null,
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [],
  },
  availability_comment: 'eeee333',
};

export const baseCommentsGridRowAthlete5 = {
  id: 96981,
  athlete: {
    fullname: 'Janet Athlete',
    position: 'Wing',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    availability: 'available',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'available',
    unavailable_since: null,
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [],
  },
  availability_comment: '',
};

export const baseCommentsGridRowAthlete6 = {
  id: 96765,
  athlete: {
    fullname: 'Lydia Athlete',
    position: 'No. 8',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    availability: 'available',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'available',
    unavailable_since: null,
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [],
  },
  availability_comment: 'Comment 11',
};

export const baseCommentsGridRowAthlete7 = {
  id: 94547,
  athlete: {
    fullname: 'Simon Athlete',
    position: 'No. 8',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    availability: 'available',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'available',
    unavailable_since: null,
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [],
  },
  availability_comment: '',
};

export const baseCommentsGridRowAthlete8 = {
  id: 78041,
  athlete: {
    fullname: 'Test Athlete',
    position: 'Loose-head Prop',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    availability: 'unavailable',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'unavailable',
    unavailable_since: '311 days',
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [],
  },
  availability_comment: 'test ',
};

export const baseCommentsGridRowAthlete9 = {
  id: 39894,
  athlete: {
    fullname: 'Test Email Athlete',
    position: 'Hooker',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    availability: 'injured',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'injured',
    unavailable_since: null,
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [],
  },
  availability_comment: 'ddddd',
};

export const baseCommentsGridRowAthlete10 = {
  id: 33344,
  athlete: {
    fullname: 'Mohamed Athlete Test',
    position: 'No. 8',
    avatar_url:
      'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0P2JnPTk1MjQyZjM4JnR4dDY0PU9BJnR4dGFsaWduPWNlbnRlciZ0eHRjbHI9ZmZmJnR4dGZvbnQ9QXZlbmlyK05leHQrQ29uZGVuc2VkK01lZGl1bSZ0eHRwYWQ9NSZ0eHRzaGFkPTImdHh0c2l6ZT0xNiZ3PTM2&markalign=left%2Cbottom&markfit=max&markpad=0&w=100',
    availability: 'unavailable',
    extended_attributes: {},
  },
  availability_status: {
    availability: 'unavailable',
    unavailable_since: null,
  },
  open_injuries_illnesses: {
    has_more: false,
    issues: [],
  },
  availability_comment: null,
};

export const baseCommentsGridData = {
  columns: [],
  next_id: 12345,
  rows: [
    [
      baseCommentsGridRowAthlete1,
      baseCommentsGridRowAthlete2,
      baseCommentsGridRowAthlete3,
      baseCommentsGridRowAthlete4,
      baseCommentsGridRowAthlete5,
      baseCommentsGridRowAthlete6,
      baseCommentsGridRowAthlete7,
      baseCommentsGridRowAthlete8,
      baseCommentsGridRowAthlete9,
      baseCommentsGridRowAthlete10,
    ],
  ],
};
