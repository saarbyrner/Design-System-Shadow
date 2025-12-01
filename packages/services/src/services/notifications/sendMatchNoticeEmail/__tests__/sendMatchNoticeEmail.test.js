import { axios } from '@kitman/common/src/utils/services';
import sendMatchNoticeEmail from '../index';

describe('sendMatchNoticeEmail', () => {
  const emailItemsToSave = {
    eventId: '123',
    matchNoticeType: 'dmn',
    recipients: ['joe_doe@email.com'],
    subject: 'subject',
    message: 'message',
    attachment_ids: [1],
  };

  describe('success', () => {
    beforeEach(() => jest.spyOn(axios, 'post').mockResolvedValue({ data: {} }));

    afterEach(() => jest.restoreAllMocks());

    it('makes a backend call to send off the match notice email', async () => {
      await sendMatchNoticeEmail(emailItemsToSave);

      expect(axios.post).toHaveBeenCalledWith('/notifications/send_email', {
        attachment_ids: undefined,
        kind: 'dmn',
        message: 'message',
        message_format: 'html',
        notificationable_id: '123',
        notificationable_type: 'event',
        recipients: ['joe_doe@email.com'],
        subject: 'subject',
      });
    });
  });
});
