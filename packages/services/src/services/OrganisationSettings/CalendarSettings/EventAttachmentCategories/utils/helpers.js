// @flow

import { eventAttachmentCategoryUrlBase } from './consts';

export const createUpdateEventAttachmentCategoryUrl = (id: number) =>
  `${eventAttachmentCategoryUrlBase}/${id}`;
