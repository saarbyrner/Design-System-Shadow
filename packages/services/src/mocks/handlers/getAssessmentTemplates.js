import { rest } from 'msw';
import { GENERIC_ASSESSMENT_TEMPLATES_ENDPOINT } from '@kitman/services/src/services/getAssessmentTemplates';

const data = {
  assessment_templates: [
    {
      id: 1,
      name: 'Assessment Template 1',
    },
    {
      id: 2,
      name: 'Assessment Template 2',
    },
  ],
};

const handler = rest.get(
  GENERIC_ASSESSMENT_TEMPLATES_ENDPOINT,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
