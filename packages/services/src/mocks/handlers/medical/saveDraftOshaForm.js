import { rest } from 'msw';

const oshaResponse = {
  athlete_activity: null,
  athlete_id: 23,
  case_number: 123,
  city: 'Somewhere',
  date_hired: '2023-01-02T14:58:42Z',
  date_of_death: null,
  dob: '2023-01-02T14:58:42Z',
  emergency_room: false,
  facility_city: 'City',
  facility_name: 'Facility name',
  facility_state: 'Facility state',
  facility_street: 'Facility street',
  facility_zip: '12345',
  full_name: 'Test Name',
  hospitalized: false,
  issue_date: '2023-01-02T14:58:42Z',
  issue_description: null,
  issue_id: 123,
  issue_type: 'injury',
  object_substance: null,
  physician_full_name: 'Jon Doe',
  reporter_full_name: 'Someone Else',
  reporter_phone_number: null,
  sex: 'M',
  state: 'State',
  street: 'Street',
  time_began_work: '2023-01-02T14:58:42Z',
  time_event: '2023-01-02T14:58:42Z',
  title: 'Test',
  what_happened: 'Something something something',
  zip: '12345',
};

const data = {
  oshaResponse,
};

const handler = rest.post(
  `/athletes/${oshaResponse.athlete_id}/oshas/save_draft`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
