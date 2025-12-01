// @flow
const mockUser = {
  id: 91283,
  firstname: 'Alexander',
  lastname: 'Isak',
  fullname: 'Alexander Isak',
  email: 'aisak@nufc.co.uk',
};

const mockConfidentialNote = {
  id: 12345,
  organisation_annotation_type: {
    id: 8,
    name: 'Medical note',
    type: 'OrganisationAnnotationTypes::Medical',
  },
  annotationable_type: 'Athlete',
  annotationable: {
    id: 3559,
    fullname: 'Altenwerth, Taylor',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff_4025?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100',
    position: 'Running Back',
    availability: 'unavailable',
    athlete_squads: [
      {
        id: 2,
        name: 'Under18s Squad',
      },
      {
        id: 57,
        name: 'A Squad',
      },
    ],
    type: 'Athlete',
  },
  title: 'Medical note',
  content: '<p>A sample note</p>',
  annotation_date: '2023-08-30T04:00:00Z',
  annotation_actions: [],
  expiration_date: null,
  attachments: [],
  archived: false,
  created_by: {
    id: 44438,
    fullname: 'Edward Howe',
  },
  created_at: '2023-08-30T15:44:13Z',
  updated_by: null,
  updated_at: '2023-08-30T15:44:13Z',
  document_note_categories: [],
  rehab_sessions: [],
  organisation_id: 2,
  note_summary: 'constrained to just taylor',
  author: null,
  allow_list: [
    {
      id: 3702,
      fullname: 'Marlon Wyman',
    },
    {
      id: 3717,
      fullname: 'Colt Wuckert',
    },
    {
      id: 44438,
      fullname: 'Edward Howe',
    },
  ],
  restricted_to_doc: false,
  restricted_to_psych: false,
  illness_occurrences: [],
  injury_occurrences: [
    {
      id: 132072,
      issue_type: 'injury',
      occurrence_date: '2023-07-10T00:00:00-04:00',
      full_pathology: null,
      issue_occurrence_title: null,
    },
  ],
  squad: {
    id: 2,
    name: 'Under18s Squad',
  },
  versions: [],
  chronic_issues: [],
  constraints: {
    read_only: false,
  },
};

export { mockUser, mockConfidentialNote };
