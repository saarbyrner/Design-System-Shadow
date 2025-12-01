import { rest } from 'msw';

const workersCompResponse = {
  claimNumber: '73 WC 000000253895',
  message: 'Claim received.',
  success: true,
  workers_comp: {
    athlete_address_line_1: '123 Address Rd.',
    athlete_address_line_2: 'Apt. 101',
    athlete_city: 'Los Angeles',
    athlete_dob: '1988-06-13',
    athlete_first_name: 'Athlete',
    athlete_last_name: 'Athlete-Lastname',
    athlete_phone_number: '605-555-4321',
    athlete_position: 'FUllback',
    social_security_number: '123-32-1234',
    athlete_state: 'CA',
    athlete_zip: '90210',
    claim_number: '73 WC 000000253895',
    created_at: '2023-01-02T14:58:42Z',
    guid: '788f1c1f-78ce-487f-ab99-da58b3737c92',
    id: 5,
    loss_city: 'Boston',
    loss_description: 'Description includes body area and laterality',
    loss_jurisdiction: 'Boston',
    loss_state: 'MA',
    loss_time: '09:44:42',
    policy_number: '9784563125',
    report_date: '22023-01-04',
    reporter_first_name: 'Reporter',
    reporter_last_name: 'Reporter-Lastname',
    reporter_phone_number: '917-555-1234',
    status: 'submitted',
    updated_at: '2023-01-04T15:23:38Z',
    side_id: 1,
    body_area_id: 1,
  },
};

const data = {
  workersCompResponse,
};

const handler = rest.post(
  `/athletes/${workersCompResponse.workers_comp.athlete_id}/workers_comps`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
