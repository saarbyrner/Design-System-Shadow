import { rest } from 'msw';
import { emergencyContacts, insurancePolicyOwners } from './data.mock';

const handler = (param) =>
  rest.get(`/ui/relationships?context=${param}`, (req, res, ctx) => {
    if (param === 'emergency_contacts') res(ctx.json(emergencyContacts));
    else res(ctx.json(insurancePolicyOwners));
  });

const data = { emergencyContacts, insurancePolicyOwners };

export { handler, data };
