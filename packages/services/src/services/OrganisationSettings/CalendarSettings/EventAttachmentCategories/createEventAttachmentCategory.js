// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  EventAttachmentCategory,
  NewEventAttachmentCategory,
} from './utils/types';
import { eventAttachmentCategoryUrlBase } from './utils/consts';

export const createEventAttachmentCategory = async (
  category: NewEventAttachmentCategory
): Promise<EventAttachmentCategory> => {
  const { data } = await axios.post(eventAttachmentCategoryUrlBase, category);

  return data;
};
