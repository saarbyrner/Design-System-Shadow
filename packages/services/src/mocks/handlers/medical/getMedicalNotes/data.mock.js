const medicalNote = {
  id: 1,
  title: 'Rehab update',
  content:
    'Collision during tackle in match against the Seahawks. Initial diagnoses suggested fracture. Game medic referred to local hospital. X-Ray was inconclusive, referred to CT. MRI performed as well, these both pointed towards Lateral Malleolus Fracture and mild Medial Malleolus Fracture, consulting surgeon recommended operating. Open reduction and internal fixation (ORIF) recommended by consultant. Three screws and plates fitted by surgeon for Lateral Malleolus Fracture. Bone graft required for Medial Malleolus Fracture and screws fixed to aid recovery. Allow 6 - 8 weeks for recovery, full p...',
  organisation_annotation_type: {
    id: 1,
    name: 'Medical note',
    type: 'OrganisationAnnotationTypes::Medical',
  },
  squad: {
    id: 1,
    name: 'Full roster',
  },
  annotationable: {
    type: 'Athlete',
    id: 1,
    fullname: 'Marcius Vega',
    avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
    availability: 'available',
    athlete_squads: [
      {
        id: 1,
        name: 'Full roster',
      },
    ],
  },
  author: {
    id: 1,
    fullname: 'John Jones',
  },
  annotation_date: '2021-06-23T12:10:00Z',
  expiration_date: '2021-06-28T12:10:00Z',
  created_at: '2021-06-24T13:18:31Z',
  restrict_to_doc: false,
  restrict_to_psych: false,
  attachments: [
    {
      filename: 'Gordon_Morales Rehab Plan Jan 2021.pdf',
      filetype: 'application/pdf',
      filesize: '12MB',
      url: '/fileurl.pdf',
    },
  ],
  illness_occurrences: [
    {
      id: 1,
      issue_type: 'illness',
      occurrence_date: '2021-06-23T12:10:00Z',
      full_pathology: 'Asthma and/or allergy',
    },
  ],
  injury_occurrences: [
    {
      id: 1,
      issue_type: 'injury',
      occurrence_date: '2021-06-23T12:10:00Z',
      full_pathology: 'Fracture tibia and fibula at ankle joint - [Left]',
    },
  ],
  organisation_id: 999,
};

export const rehabMedicalNote = {
  id: 5359063,
  organisation_annotation_type: {
    id: 3,
    name: 'Rehab Note',
    type: 'OrganisationAnnotationTypes::RehabSession',
  },
  annotationable_type: 'Athlete',
  annotationable: {
    id: 40211,
    fullname: 'Albornoz, Tomas',
    avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
    availability: 'unavailable',
    athlete_squads: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    type: 'Athlete',
  },
  title: 'Test rehab note',
  content: '\u003cp\u003eTest rehab note content\u003c/p\u003e',
  annotation_date: '2022-12-14T00:00:00Z',
  annotation_actions: [],
  expiration_date: null,
  attachments: [],
  archived: false,
  created_by: {
    id: 97443,
    fullname: 'David Kelly',
  },
  created_at: '2022-12-14T18:49:33Z',
  updated_by: {
    id: 97443,
    fullname: 'David Kelly',
  },
  updated_at: '2022-12-14T19:21:12Z',
  document_note_categories: [],
  rehab_sessions: [
    {
      id: 3,
      start_time: '2022-12-13T12:00:00+00:00',
      end_time: '2022-12-13T12:00:00+00:00',
      timezone: 'Europe/Dublin',
      title: 'General',
    },
  ],
  restricted_to_doc: false,
  restricted_to_psych: false,
  illness_occurrences: [
    {
      id: 13899,
      issue_type: 'illness',
      occurrence_date: '6 Oct 2022',
      full_pathology: 'Abcess Ankle (excl. Joint) [Left]',
      issue_occurrence_title: null,
    },
  ],
  injury_occurrences: [],
  author: {
    id: 97443,
    fullname: 'David Kelly',
  },
  squad: {
    id: 8,
    name: 'International Squad',
  },
  chronic_issues: [],
};

