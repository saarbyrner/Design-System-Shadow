// @flow
import { rest } from 'msw';

import { GET_FORM_HEADER_DEFAULTS_ROUTE } from '@kitman/services/src/services/formTemplates/api/formBuilder/getFormHeaderDefaults';

const data = {
  hidden: true,
  image: {
    hidden: false,
    current_organisation_logo: false,
    attachment_id: 12345,
  },
  text: {
    hidden: false,
    content: 'some text content',
    color: '#000000',
  },
  color: {
    primary: '#123abc',
  },
  layout: 'left',
};

const handler = rest.get(GET_FORM_HEADER_DEFAULTS_ROUTE, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
