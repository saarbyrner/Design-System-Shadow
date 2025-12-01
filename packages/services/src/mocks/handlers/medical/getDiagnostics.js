import { rest } from 'msw';

const diagnosticOne = {
  result_type: 'RADIOLOGY',
  annotation: null,
  attached_links: [
    {
      title: 'Fake Link for testing',
      uri: 'www.thisisafakelink.com',
      id: 0,
    },
  ],
  athlete: {
    id: 1,
  },
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
  medical_meta: {},
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: '3D Analysis ',
  cpt_code: 'ABC12',
  is_billable: true,
  amount_paid_insurance: 100,
  amount_paid_athlete: 20,
  billable_items: [
    {
      cpt_code: 'ABC12',
      is_billable: true,
      amount_paid_insurance: 100,
      amount_paid_athlete: 20,
    },
  ],
  organisation_id: 37,
};
const diagnosticTwo = {
  annotation: null,
  attached_links: [],
  attachments: [],
  created_by: {
    fullname: 'Tom Brady',
    id: 857436,
  },
  diagnostic_date: '2022-05-15T23:00:00Z',
  id: 666666,
  is_medication: false,
  issue_occurrences: [
    {
      full_pathology: 'Ouchie so hurt',
      id: 2,
      issue_type: 'Injury',
      occurrence_date: '2022-13-06T00:00:00+04:20',
    },
  ],
  medical_meta: {},
  restricted_to_doc: true,
  restricted_to_psych: false,
  type: 'MRI ',
  organisation_id: 37,
};
const diagnosticThree = {
  annotation: null,
  attached_links: [],
  attachments: [
    {
      audio_file: false,
      confirmed: true,
      created_by: {
        firstname: 'Doctor',
        fullname: 'Doctor Kevorkian',
        id: 126841,
        lastname: 'Kevorkian',
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
  created_by: {
    fullname: 'Dr. K',
    id: 950754,
  },
  diagnostic_date: '2022-05-15T23:00:00Z',
  id: 95730,
  is_medication: false,
  issue_occurrences: [
    {
      full_pathology: 'Adductor strain [Right]',
      id: 2,
      issue_type: 'Injury',
      occurrence_date: '2022-05-06T00:00:00+01:00',
    },
  ],
  medical_meta: {},
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: '3D Analysis ',
  organisation_id: 37,
};
const diagnosticFour = {
  athlete: { id: 1 },
  annotation: null,
  attached_links: [],
  attachments: [
    {
      audio_file: false,
      confirmed: true,
      created_by: {
        firstname: 'Doctor',
        fullname: 'Doctor Kevorkian',
        id: 126841,
        lastname: 'Kevorkian',
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
  created_by: {
    fullname: 'Dr. K',
    id: 950754,
  },
  diagnostic_date: '2022-05-15T23:00:00Z',
  id: 180090,
  is_medication: false,
  issue_occurrences: [
    {
      full_pathology: 'Adductor strain [Right]',
      id: 2,
      issue_type: 'Injury',
      occurrence_date: '2022-05-06T00:00:00+01:00',
    },
  ],
  medical_meta: {
    covid_antibody_reference: '',
    covid_antibody_result: 'Not Detected',
    covid_antibody_test_date: '2022-07-04T23:00:00Z',
    covid_antibody_test_type: '',
    covid_antibody_timezone: null,
  },
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: 'Covid-19 Antibody Test',
  organisation_id: 37,
};
const diagnosticFive = {
  annotation: null,
  athlete: {
    id: 1,
  },
  attached_links: [],
  attachments: [
    {
      audio_file: false,
      confirmed: true,
      created_by: {
        firstname: 'Doctor',
        fullname: 'Doctor Kevorkian',
        id: 126841,
        lastname: 'Kevorkian',
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
  created_by: {
    fullname: 'Dr. K',
    id: 950754,
  },
  diagnostic_date: '2022-05-15T23:00:00Z',
  id: 180091,
  is_medication: true,
  issue_occurrences: [
    {
      full_pathology: 'Adductor strain [Right]',
      id: 2,
      issue_type: 'Injury',
      occurrence_date: '2022-05-06T00:00:00+01:00',
    },
  ],
  medical_meta: {
    dosage: '2',
    frequency: 'Twice a day',
    is_completed: false,
    notes: 'They should take the medication twice a day',
    start_date: '2022-07-24T23:00:00Z',
    type: 'Panadol',
  },
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: 'Medication',
  organisation_id: 37,
};
const diagnosticSix = {
  athlete: { id: 1 },
  annotations: [
    {
      title: 'Note Title 4390581635',
      content: 'This is an annotation attached to a diagnostic',
    },
  ],
  attached_links: [],
  attachments: [
    {
      audio_file: false,
      confirmed: true,
      created_by: {
        firstname: 'Doctor',
        fullname: 'Doctor Kevorkian',
        id: 126841,
        lastname: 'Kevorkian',
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
  created_by: {
    fullname: 'Dr. K',
    id: 950754,
  },
  diagnostic_date: '2022-05-15T23:00:00Z',
  id: 180094,
  is_medication: true,
  issue_occurrences: [
    {
      full_pathology: 'Adductor strain [Right]',
      id: 2,
      issue_type: 'Injury',
      occurrence_date: '2022-05-06T00:00:00+01:00',
    },
  ],
  medical_meta: {},
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: 'Cardiac Data',
  organisation_id: 37,
};

const diagnosticSeven = {
  status: { text: 'Complete' },
  athlete: {
    id: 1,
    nfl_id: 'mock_nfl_id',
    date_of_birth: '1988-13-06T00:00:00+01:00',
    fullname: 'The third, Billius',
  },
  diagnostic_reason: { id: 19, name: 'Injury/ Illness' },
  provider: { id: 123, fullname: 'Provider, Fullname' },
  created_by: {
    fullname: 'Dr. K',
    id: 950754,
  },
  body_area: { id: 1, name: 'mock body part' },
  diagnostic_date: '2022-05-15T23:00:00Z',
  order_date: '2022-03-15T23:00:00Z',
  cpt_code: 90210,
  id: 180094,
  issue_occurrences: [
    {
      full_pathology: 'Adductor strain [Right]',
      id: 2,
      issue_type: 'Injury',
      occurrence_date: '2022-05-06T00:00:00+01:00',
    },
  ],
  location: {
    id: 666,
    name: 'Mock company',
  },
  laterality: { id: 1, name: 'left' },
  medical_meta: {},
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: 'Cardiac Data',
  organisation_id: 37,
  team_name: 'Rottenham FC',
  diagnostic_type_answers: [
    {
      datetime: null,
      diagnostic_type_question: {
        description: '',
        diagnostic_type_question_choices: [],
        id: 5,
        label: 'This is a mock text question',
        question_type: 'text',
        required: false,
      },
      diagnostic_type_question_choice: null,
      id: 28,
      text: 'This is mock text input',
    },
  ],
};
const data = {
  diagnostics: [
    diagnosticOne,
    diagnosticTwo,
    diagnosticThree,
    diagnosticFour,
    diagnosticFive,
    diagnosticSix,
    diagnosticSeven,
  ],
  total_count: 1000,
  meta: { next_page: null },
};

const handler = rest.post('/medical/diagnostics/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
