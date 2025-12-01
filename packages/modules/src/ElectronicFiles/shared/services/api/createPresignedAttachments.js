// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  UnconfirmedAttachments,
  PresignedAttachments,
} from '@kitman/modules/src/ElectronicFiles/shared/types';

export const endpoint = '/efax/outbound_messages/create_presigned_attachments';

const createPresignedAttachments = async (
  attachments: UnconfirmedAttachments
): Promise<PresignedAttachments> => {
  const { data } = await axios.post(endpoint, attachments);

  return data;
};

export default createPresignedAttachments;
