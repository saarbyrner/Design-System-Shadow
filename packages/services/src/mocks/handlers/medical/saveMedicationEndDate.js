import { rest } from 'msw';

const diagnostic = {
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
      download_url: 'http://s3:9000/some_awesome/download/url/',
      filename: 'filePond.png',
      filesize: 16170,
      filetype: 'image/png',
      id: 159875,
      presigned_post: null,
      url: 'http://s3:9000/some_awesome/url/',
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
    is_completed: true,
    notes: 'They should take the medication twice a day',
    start_date: '2022-07-24T23:00:00Z',
    end_date: '2022-08-08T23:00:00Z',
    type: 'Panadol',
  },
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: 'Medication',
};
const data = {
  diagnostic,
};

const handler = rest.post(
  `/athletes/${diagnostic.athleteId}/diagnostics/${diagnostic.id}/medication_complete`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
