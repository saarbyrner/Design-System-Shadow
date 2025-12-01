/* eslint-disable camelcase */

import {
  fetchAttachments,
  getAttachmentStatusObject,
  getInitialRepeatableGroupElementAttachments,
  attachmentStatusesEnumLike,
} from '@kitman/modules/src/HumanInput/shared/utils/attachments';

import { nonRepeatableAttachmentFormAnswerSets } from '@kitman/modules/src/HumanInput/shared/utils/mocks/attachments.mock';

describe('attachment utils', () => {
  describe('getInitialRepeatableGroupElementAttachments', () => {
    it('returns initial attachments for element that belongs to a repeatable group', () => {
      const elementId = 1;
      const attachmentFile = {
        attachment: [
          {
            blobUrl: 'url',
            filename: 'filename',
            fileType: 'filetype',
            fileSize: 'filesize',
            fileTitle: 'filetitle',
            id: 'id',
            createdDate: 'createdDate',
          },
          {
            blobUrl: 'url2',
            filename: 'filename2',
            fileType: 'filetype2',
            fileSize: 'filesize2',
            fileTitle: 'filetitle2',
            id: 'id2',
            createdDate: 'createdDate2',
          },
        ],
      };

      const result = getInitialRepeatableGroupElementAttachments(
        elementId,
        attachmentFile
      );

      expect(result).toEqual({
        [elementId]: [
          {
            file: attachmentFile.attachment[0],
            state: attachmentStatusesEnumLike.SUCCESS,
            message: 'File accepted • Success',
          },
          {
            file: attachmentFile.attachment[1],
            state: attachmentStatusesEnumLike.SUCCESS,
            message: 'File accepted • Success',
          },
        ],
      });
    });

    it('returns initial attachments for element that belongs to a repeatable group with null support', () => {
      const elementId = 1;
      const attachmentFile = {
        attachment: [
          {
            blobUrl: 'url',
            filename: 'filename',
            fileType: 'filetype',
            fileSize: 'filesize',
            fileTitle: 'filetitle',
            id: 'id',
            createdDate: 'createdDate',
          },
          null,
        ],
      };

      const result = getInitialRepeatableGroupElementAttachments(
        elementId,
        attachmentFile
      );

      expect(result).toEqual({
        [elementId]: [
          {
            file: attachmentFile.attachment[0],
            state: attachmentStatusesEnumLike.SUCCESS,
            message: 'File accepted • Success',
          },
          null,
        ],
      });
    });
  });

  describe('getAttachmentStatusObject', () => {
    describe('regular attachment (no repeatable group)', () => {
      const queuedAttachment = {
        state: 'some state',
        file: {},
        message: null,
      };
      const attachment = {};

      it('returns correct attachment status object for status UNSUPPORTED_FORMAT', () => {
        const status = attachmentStatusesEnumLike.UNSUPPORTED_FORMAT;

        const result = getAttachmentStatusObject(
          undefined,
          queuedAttachment,
          status,
          attachment
        );

        expect(result).toEqual({
          file: attachment,
          message: 'Unsupported format • Failed',
          state: attachmentStatusesEnumLike.FAILURE,
        });
      });

      it('returns correct attachment status object for status IDLE', () => {
        const status = attachmentStatusesEnumLike.IDLE;

        const result = getAttachmentStatusObject(
          undefined,
          queuedAttachment,
          status,
          attachment
        );

        expect(result).toEqual({
          file: attachment,
          message: '0 B • Queued',
          state: attachmentStatusesEnumLike.IDLE,
        });
      });

      it('returns correct attachment status object for status PENDING', () => {
        const status = attachmentStatusesEnumLike.PENDING;

        const result = getAttachmentStatusObject(
          undefined,
          queuedAttachment,
          status,
          attachment
        );

        expect(result).toEqual({
          file: attachment,
          message: '0 B • Pending',
          state: attachmentStatusesEnumLike.PENDING,
        });
      });

      it('returns correct attachment status object for status SUCCESS', () => {
        const status = attachmentStatusesEnumLike.SUCCESS;

        const result = getAttachmentStatusObject(
          undefined,
          queuedAttachment,
          status,
          attachment
        );

        expect(result).toEqual({
          file: attachment,
          message: 'File accepted • Success',
          state: attachmentStatusesEnumLike.SUCCESS,
        });
      });

      it('returns correct attachment status object for status FAILURE', () => {
        const status = attachmentStatusesEnumLike.FAILURE;
        const message = 'Error message';

        const result = getAttachmentStatusObject(
          undefined,
          queuedAttachment,
          status,
          attachment,
          message
        );

        expect(result).toEqual({
          message: 'Upload failed • Failed • Error message',
          state: attachmentStatusesEnumLike.FAILURE,
        });
      });
    });

    describe('attachment child of repeatable group', () => {
      const repeatableGroupInfo = {
        repeatable: true,
        groupNumber: 1,
      };
      const queuedAttachment = [
        {
          state: 'some state',
          file: {},
          message: null,
        },
      ];
      const attachment = {};

      it('returns correct attachment status object for status UNSUPPORTED_FORMAT', () => {
        const status = attachmentStatusesEnumLike.UNSUPPORTED_FORMAT;

        const result = getAttachmentStatusObject(
          repeatableGroupInfo,
          queuedAttachment,
          status,
          attachment
        );

        expect(result).toEqual([
          ...queuedAttachment,
          {
            file: attachment,
            message: 'Unsupported format • Failed',
            state: attachmentStatusesEnumLike.FAILURE,
          },
        ]);
      });

      it('returns correct attachment status object for status IDLE', () => {
        const status = attachmentStatusesEnumLike.IDLE;

        const result = getAttachmentStatusObject(
          repeatableGroupInfo,
          queuedAttachment,
          status,
          attachment
        );

        expect(result).toEqual([
          ...queuedAttachment,
          {
            file: attachment,
            message: '0 B • Queued',
            state: attachmentStatusesEnumLike.IDLE,
          },
        ]);
      });

      it('returns correct attachment status object for status PENDING', () => {
        const status = attachmentStatusesEnumLike.PENDING;

        const result = getAttachmentStatusObject(
          repeatableGroupInfo,
          queuedAttachment,
          status,
          attachment
        );

        expect(result).toEqual([
          ...queuedAttachment,
          {
            file: attachment,
            message: '0 B • Pending',
            state: attachmentStatusesEnumLike.PENDING,
          },
        ]);
      });

      it('returns correct attachment status object for status SUCCESS', () => {
        const status = attachmentStatusesEnumLike.SUCCESS;

        const result = getAttachmentStatusObject(
          repeatableGroupInfo,
          queuedAttachment,
          status,
          attachment
        );

        expect(result).toEqual([
          ...queuedAttachment,
          {
            file: attachment,
            message: 'File accepted • Success',
            state: attachmentStatusesEnumLike.SUCCESS,
          },
        ]);
      });

      it('returns correct attachment status object for status FAILURE', () => {
        const status = attachmentStatusesEnumLike.FAILURE;
        const message = 'Error message';

        const result = getAttachmentStatusObject(
          repeatableGroupInfo,
          queuedAttachment,
          status,
          attachment,
          message
        );

        expect(result).toEqual([
          ...queuedAttachment,
          {
            message: 'Upload failed • Failed • Error message',
            state: attachmentStatusesEnumLike.FAILURE,
          },
        ]);
      });
    });
  });

  describe('fetchAttachments', () => {
    it('non repeatable fetchAttachments', async () => {
      const result = await fetchAttachments(
        nonRepeatableAttachmentFormAnswerSets
      );

      const { attachment, form_element } =
        nonRepeatableAttachmentFormAnswerSets[0];

      expect(result).toEqual([
        {
          attachment: {
            blobUrl: attachment.url,
            createdDate: attachment.created,
            fileSize: attachment.filesize,
            fileTitle: attachment.filename,
            fileType: attachment.filetype,
            filename: attachment.filename,
            id: attachment.id,
          },
          elementId: form_element.id,
        },
      ]);
    });
  });
});
