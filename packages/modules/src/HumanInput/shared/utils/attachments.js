// @flow
/* eslint-disable camelcase */
import i18n from '@kitman/common/src/utils/i18n';
import fileSizeLabel from '@kitman/common/src/utils/fileSizeLabel';
import type {
  FormAttachment,
  QueuedItemType,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import { INPUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import type { HumanInputFormAnswer } from '@kitman/modules/src/HumanInput/types/forms';

export const attachmentStatusesEnumLike = Object.freeze({
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
});

export type AttachmentStatusTypes = $Values<typeof attachmentStatusesEnumLike>;

export const getAttachmentStatusObject = (
  repeatableGroupInfo: ?{ repeatable: boolean, groupNumber: number },
  queuedAttachment: QueuedItemType,
  attachmentState: AttachmentStatusTypes,
  attachment: ?$Shape<FormAttachment>,
  message: ?string
) => {
  let newElementAttachment = {};
  let attachmentGroupObjects;

  switch (attachmentState) {
    case attachmentStatusesEnumLike.UNSUPPORTED_FORMAT:
      newElementAttachment = {
        file: attachment,
        state: attachmentStatusesEnumLike.FAILURE,
        message: `${i18n.t('Unsupported format')} • ${i18n.t('Failed')}`,
      };
      break;

    case attachmentStatusesEnumLike.IDLE:
      newElementAttachment = {
        file: attachment,
        state: attachmentStatusesEnumLike.IDLE,
        message: `${fileSizeLabel(attachment?.fileSize || 0, true)} • ${i18n.t(
          'Queued'
        )}`,
      };
      break;

    case attachmentStatusesEnumLike.PENDING:
      newElementAttachment = {
        file: attachment,
        state: attachmentStatusesEnumLike.PENDING,
        message: `${fileSizeLabel(attachment?.fileSize || 0, true)} • ${i18n.t(
          'Pending'
        )}`,
      };
      break;

    case attachmentStatusesEnumLike.SUCCESS:
      newElementAttachment = {
        file: attachment,
        state: attachmentStatusesEnumLike.SUCCESS,
        message: `${i18n.t('File accepted')} • ${i18n.t('Success')}`,
      };
      break;

    case attachmentStatusesEnumLike.FAILURE:
      newElementAttachment = {
        state: attachmentStatusesEnumLike.FAILURE,
        message: `${i18n.t('Upload failed')} • ${i18n.t('Failed')} • ${
          message || ''
        }`,
      };
      break;

    default:
      break;
  }

  if (repeatableGroupInfo?.repeatable) {
    attachmentGroupObjects = Array.isArray(queuedAttachment)
      ? [...queuedAttachment]
      : [];

    attachmentGroupObjects[repeatableGroupInfo.groupNumber] =
      newElementAttachment;

    return attachmentGroupObjects;
  }

  return newElementAttachment;
};

export const getInitialRepeatableGroupElementAttachments = (
  elementId: number,
  attachmentFile: Object
) => ({
  [elementId]: attachmentFile.attachment.map(
    (repeatableGroupElementAttachment) => {
      return repeatableGroupElementAttachment
        ? {
            file: repeatableGroupElementAttachment,
            state: attachmentStatusesEnumLike.SUCCESS,
            message: `${i18n.t('File accepted')} • ${i18n.t('Success')}`,
          }
        : null;
    }
  ),
});

export const fetchAttachments = async (
  formAnswers: Array<HumanInputFormAnswer>
) => {
  const attachmentAnswers = formAnswers.filter(
    (formAnswer) =>
      formAnswer.form_element.element_type === INPUT_ELEMENTS.Attachment
  );

  const getAttachmentObject = (attachment, attachmentId) => ({
    blobUrl: attachment?.url,
    filename: attachment?.filename,
    fileType: attachment?.filetype,
    fileSize: attachment?.filesize,
    fileTitle: attachment?.filename,
    id: attachmentId,
    createdDate: attachment?.created,
  });

  const attachmentsFiles = await Promise.all(
    attachmentAnswers.map(async (attachmentAnswer) => {
      const { value, form_element, attachment, attachments } = attachmentAnswer;

      if (Array.isArray(value)) {
        return {
          elementId: form_element.id,
          attachment: attachments?.map((repeatedAttachment) => {
            if (repeatedAttachment) {
              return getAttachmentObject(repeatedAttachment, value);
            }
            return null;
          }),
        };
      }

      return {
        elementId: form_element.id,
        attachment: getAttachmentObject(attachment, value),
      };
    })
  );

  return attachmentsFiles;
};
export default fetchAttachments;
