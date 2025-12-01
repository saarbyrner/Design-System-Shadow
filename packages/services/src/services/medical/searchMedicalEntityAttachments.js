// @flow
import type {
  EntityAttachment,
  EntityAttachmentFilters,
} from '@kitman/modules/src/Medical/shared/types/medical';
import { axios } from '@kitman/common/src/utils/services';

export type EntityAttachmentSearchResponse = {
  entity_attachments: Array<EntityAttachment>,
  meta: {
    pagination: {
      next_token: ?string,
    },
  },
};

const searchMedicalEntityAttachments = async (
  filters: EntityAttachmentFilters,
  nextPageToken: ?string,
  abortSignal?: AbortSignal
): Promise<EntityAttachmentSearchResponse> => {
  const { data } = await axios.post(
    '/medical/entity_attachments/search',
    {
      filters,
      pagination: {
        page_size: 50,
        next_token: nextPageToken,
      },
    },
    abortSignal ? { signal: abortSignal } : {}
  );

  return data;
};

export default searchMedicalEntityAttachments;
