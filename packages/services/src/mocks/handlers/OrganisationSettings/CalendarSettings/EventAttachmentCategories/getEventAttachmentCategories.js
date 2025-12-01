// @flow

import { rest } from 'msw';
import type { EventAttachmentCategory } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/types';
import { eventAttachmentCategoryUrlBase } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/consts';

const category1: EventAttachmentCategory = {
  id: 12,
  archived: false,
  name: 'My Images',
  created_at: '2021-12-07T11:41:45Z',
  updated_at: '2021-12-07T11:41:45Z',
};

const category2: EventAttachmentCategory = {
  id: 323,
  archived: false,
  name: 'Medical',
  created_at: '2021-12-07T11:41:45Z',
  updated_at: '2021-12-07T11:41:45Z',
};

const data = [category1, category2];

const handler = rest.get(eventAttachmentCategoryUrlBase, (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
