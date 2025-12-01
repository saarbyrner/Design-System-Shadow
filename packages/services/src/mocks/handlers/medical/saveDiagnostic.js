import { rest } from 'msw';

const diagnostic = {
  attached_links: [],
  attachments: [
    {
      audio_file: false,
      confirmed: true,
      created_by: {
        id: 126841,
        firstname: 'Greg',
        lastname: 'Levine-Rozenvayn',
        fullname: 'Greg Levine-Rozenvayn',
      },
      download_url: 'http://s3:9000/super_cool/download.url',
      filename: 'awesome_movie.mov',
      filesize: 9588627,
      filetype: 'video/quicktime',
      id: 160789,
      presigned_post: null,
      url: 'http://s3:9000/url_for_you.io',
    },
  ],
  diagnostic_date: '2022-06-02T23:00:00Z',
  id: 168865,
  is_medication: false,
  medical_meta: {},
  restricted_to_doc: false,
  restricted_to_psych: false,
  type: 'Bandage',
  prescriber: {
    id: 453522,
    name: 'Dr. Dolittle',
  },
};
const data = {
  diagnostic,
};

const handler = rest.post(
  `/athletes/${diagnostic.athleteId}/diagnostics`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
