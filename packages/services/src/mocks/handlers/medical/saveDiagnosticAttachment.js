import { rest } from 'msw';

const diagnosticAttachments = [
  {
    audio_file: false,
    confirmed: true,
    created_by: {
      id: 123666,
      firstname: 'Victor',
      lastname: 'Frankenstein',
      fullname: 'Victor Frankenstein',
    },
    download_url: 'http://s3:9000/download_url',
    filename: 'DiagnosticAttachment.mov',
    filesize: 49781223,
    filetype: 'video/quicktime',
    id: 666321,
    presigned_post: null,
    url: 'http://s3:9000/some_cool_url/',
  },
];
const data = {
  annotation: null,
  attached_links: [],
  attachments: diagnosticAttachments,
  diagnostic_date: '2022-05-25T23:00:00Z',
  id: 123321,
  is_medication: false,
  medical_meta: {},
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: 'Answer from Radiologist ',
};

const handler = rest.post('/medical/diagnostics/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
