// @flow
import type { DateRange } from '@kitman/common/src/types';
import type { EntityAttachmentFileGroup } from '@kitman/common/src/types/Media';
import type { AttachmentEntityType } from './EntityAttachment';

export type EntityAttachmentFilters = {
  id?: ?number, // Filter to a specific attachment id
  entity_types?: ?Array<AttachmentEntityType>, // null or empty array will result in all entity_types
  entity_athlete_id?: ?number,
  entity_date?: ?DateRange, // null entity_date to boundless search
  attachment_date?: ?DateRange, // null attachment_date to boundless search
  filename?: ?string,
  medical_attachment_category_ids?: Array<number>,
  archived?: boolean, // default false
  issue_occurrence: ?{
    id: ?number,
    type: ?string,
  },
  file_types?: ?Array<EntityAttachmentFileGroup>,
};
