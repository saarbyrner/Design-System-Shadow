// @flow
import { axios } from '@kitman/common/src/utils/services';

type MatchNoticeEmailDetails = {
  notificationType?: string,
  eventId: number,
  matchNoticeType: string,
  recipients: Array<string>,
  subject: string,
  message: string,
  messageFormat?: string,
  attachmentIds: Array<number>,
};

const sendMatchNoticeEmail = async ({
  notificationType = 'event',
  eventId,
  matchNoticeType,
  recipients,
  subject,
  message,
  messageFormat = 'html',
  attachmentIds,
}: MatchNoticeEmailDetails) => {
  await axios.post('/notifications/send_email', {
    notificationable_type: notificationType,
    notificationable_id: eventId,
    kind: matchNoticeType,
    recipients,
    subject,
    message,
    message_format: messageFormat,
    attachment_ids: attachmentIds,
  });
};

export default sendMatchNoticeEmail;
