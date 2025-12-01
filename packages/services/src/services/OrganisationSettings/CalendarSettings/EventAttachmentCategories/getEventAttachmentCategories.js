// @flow
import { axios } from '@kitman/common/src/utils/services';
import { eventAttachmentCategoryUrlBase } from './utils/consts';
import type { EventAttachmentCategory } from './utils/types';

// Used in the organisation settings
export const getEventAttachmentCategories = async (): Promise<
  Array<EventAttachmentCategory>
> => {
  const { data } = await axios.get(eventAttachmentCategoryUrlBase);

  return data;
};
