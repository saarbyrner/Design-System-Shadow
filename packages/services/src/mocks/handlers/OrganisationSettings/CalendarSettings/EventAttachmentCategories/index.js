// @flow

import { handler as getEventAttachmentCategories } from './getEventAttachmentCategories';
import { handler as updateEventAttachmentCategory } from './updateEventAttachmentCategory';
import { handler as createEventAttachmentCategory } from './createEventAttachmentCategory';

export default [
  getEventAttachmentCategories,
  updateEventAttachmentCategory,
  createEventAttachmentCategory,
];
