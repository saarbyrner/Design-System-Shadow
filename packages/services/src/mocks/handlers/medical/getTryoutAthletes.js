/* eslint-disable camelcase */
import { rest } from 'msw';

const trial_record = {
  transfer_type: 'Trade',
  joined_at: '2022-11-22T05:01:08',
  left_at: '2022-11-25T05:01:08',
  data_sharing_consent: true,
};

const organisations = [
  {
    id: 1,
    name: 'Kitman Football',
    logo_full_path:
      'https://kitman-staging.imgix.net/kitman_logo_full_bleed.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF&w=32&h=32',
  },
];

const avatar_url =
  'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100';

const athletes = [
  {
    id: 1,
    fullname: 'Stone Cold Steve Austin',
    avatar_url,
    trial_record: {
      ...trial_record,
      left_at: '-1',
    },
    organisations: [
      ...organisations,
      {
        ...organisations[0],
        id: 2,
      },
    ],
  },
  {
    id: 2,
    fullname: 'Yokozuna',
    avatar_url,
    trial_record,
    organisations,
  },
  {
    id: 3,
    fullname: 'Mick Foley',
    avatar_url,
    trial_record,
    organisations,
  },
  {
    id: 4,
    fullname: 'The Rock',
    avatar_url,
    trial_record,
    organisations,
  },
  {
    id: 5,
    fullname: 'Shawn Michaels',
    avatar_url,
    trial_record,
    organisations,
  },
  {
    id: 6,
    fullname: 'The Undertaker',
    avatar_url,
    trial_record,
    organisations,
  },
  {
    id: 7,
    fullname: 'Kane',
    avatar_url,
    trial_record,
    organisations,
  },
];

const data = {
  athletes,
  meta: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 1,
    total_count: 5,
  },
};
const handler = rest.post('medical/rosters/tryout_athletes', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
