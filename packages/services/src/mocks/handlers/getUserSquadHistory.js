import { rest } from 'msw';

const data = [
  {
    id: 961,
    user_id: 123,
    squad: {
      id: 3497,
      name: 'U19',
      owner_name: 'KL Galaxy',
      logo_full_path:
        'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0\u0026fit=fill\u0026trim=off\u0026bg=00FFFFFF\u0026w=100\u0026h=100',
      division: [
        {
          id: 1,
          name: 'KLS Next',
        },
      ],
    },
    joined_at: '2024-03-15T11:41:07Z',
    left_at: '2024-03-18T15:01:19Z',
  },
  {
    id: 1005,
    user_id: 123,
    squad: {
      id: 3492,
      name: '18',
      division: [
        {
          id: 1,
          name: 'KLS Next',
        },
      ],
    },
    joined_at: '2024-03-18T15:01:19Z',
    left_at: '2024-03-19T08:50:34Z',
  },
  {
    id: 1006,
    user_id: 123,
    squad: {
      id: 3495,
      name: 'U16',
      owner_name: 'KL Galaxy',
      logo_full_path:
        'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0\u0026fit=fill\u0026trim=off\u0026bg=00FFFFFF\u0026w=100\u0026h=100',
      division: [
        {
          id: 1,
          name: 'KLS Next',
        },
      ],
    },
    joined_at: '2024-03-18T15:01:19Z',
    left_at: null,
  },
];

const meta = {
  current_page: 0,
  next_page: null,
  prev_page: null,
  total_pages: 0,
  total_count: 0,
};

export const response = {
  data,
  meta,
};

const handler = rest.post('/users/squad_history', (req, res, ctx) =>
  res(ctx.json(response))
);

export { handler, data };