export const telephoneNote = {
  id: 5359063,
  organisation_annotation_type: {
    id: 3,
    name: 'Telephone Note',
    type: 'OrganisationAnnotationTypes::Telephone',
  },
  annotationable_type: 'Athlete',
  annotationable: {
    id: 40211,
    fullname: 'Albornoz, Tomas',
    avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
    availability: 'unavailable',
    athlete_squads: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    type: 'Athlete',
  },
  title: 'Test telphone note',
  content: '\u003cp\u003eTest rehab note content\u003c/p\u003e',
  annotation_date: '2022-12-14T00:00:00Z',
  annotation_actions: [],
  expiration_date: null,
  attachments: [],
  archived: false,
  created_by: {
    id: 97443,
    fullname: 'David Kelly',
  },
  created_at: '2022-12-14T18:49:33Z',
  updated_by: {
    id: 97443,
    fullname: 'David Kelly',
  },
  updated_at: '2022-12-14T19:21:12Z',
  document_note_categories: [],
  rehab_sessions: [
    {
      id: 3,
      start_time: '2022-12-13T12:00:00+00:00',
      end_time: '2022-12-13T12:00:00+00:00',
      timezone: 'Europe/Dublin',
      title: 'General',
    },
  ],
  restricted_to_doc: false,
  restricted_to_psych: false,
  illness_occurrences: [
    {
      id: 13899,
      issue_type: 'illness',
      occurrence_date: '6 Oct 2022',
      full_pathology: 'Abcess Ankle (excl. Joint) [Left]',
      issue_occurrence_title: null,
    },
  ],
  injury_occurrences: [],
  author: {
    id: 97443,
    fullname: 'David Kelly',
  },
  squad: {
    id: 8,
    name: 'International Squad',
  },
  chronic_issues: [],
};

const diagnosticNote = {
  id: 3,
  organisation_annotation_type: {
    id: 1,
    name: 'Diagnostic note',
    type: 'OrganisationAnnotationTypes::Diagnostic',
  },
  annotationable_type: 'Diagnostic',
  annotationable: {
    id: 500,
    type: '3D Analysis',
    athlete: {
      id: 10000,
      fullname: 'Diagnostic Athlete',
      avatar_url: 'img/url',
      position: 'Striker',
      athlete_squads: [
        {
          id: 1,
          name: 'First Squad',
        },
        {
          id: 2,
          name: 'Reserves',
        },
      ],
      date_of_birth: null,
      nfl_id: null,
      gender: null,
    },
    diagnostic_reason: {
      id: 1,
      name: 'Baseline',
      injury_illness_required: false,
    },
    issue_occurrences: [],
  },
  title: 'Note',
  content: '<p>note</p>',
  annotation_date: '2024-03-22T00:00:00Z',
  annotation_actions: [],
  expiration_date: null,
  attachments: [],
  archived: false,
  created_by: {
    id: 247523,
    fullname: 'John Doe',
  },
  created_at: '2024-04-08T10:19:28Z',
  updated_by: null,
  updated_at: '2024-04-08T10:19:28Z',
  document_note_categories: [],
  rehab_sessions: [],
  organisation_id: 1,
  note_summary: 'test',
  author: null,
  restricted_to_doc: false,
  restricted_to_psych: false,
  illness_occurrences: [],
  injury_occurrences: [],
  squad: {
    id: 1,
    name: 'First Squad',
  },
  versions: [],
  chronic_issues: [],
  constraints: {
    read_only: false,
  },
};

const data = {
  medical_notes: [medicalNote, rehabMedicalNote, diagnosticNote],
  total_count: 1000,
  meta: {
    next_page: null,
  },
};

export const diagnosticNoteData = {
  medical_notes: [diagnosticNote],
  total_count: 1,
  meta: {
    next_page: null,
  },
};

export default data;
