import { rest } from 'msw';

const diagnostic = {
  organisation_id: 1,
  annotation: null,
  attached_links: [],
  attachments: [
    {
      audio_file: false,
      confirmed: true,
      created_by: {
        firstname: 'Greg',
        fullname: 'Greg Levine-Rozenvayn',
        id: 126841,
        lastname: 'Levine-Rozenvayn',
      },
      download_url: 'https://s3:9000/some_awesome/download/url/',
      filename: 'filePond.png',
      filesize: 16170,
      filetype: 'image/png',
      id: 159875,
      presigned_post: null,
      url: 'https://s3:9000/some_awesome/url/',
    },
  ],
  redox_pdf_results: [
    { value: 'some crazy bit64 hash', description: 'mock PDF bit64 data' },
  ],
  athlete: {
    id: 666,
    avatar_url: '/avatars/are/cool.com',
    fullname: 'Zinedine Zidane',
  },
  created_by: {
    fullname: 'Greg Levine-Rozenvayn',
    id: 126841,
  },
  diagnostic_date: '2022-05-15T23:00:00Z',
  id: 168637,
  is_medication: false,
  issue_occurrences: [
    {
      full_pathology: 'Adductor strain [Right]',
      id: 2,
      issue_type: 'Injury',
      occurrence_date: '2022-05-06T00:00:00+01:00',
    },
  ],
  chronic_issues: [
    {
      full_pathology: 'Chronic Injury Full Pathology 1',
      id: 19,
      title: 'Chronic Injury Title 1',
    },
  ],
  ambra_configuration: null,
  billable_items: [
    {
      cpt_code: 'ABC12',
      is_billable: true,
      amount_paid_insurance: 100,
      amount_paid_athlete: 20,
    },
  ],
  medical_meta: {},
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: '3D Analysis ',
};

const data = {
  diagnostics: [diagnostic],
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 1,
  },
};
const handler = rest.post('/medical/diagnostics/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
