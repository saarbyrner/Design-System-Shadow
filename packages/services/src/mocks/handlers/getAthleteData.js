import { rest } from 'msw';

const data = {
  id: 1,
  fullname: 'John Doe',
  avatar_url: 'https://kitman-staging.imgix.net/avatar.jpg',
  availability: 'unavailable',
  date_of_birth: '12 Oct 1990',
  age: 31,
  height: null,
  country: 'Ireland',
  squad_names: [
    { id: 1, name: 'International Squad' },
    { id: 2, name: 'Academy Squad' },
  ],
  allergy_names: ['Penicillin allergy', 'Pollen allergy'],
  unresolved_issues_count: 2,
  position: 'Fullback',
  position_group: 'Back',
  org_last_transfer_record: {
    transfer_type: 'Trade',
    joined_at: '2022-12-15T05:04:33',
    left_at: '2022-12-15T05:04:33',
    data_sharing_consent: true,
  },
  is_active: true,
};
const handler = rest.get('/medical/athletes/:athleteId', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
