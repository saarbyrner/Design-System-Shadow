export const mockArchiveReasonOptions = [
  { label: 'Duplicate', value: 1 },
  { label: 'Incorrect athlete', value: 2 },
  { label: 'Note not relevant', value: 3 },
];

export const mockFile = {
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
  attachment: {
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
    attachment_date: '2023-02-28T12:14:13Z',
    created: '2023-02-28T12:14:13Z',
  },
  injury_occurrences: [],
  illness_occurrences: [],
};

export default mockArchiveReasonOptions;
