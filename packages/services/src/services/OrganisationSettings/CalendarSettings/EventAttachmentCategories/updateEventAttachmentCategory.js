// @flow
import { axios } from '@kitman/common/src/utils/services';
import { createUpdateEventAttachmentCategoryUrl } from './utils/helpers';
import type { EventAttachmentCategory } from './utils/types';

export const updateEventAttachmentCategory = async (
  category: EventAttachmentCategory
): Promise<EventAttachmentCategory> => {
  const url = createUpdateEventAttachmentCategoryUrl(category.id);
  const { data } = await axios.put(url, { ...category });
  return data;
};
