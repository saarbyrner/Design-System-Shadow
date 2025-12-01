import { rest } from 'msw';

const data = {
  permitted_extensions: ['jpg', 'png', 'csv', 'pdf', 'mp4', 'mp3'],
  documents: [
    {
      attachment: {
        id: 4523,
        audio_file: false,
        confirmed: true,
        created_by: {
          id: 124,
          firstname: 'John',
          fullname: 'John Doe',
          lastname: 'Doe',
        },
        download_url: 'http://www.mock-video-download.com',
        filename: 'mock-video.mp4',
        filesize: 1207850,
        filetype: 'binary/octet-stream',
        presigned_post: null,
        url: 'http://www.mock-video.com',
      },
      id: 124565,
      updated_at: '2020-07-27T11:27:03Z',
    },
    {
      attachment: {
        id: 5487,
        audio_file: true,
        confirmed: true,
        created_by: {
          id: 124,
          firstname: 'John',
          fullname: 'John Doe',
          lastname: 'Doe',
        },
        download_url: 'http://www.mock-audio-download.com',
        filename: 'mock-audio.mp3',
        filesize: 934147,
        filetype: 'binary/octet-stream',
        presigned_post: null,
        url: 'http://www.mock-audio.com',
      },
      id: 142354,
      updated_at: '2021-05-27T12:25:00Z',
    },
    {
      attachment: {
        id: 6987,
        audio_file: false,
        confirmed: true,
        created_by: {
          id: 124,
          firstname: 'John',
          fullname: 'John Doe',
          lastname: 'Doe',
        },
        download_url: 'http://www.mock-image-download.com',
        filename: 'mock-image.jpg',
        filesize: 24521,
        filetype: 'binary/octet-stream',
        presigned_post: null,
        url: 'http://www.mock-image.com',
      },
      id: 196670,
      updated_at: '2021-11-27T09:15:00Z',
    },
  ],
};

const handler = rest.get('/ui/initial_data_documents', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
