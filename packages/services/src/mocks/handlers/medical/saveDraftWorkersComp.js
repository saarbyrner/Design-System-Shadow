import { rest } from 'msw';

const workersCompResponse = {
  athlete_address_line_1: '123 Address Rd.',
  athlete_address_line_2: 'Apt. 101',
  athlete_city: 'Los Angeles',
  athlete_dob: null,
  athlete_first_name: 'Athlete',
  athlete_last_name: 'Athlete-Lastname',
  athlete_phone_number: null,
  athlete_position: null,
  social_security_number: null,
  athlete_state: 'CA',
  athlete_zip: '90210',
  claim_number: null,
  created_at: '2023-01-02T14:58:42Z',
  guid: null,
  id: 6,
  loss_city: 'Boston',
  loss_description: 'Ouchie on left knee.',
  loss_jurisdiction: null,
  loss_state: 'MA',
  loss_time: null,
  policy_number: '9784563125',
  report_date: null,
  reporter_first_name: 'Reporter',
  reporter_last_name: 'Reporter-Lastname',
  reporter_phone_number: null,
  status: 'draft',
  updated_at: '2023-01-04T15:23:38Z',
  side_id: 1,
  body_area_id: 1,
};

const data = {
  workersCompResponse,
};

const handler = rest.post(
  `/athletes/${workersCompResponse.athlete_id}/workers_comps/save_draft`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
