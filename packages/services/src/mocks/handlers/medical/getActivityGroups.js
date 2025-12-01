import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Rugby Game',
    event_type: 'game',
    meta: true,
    activities: [
      { id: 3, name: 'Collision' },
      { id: 9, name: 'Lineout' },
      { id: 10, name: 'Other Contact' },
      { id: 8, name: 'Scrum' },
      { id: 1, name: 'Tackled' },
      { id: 2, name: 'Tackling' },
    ],
  },
  {
    id: 26,
    name: 'Rugby Non Contact',
    event_type: 'game',
    meta: false,
    activities: [
      { id: 5, name: 'Catching' },
      { id: 4, name: 'Kicking' },
      { id: 11, name: 'Other Non Contact' },
      { id: 12, name: 'Running' },
      { id: 13, name: 'Unknown' },
    ],
  },
  {
    id: 4,
    name: 'Other',
    event_type: 'other',
    meta: false,
    activities: [{ id: 35, name: 'Other', require_additional_input: true }],
  },
  {
    id: 7,
    name: 'Gym Session',
    event_type: 'training',
    meta: false,
    activities: [{ id: 67, name: 'Plyometrics' }],
  },
  {
    id: 2,
    name: 'Rugby Training',
    event_type: 'training',
    meta: false,
    activities: [
      { id: 16, name: 'Collision' },
      { id: 22, name: 'Lineout' },
      { id: 20, name: 'Maul' },
      { id: 23, name: 'Other Contact' },
      { id: 19, name: 'Ruck' },
      { id: 21, name: 'Scrum' },
      { id: 14, name: 'Tackled' },
      { id: 15, name: 'Tackling' },
    ],
  },
  {
    id: 27,
    name: 'Rugby Training Non Contact',
    event_type: 'training',
    meta: false,
    activities: [
      { id: 18, name: 'Catching' },
      { id: 17, name: 'Kicking' },
      { id: 24, name: 'Other Non Contact' },
      { id: 25, name: 'Running' },
      { id: 26, name: 'Unknown' },
    ],
  },
  {
    id: 3,
    name: 'S & C',
    event_type: 'training',
    meta: false,
    activities: [
      { id: 32, name: 'Agility' },
      { id: 30, name: 'Conditioning' },
      { id: 27, name: 'LL Strength' },
      { id: 31, name: 'NWB Conditioning' },
      { id: 34, name: 'Plyometrics' },
      { id: 33, name: 'Speed' },
      { id: 29, name: 'TB Strength' },
      { id: 28, name: 'UL Strength' },
    ],
  },
];
const handler = rest.get('/ui/medical/injuries/activities', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
