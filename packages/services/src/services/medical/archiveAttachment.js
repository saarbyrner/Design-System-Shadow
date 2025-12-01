// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';

export type ArchiveAttachmentResponse = {
  attachment: Attachment,
};

const archiveAttachment = async (
  attachmentId: number,
  archiveReasonId: number
): Promise<ArchiveAttachmentResponse> => {
  const url = `/attachments/${attachmentId}/archive`;

  const { data } = await axios.patch(url, {
    archive_reason_id: archiveReasonId,
  });

  return data;
};

export default archiveAttachment;
