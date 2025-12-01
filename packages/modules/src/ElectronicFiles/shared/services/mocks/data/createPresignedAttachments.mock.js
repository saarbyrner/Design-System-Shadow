// @flow
import type { PresignedAttachments } from '@kitman/modules/src/ElectronicFiles/shared/types';

export const data: PresignedAttachments = {
  attachments: [
    {
      id: 1494558,
      url: 'url',
      filename: 'File5.txt',
      filetype: 'text/plain',
      filesize: 236235411,
      audio_file: false,
      confirmed: false,
      presigned_post: {
        url: 'url',
        fields: {
          key: 'key',
          success_action_status: '201',
          acl: 'bucket-owner-full-control',
          'Content-Type': 'text/plain',
          policy: 'policy',
          'x-amz-credential': 'x-amz-credential',
          'x-amz-algorithm': 'x-amz-algorithm',
          'x-amz-date': 'x-amz-date',
          'x-amz-signature': 'x-amz-signature',
        },
      },
      download_url: 'download_url',
      created_by: {
        id: 247523,
        firstname: 'John',
        lastname: 'Doe',
        fullname: 'John Doe',
      },
      created: '2024-04-18T10:58:42Z',
      attachment_date: '2024-04-18T10:58:42Z',
      name: 'File5.txt',
      archived_at: null,
      archive_reason: null,
    },
  ],
};

export const response = {
  data,
};
