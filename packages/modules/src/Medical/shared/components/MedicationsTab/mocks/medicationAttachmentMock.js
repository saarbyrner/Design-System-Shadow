export const medicationAttachment = {
  id: 123,
  url: 'http://s3:9000/fakeAttachment',
  filename: 'test.pdf',
  filetype: 'application/pdf',
  filesize: 3526994,
  audio_file: false,
  confirmed: true,
  presigned_post: null,
  download_url: 'http://s3:9000/fakeAttachment',
  created_by: {
    id: 97443,
    firstname: 'David',
    lastname: 'Kelly',
    fullname: 'David Kelly',
  },
  created: '2024-10-25T09:59:46Z',
  attachment_date: '2024-10-25T09:59:46Z',
  name: 'test.pdf',
  archived_at: null,
  archive_reason: null,
  medical_attachment_categories: [
    {
      id: 42,
      name: 'Prescriptions',
      translated_name: 'Prescriptions',
    },
  ],
};

export const medicationArchivedAttachment = {
  id: 123,
  url: 'http://s3:9000/fakeAttachment',
  filename: 'test2.pdf',
  filetype: 'application/pdf',
  filesize: 3526994,
  audio_file: false,
  confirmed: true,
  presigned_post: null,
  download_url: 'http://s3:9000/fakeAttachment',
  created_by: {
    id: 97443,
    firstname: 'David',
    lastname: 'Kelly',
    fullname: 'David Kelly',
  },
  created: '2024-10-25T09:59:46Z',
  attachment_date: '2024-10-25T09:59:46Z',
  name: 'test2.pdf',
  archived_at: '2024-10-30T14:42:36Z',
  archive_reason: {
    id: 1,
    name: 'Incorrect athlete',
  },
  medical_attachment_categories: [
    {
      id: 42,
      name: 'Prescriptions',
      translated_name: 'Prescriptions',
    },
  ],
};
