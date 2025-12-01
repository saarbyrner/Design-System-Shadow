export const mockArchiveReasonOptions = [
  { label: 'Duplicate', value: 1 },
  { label: 'Incorrect athlete', value: 2 },
  { label: 'Note not relevant', value: 3 },
];

export const mockAttachment = {
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
};
