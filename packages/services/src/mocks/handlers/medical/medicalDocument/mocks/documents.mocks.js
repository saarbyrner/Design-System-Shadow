// @flow
import type {
  DocumentRequestResponse,
  MedicalFile,
} from '@kitman/modules/src/Medical/shared/types/medical';

export const documentData: MedicalFile = {
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
  archived_at: null,
  archive_reason: null,
  created_at: '2023-02-28T12:14:13Z',
  updated_at: '2023-02-28T12:14:13Z',
  created_by: {
    id: 1,
    fullname: 'John Doe',
  },
  created_by_organisation: {
    id: 1,
    name: 'Kitman Football',
  },
  annotation: {
    id: 1,
    content: '<p>Test content for my note</p>',
    note_summary: 'Test content for my note',
    annotation_date: '2023-02-28T12:14:13Z',
    restricted_annotation: false,
    title: 'Test Title',
  },
  attachment: {
    id: 1,
    url: 'www.kitmanlabs.com',
    name: 'testFile',
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
    medical_attachment_categories: [{ id: 1, name: 'Category Note 1' }],
  },
  injury_occurrences: [],
  illness_occurrences: [],
  chronic_issues: [
    {
      id: 75737,
      reported_date: '2023-02-28T12:14:13Z',
      title: 'My test chronic title',
      full_pathology: 'Asthma Acute',
    },
  ],
};

export const archivedDocumentData: MedicalFile = {
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
  created_by_organisation: {
    id: 1,
    name: 'Kitman Football',
  },
  annotation: null,
  attachment: {
    id: 1,
    url: 'www.kitmanlabs.com',
    name: 'testFile',
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
  chronic_issues: [],
};

export const updatedDocumentFile = {
  ...documentData,
  attachment: {
    name: 'New Attachment Name',
  },
};

export const documentsResponse = {
  documents: [documentData],
  total_count: 1,
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_count: 1,
    total_pages: 1,
  },
};

export const documentResponse: DocumentRequestResponse = {
  document: documentData,
};
