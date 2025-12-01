import { rest } from 'msw';

const data = {
  document: {
    attachment: {
      id: 8954,
      audio_file: false,
      confirmed: true,
      created_by: {
        id: 124,
        firstname: 'John',
        fullname: 'John Doe',
        lastname: 'Doe',
      },
      download_url: 'http://www.mock-google-sheet-download.com',
      filename: 'mock-google-sheet.csv',
      filesize: 435,
      filetype: 'binary/octet-stream',
      presigned_post: null,
      url: 'http://www.mock-google-sheet.com',
    },
    id: 214354,
    updated_at: '2022-07-27T14:25:00Z',
  },
};

const handler = rest.post('/documents', (req, res, ctx) => res(ctx.json(data)));

export { handler, data };
