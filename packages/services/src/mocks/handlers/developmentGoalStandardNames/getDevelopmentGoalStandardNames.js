// @flow
import { rest } from 'msw';
import { GENERIC_GET_DEVELOPMENT_GOAL_STANDARD_NAMES_ENDPOINT } from '@kitman/services/src/services/developmentGoalStandardNames/getDevelopmentGoalStandardNames';

const data = [
  {
    id: 1,
    standard_name: 'Goals',
  },
  {
    id: 2,
    standard_name: 'Total Shots',
  },
  {
    id: 3,
    standard_name: 'Shots On Target',
  },
  {
    id: 4,
    standard_name: 'Shots Off Target',
  },
];

const handler = rest.get(
  GENERIC_GET_DEVELOPMENT_GOAL_STANDARD_NAMES_ENDPOINT,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
