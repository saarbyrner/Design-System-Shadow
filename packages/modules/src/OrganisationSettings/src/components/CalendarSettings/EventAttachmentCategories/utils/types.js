// @flow

import type { EventAttachmentCategoryCommon } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventAttachmentCategories/utils/types';

export type ChangeNameData = {
  newName: string,
  categoryIndex: number,
};

export type OnChangingName = (changeNameData: ChangeNameData) => void;

export type TableCategory = $Exact<{
  id: string,
  ...EventAttachmentCategoryCommon,
}>;
