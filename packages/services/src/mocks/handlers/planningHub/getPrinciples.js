import { rest } from 'msw';
import { data as principleCategories } from './getPrincipleCategories';
import { data as principleType } from './getPrincipleTypes';
import { data as phases } from './getPhases';
import { data as squads } from '../getSquads';

const data = [
  {
    id: 1,
    name: 'Long pass',
    principle_categories: principleCategories,
    principle_types: principleType,
    phases,
    squads,
  },
  {
    id: 2,
    name: 'Catching skills',
    principle_categories: principleCategories,
    principle_types: principleType,
    phases,
    squads,
  },
];

const handler = rest.post(
  '/ui/planning_hub/principles/search',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
