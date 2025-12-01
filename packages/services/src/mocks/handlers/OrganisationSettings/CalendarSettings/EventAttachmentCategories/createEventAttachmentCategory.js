// @flow
import { rest } from 'msw';
import type { EventAttachmentCategory } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/types';
import { eventAttachmentCategoryUrlBase } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/consts';

const categoryId = 10;

const data: EventAttachmentCategory = {
  id: categoryId,
  archived: false,
  name: 'My Notebooks',
  created_at: '2021-11-07T11:41:45Z',
  updated_at: '2021-11-07T11:41:45Z',
};

const handler = rest.post(eventAttachmentCategoryUrlBase, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
