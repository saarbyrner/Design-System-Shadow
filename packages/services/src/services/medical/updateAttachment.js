// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';

export type UpdateAttachmentResponse = {
  attachment: Attachment,
};

export type AttachmentUpdateData = {
  name?: string,
  medical_attachment_category_ids?: Array<number>,
};

const updateAttachment = async (
  attachmentId: number,
  attachmentUpdateData: AttachmentUpdateData
): Promise<UpdateAttachmentResponse> => {
  const url = `/attachments/${attachmentId}`;

  const { data } = await axios.patch(url, attachmentUpdateData);

  return data;
};

export default updateAttachment;
