// @flow

import { rest } from 'msw';
import {
  getStaffUsersRoute,
  type StaffUserTypes,
  type StaffUserType,
} from '@kitman/services/src/services/medical/getStaffUsers';

export const staffUser1: StaffUserType = {
  id: 1236,
  firstname: 'Stuart',
  lastname: "O'Brien",
  fullname: "Stuart O'Brien",
  email: 'stuart@email.com',
};

const data: StaffUserTypes = [
  staffUser1,
  {
    id: 1239,
    firstname: 'Stephen',
    lastname: 'Smith',
    fullname: 'Stephen Smith',
    email: 'stephan@email.com',
  },
  {
    id: 1571,
    firstname: 'Rod',
    lastname: 'Murphy',
    fullname: 'Rod Murphy',
    email: 'rodmurphy@email.com',
  },
];

// NOTE: There is another handler for the same route
// packages/services/src/mocks/handlers/planning/getStaffOnly.js

const handler = rest.get(getStaffUsersRoute, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
