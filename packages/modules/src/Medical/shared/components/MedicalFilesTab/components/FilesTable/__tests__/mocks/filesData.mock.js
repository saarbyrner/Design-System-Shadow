const attachment1 = {
  id: 1,
  url: 'www.kitmanlabs.com',
  filename: 'testFile.pdf',
  filetype: 'PDF',
  filesize: 1028,
  audio_file: false,
  confirmed: true,
  presigned_post: {
    url: 'www.kitmanlabs.com',
    fields: {},
  },
  download_url: 'www.kitmanlabs.com',
  created_by: {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    fullname: 'John Doe',
  },
  attachment_date: '2023-02-29T12:14:13Z',
  created: '2023-02-29T12:14:13Z',
};

const attachment2 = {
  id: 2,
  url: 'www.kitmanlabs.com',
  filename: 'testFile.pdf',
  filetype: 'PDF',
  filesize: 1028,
  audio_file: false,
  confirmed: true,
  presigned_post: {
    url: 'www.kitmanlabs.com',
    fields: {},
  },
  download_url: 'www.kitmanlabs.com',
  created_by: {
    id: 2,
    firstname: 'Jane',
    lastname: 'Doe',
    fullname: 'Jane Doe',
  },
  attachment_date: '2023-02-29T12:14:13Z',
  created: '2023-02-29T12:14:13Z',
};

export const medicalFiles = [
  {
    id: 1,
    athlete: {
      id: 1,
      fullname: 'John Doe',
      position: 'Striker',
      avatar_url: 'www.kitmanlabs.com',
    },
    organisation_id: 1,
    document_categories: [
      {
        id: 1,
        name: 'Misc',
      },
    ],
    document_date: '2023-02-28T12:14:13Z',
    archived_at: '2023-02-28T12:14:13Z',
    archive_reason: {
      id: 1,
      name: 'Duplicate',
    },
    created_at: '2023-02-28T12:14:13Z',
    updated_at: '2023-02-28T12:14:13Z',
    created_by: {
      id: 1,
      fullname: 'John Doe',
    },
    annotation: {
      id: 1,
      content: 'Test content for my note',
      annotation_date: '2023-02-28T12:14:13Z',
      restricted_annotation: false,
      title: 'Test Title',
    },
    attachment: attachment1,
    injury_occurrences: [],
    illness_occurrences: [],
    chronic_issues: [],
  },
  {
    id: 2,
    athlete: {
      id: 2,
      fullname: 'Jane Doe',
      position: 'Left Back',
      avatar_url: 'www.kitmanlabs.com',
    },
    organisation_id: 2,
    document_categories: [
      {
        id: 2,
        name: 'Scan',
      },
    ],
    document_date: '2023-02-28T12:14:13Z',
    archived_at: '2023-02-28T12:14:13Z',
    archive_reason: {
      id: 2,
      name: 'Incorrect Athlete',
    },
    created_at: '2023-02-28T12:14:13Z',
    updated_at: '2023-02-28T12:14:13Z',
    created_by: {
      id: 2,
      fullname: 'Jane Doe',
    },
    annotation: {
      id: 2,
      content: 'Test content for my note',
      annotation_date: '2023-02-28T12:14:13Z',
      restricted_annotation: false,
      title: 'Test Title',
    },
    attachment: attachment2,
    injury_occurrences: [],
    illness_occurrences: [],
    chronic_issues: [],
  },
];

export const entityAttachments = [
  {
    entity: {
      athlete: {
        id: 1,
        fullname: 'Test athlete 1',
        position: 'Position',
        avatar_url: 'URL',
      },
      entity_type: 'document_v2',
      entity_date: '2023-02-24T12:14:13Z',
      entity_title: null,
    },
    attachment: attachment1,
  },
  {
    entity: {
      athlete: {
        id: 1,
        fullname: 'Test athlete 2',
        position: 'Position',
        avatar_url: 'URL',
      },
      entity_type: 'diagnostic',
      entity_date: '2023-02-25T12:14:13Z',
      entity_title: 'Test title',
    },
    attachment: attachment2,
  },
];
