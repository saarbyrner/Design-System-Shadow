// @flow
const mockAuthor = {
  id: 1,
  firstname: 'An',
  lastname: 'Author',
  fullname: 'An Author',
};

export const MockMedicalVersions = [
  {
    updated_by: mockAuthor,
    updated_at: '2022-08-04T15:31:25Z',
    changeset: {
      title: ['Old title', 'New title'],
      content: ['<p>Old content</p>', '<p>New content</p>'],
      annotation_date: ['2022-07-25T23:00:00Z', '2022-07-28T23:00:00Z'],
      squads: [
        {
          id: 8,
          name: 'Old Squad',
        },
        {
          id: 2731,
          name: 'New squad',
        },
      ],
      visibility: ['Old visibility', 'New visibility'],
    },
  },
  {
    updated_by: mockAuthor,
    updated_at: '2022-08-04T15:31:25Z',
    changeset: {
      title: [null, 'New title'],
      content: [null, '<p>New content</p>'],
      annotation_date: [null, '2022-07-28T23:00:00Z'],
      squads: [
        null,
        {
          id: 2731,
          name: 'New squad',
        },
      ],
      visibility: [null, 'New visibility'],
    },
  },
];

export const MockMedicalNote = {
  id: 1,
  organisation_annotation_type: {
    id: 1,
    name: 'Medical note',
    type: 'OrganisationAnnotationTypes::Medical',
  },
  annotationable_type: 'Athlete',
  annotationable: {
    id: 1,
    fullname: 'An Athlete',
    avatar_url: 'img/url',
    availability: 'unavailable',
    athlete_squads: [
      {
        id: 8,
        name: 'International Squad',
      },
    ],
    type: 'Athlete',
  },
  title: '1',
  content: '<p>My content</p>',
  content_editable: true,
  annotation_date: '2022-07-14T23:00:00Z',
  annotation_actions: [],
  expiration_date: null,
  attachments: [
    {
      filetype: 'binary/octet-stream',
      filesize: 1010043,
      filename: 'file.xls',
      url: 'attachment/url',
    },
  ],
  archived: false,
  created_by: {
    id: 1,
    fullname: 'A Staff',
  },
  created_at: '2022-07-15T08:51:20Z',
  updated_by: null,
  updated_at: '2022-07-15T08:51:20Z',
  restricted_to_doc: false,
  restricted_to_psych: false,
  illness_occurrences: [
    {
      id: 11523,
      issue_type: 'illness',
      occurrence_date: '2022-07-05T00:00:00+00:00',
      full_pathology: 'Respiratory tract infection (bacterial or viral) [N/A]',
    },
  ],
  chronic_issues: [
    {
      id: 123,
      occurrence_date: '2022-07-06T00:00:00+00:00',
      full_pathology: 'Chronic issue',
    },
  ],
  injury_occurrences: [],
  expired: false,
  squad: {
    id: 8,
    name: 'International Squad',
  },
  author: {
    id: 1,
    fullname: 'A Staff',
  },
};

export const MockDiagnosticNote = {
  id: 1,
  organisation_annotation_type: {
    id: 1,
    name: 'Diagnostic note',
    type: 'OrganisationAnnotationTypes::Diagnostic',
  },
  annotationable_type: 'Diagnostic',
  annotationable: {
    id: 1,
    type: '3D Analysis',
    athlete: {
      id: 1,
      fullname: 'John Doe',
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

export const MockArchivedMedicalNote = {
  ...MockMedicalNote,
  archived: true,
  updated_by: {
    fullname: 'An Author',
    id: 1,
  },
};

export const MockAthleteIssues = {
  isLoading: false,
  options: [
    {
      value: 'Illness_11523',
      label:
        'Jul 4, 2022 - Respiratory tract infection (bacterial or viral) [N/A]Optional',
    },
    {
      value: 'ChronicInjury_123',
      label: 'Jul 5, 2022 - Chronic issue',
    },
  ],
};

export const MockAthleteSquads = {
  isLoading: false,
  data: [
    {
      id: 2731,
      name: '1st team',
      owner_id: 6,
      created_at: '2022-03-21T17:19:56Z',
      updated_at: '2022-03-21T17:19:56Z',
    },
    {
      id: 73,
      name: 'Academy Squad',
      owner_id: 6,
      created_at: '2015-09-07T12:29:54Z',
      updated_at: '2015-09-07T12:29:54Z',
    },
    {
      id: 2732,
      name: 'Academy team',
      owner_id: 6,
      created_at: '2022-03-21T17:19:56Z',
      updated_at: '2022-03-21T17:19:56Z',
    },
    {
      id: 8,
      name: 'International Squad',
      owner_id: 6,
      created_at: '2013-10-17T15:10:14Z',
      updated_at: null,
    },
    {
      id: 1374,
      name: 'Player view',
      owner_id: 6,
      created_at: '2019-10-17T12:23:51Z',
      updated_at: '2019-10-17T12:23:51Z',
    },
    {
      id: 2431,
      name: 'team_1',
      owner_id: 6,
      created_at: '2021-12-07T11:41:45Z',
      updated_at: '2021-12-07T11:41:45Z',
    },
    {
      id: 2432,
      name: 'team_2',
      owner_id: 6,
      created_at: '2021-12-07T11:41:45Z',
      updated_at: '2021-12-07T11:41:45Z',
    },
    {
      id: 1038,
      name: 'Technical Director',
      owner_id: 6,
      created_at: '2018-10-16T09:16:12Z',
      updated_at: '2022-03-25T15:41:46Z',
    },
    {
      id: 262,
      name: 'Test',
      owner_id: 6,
      created_at: '2016-04-22T20:56:44Z',
      updated_at: '2019-07-03T11:06:18Z',
    },
    {
      id: 2188,
      name: 'Test RPE Issue',
      owner_id: 6,
      created_at: '2021-10-06T07:53:09Z',
      updated_at: '2021-10-06T07:53:09Z',
    },
  ],
};
