/* eslint-disable camelcase */
import { rest } from 'msw';

const org_last_transfer_record = {
  transfer_type: 'Trade',
  joined_at: null,
  left_at: '2022-11-22T05:01:08-05:00',
  data_sharing_consent: true,
};

const open_issue_occurrences = [
  {
    id: 16628,
    issue_id: 16602,
    name: '28 Aug 2023 - Capitellar osteochondrosis [Left]',
    status: 'Unavailable - time-loss',
    causing_unavailability: true,
    issue_type: 'Illness',
  },
  {
    id: 16627,
    issue_id: 16601,
    name: '28 Aug 2023 - Abdominal Aortic Aneurysm [Left]',
    status: 'Available - modified',
    causing_unavailability: false,
    issue_type: 'Illness',
  },
  {
    id: 16626,
    issue_id: 16600,
    name: '28 Aug 2023 - Otalgia [Left]',
    status: 'Available - not modified',
    causing_unavailability: false,
    issue_type: 'Illness',
  },
  {
    id: 16641,
    issue_id: 16615,
    name: '20 Aug 2023 - Otalgia [Left]',
    status: 'Unavailable - time-loss',
    causing_unavailability: true,
    issue_type: 'Illness',
  },
  {
    id: 16355,
    issue_id: 16330,
    name: '7 Aug 2023 - Abcess Forearm [Left]',
    status: 'Unavailable - time-loss',
    causing_unavailability: true,
    issue_type: 'Illness',
  },
  {
    id: 16338,
    issue_id: 16314,
    name: '31 Jul 2023 - Abcess Ankle (excl. Joint) [Left]',
    status: 'Available - not modified',
    causing_unavailability: false,
    issue_type: 'Illness',
  },
  {
    id: 18272,
    issue_id: 18247,
    name: '1 Aug 2023 - Abcess Elbow (excl. Joint) [Right]',
    status: 'Unavailable - time-loss',
    causing_unavailability: true,
    issue_type: 'Illness',
  },
];

const avatar_url =
  'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100';

const athletes = [
  {
    id: 372,
    fullname: 'Tommie Weber',
    avatar_url,
    org_last_transfer_record,
    open_issue_occurrences: open_issue_occurrences.slice(0, 1),
  },
  {
    id: 436,
    fullname: 'Merle Rolfson',
    avatar_url,
    org_last_transfer_record,
  },
  {
    id: 781,
    fullname: 'Marco Halvorson',
    avatar_url,
    org_last_transfer_record,
    open_issue_occurrences: open_issue_occurrences.slice(1, 3),
  },
  {
    id: 784,
    fullname: 'Kobe McClure',
    avatar_url,
    org_last_transfer_record,
    open_issue_occurrences: open_issue_occurrences.slice(3, 5),
  },
  {
    id: 858,
    fullname: 'Gwen Mante',
    avatar_url,
    org_last_transfer_record,
    open_issue_occurrences: open_issue_occurrences.slice(5, 7),
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
const handler = rest.post('medical/rosters/past_athletes', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
