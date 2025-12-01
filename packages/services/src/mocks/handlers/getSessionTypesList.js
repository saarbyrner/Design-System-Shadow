// @flow
import { rest } from 'msw';

export const data = ['Catapult', 'Fitbit', 'GPS'];

const getSessionTypesList = rest.get(
  '/session_types/session_type_names_list',
  (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export default getSessionTypesList;
