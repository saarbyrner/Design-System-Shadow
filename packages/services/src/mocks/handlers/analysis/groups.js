import { rest } from 'msw';

const data = [
  {
    id: 1,
    organisation_id: 6,
    name: 'Group 1',
    expression:
      '{"operator":"and","operands":[{"operator":"eq","path":"athlete/labels","value":"u21"},{"operator":"eq","path":"athlete/labels","value":"new york"}]}',
    created_at: '2024-01-04 11:59:45.972049',
    updated_at: '2024-01-04 11:59:45.972049',
  },
  {
    id: 2,
    organisation_id: 6,
    name: 'Group 2',
    expression:
      '{"operator":"and","operands":[{"operator":"eq","path":"athlete/labels","value":"u21"},{"operator":"eq","path":"athlete/labels","value":"new york"}]}',
    created_at: '2024-01-04 11:59:45.972049',
    updated_at: '2024-01-04 11:59:45.972049',
  },
  {
    id: 3,
    organisation_id: 6,
    name: 'Group 3',
    expression:
      '{"operator":"and","operands":[{"operator":"eq","path":"athlete/labels","value":"u21"},{"operator":"eq","path":"athlete/labels","value":"new york"}]}',
    created_at: '2024-01-04 11:59:45.972049',
    updated_at: '2024-01-04 11:59:45.972049',
  },
];
const dataById = {
  1: {
    id: 1,
    organisation_id: 6,
    name: 'Group 1',
    expression:
      '{"operator":"and","operands":[{"operator":"eq","path":"athlete/labels","value":"u21"},{"operator":"eq","path":"athlete/labels","value":"new york"}]}',
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
    id: 2,
    organisation_id: 6,
    name: 'Group 2',
    expression:
      '{"operator":"and","operands":[{"operator":"eq","path":"athlete/labels","value":"u21"},{"operator":"eq","path":"athlete/labels","value":"new york"}]}',
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
        id: 58248,
        firstname: 'Jane',
        lastname: 'Doe',
        fullname: 'Jane Doe',
        shortname: 'Jane',
        user_id: 118386,
      },
    ],
  },
  3: {
    id: 3,
    organisation_id: 6,
    name: 'Group 3',
    expression:
      '{"operator":"and","operands":[{"operator":"eq","path":"athlete/labels","value":"u21"},{"operator":"eq","path":"athlete/labels","value":"new york"}]}',
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
      {
        id: 58247,
        firstname: 'John',
        lastname: 'smith',
        fullname: 'John smith',
        shortname: 'John',
        user_id: 118386,
      },
      {
        id: 58248,
        firstname: 'Jane',
        lastname: 'Doe',
        fullname: 'Jane Doe',
        shortname: 'Jane',
        user_id: 118386,
      },
    ],
  },
};

const handler = rest.get('/ui/segments', (req, res, ctx) =>
  res(ctx.json(data))
);

const handlerById = rest.get('/ui/segments/:segmentId', async (req, res, ctx) =>
  res(ctx.json(dataById[req.params.segmentId]))
);

export { handler, data, handlerById, dataById };
