// @flow
import { rest } from 'msw';

import type { EventAttachmentCategory } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/types';
import { eventAttachmentCategoryUrlBase } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/consts';

export const categoryId = 10;

const data: EventAttachmentCategory = {
  id: categoryId,
  archived: false,
  name: 'My Photos',
  created_at: '2021-12-07T11:41:45Z',
  updated_at: '2021-12-07T11:41:45Z',
};

const handler = rest.put(
  new RegExp(eventAttachmentCategoryUrlBase),
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
