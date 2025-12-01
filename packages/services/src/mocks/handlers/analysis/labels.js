import { rest } from 'msw';

const data = [
  {
    id: 1,
    organisation_id: 6,
    user_id: 123,
    name: 'Label One',
    description: 'this is a label description',
    color: '#ffffff',
    created_at: '2024-01-04 11:59:45.972049',
    updated_at: '2024-01-04 11:59:45.972049',
  },
  {
    id: 2,
    organisation_id: 6,
    user_id: 1234,
    name: 'Label Two',
    description: 'this is a label description',
    color: '#123456',
    created_at: '2024-01-04 11:59:45.972049',
    updated_at: '2024-01-04 11:59:45.972049',
  },
  {
    id: 3,
    organisation_id: 6,
    user_id: 1234,
    name: 'Label Three',
    description: 'this is a label description',
    color: '#bada55',
    created_at: '2024-01-04 11:59:45.972049',
    updated_at: '2024-01-04 11:59:45.972049',
  },
];

const dataById = {
  1: {
    id: 1,
    organisation_id: 6,
    user_id: 123,
    name: 'Label One',
    description: 'this is a label description',
    color: '#ffffff',
    created_at: '2024-01-04 11:59:45.972049',
    updated_at: '2024-01-04 11:59:45.972049',
    athletes: [
      {
        id: 33925,
        firstname: 'AJ',
        lastname: 'McClune',
        fullname: 'AJ McClune',
        shortname: 'AJ',
        user_id: 38187,
      },
      {
        id: 58246,
        firstname: 'AndroidChat',
        lastname: 'Tester2',
        fullname: 'AndroidChat Tester2',
        shortname: 'AndroidChat',
        user_id: 118386,
      },
    ],
  },
  2: {
    id: 1,
    organisation_id: 6,
    user_id: 123,
    name: 'Label Two',
    description: 'this is a label description',
    color: '#ffffff',
    created_at: '2024-01-04 11:59:45.972049',
    updated_at: '2024-01-04 11:59:45.972049',
    athletes: [
      {
        id: 33925,
        firstname: 'AJ',
        lastname: 'McClune',
        fullname: 'AJ McClune',
        shortname: 'AJ',
        user_id: 38187,
      },
    ],
  },
  3: {
    id: 1,
    organisation_id: 6,
    user_id: 123,
    name: 'Label Two',
    description: 'this is a label description',
    color: '#ffffff',
    created_at: '2024-01-04 11:59:45.972049',
    updated_at: '2024-01-04 11:59:45.972049',
    athletes: [
      {
        id: 1,
        firstname: 'Athlete',
        lastname: 'One',
        fullname: 'Athlete One',
        shortname: 'A. One',
        user_id: 1,
        avatar_url: 'url_string',
      },
      {
        id: 2,
        firstname: 'Athlete',
        lastname: 'Two',
        fullname: 'Athlete Two',
        shortname: 'A. Two',
        user_id: 2,
        avatar_url: 'url_string',
      },
      {
        id: 3,
        firstname: 'Athlete',
        lastname: 'Three',
        fullname: 'Athlete Three',
        shortname: 'A. Three',
        user_id: 3,
        avatar_url: 'url_string',
      },
    ],
  },
};

const handler = rest.get('/ui/labels', (req, res, ctx) => res(ctx.json(data)));

const handlerById = rest.get('/ui/labels/:labelId', async (req, res, ctx) =>
  res(ctx.json(dataById[req.params.labelId]))
);

export { handler, data, handlerById, dataById };
