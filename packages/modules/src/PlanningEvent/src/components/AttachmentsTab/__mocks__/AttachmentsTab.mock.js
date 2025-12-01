// @flow
import moment from 'moment';

import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import type { Props } from '../index';

const attachmentDateMock = '2023-08-21T10:43:29Z';
export const mockedAttachments: $ElementType<Props, 'attachments'> = [
  {
    attachment: {
      id: 123,
      url: '',
      name: 'The best name',
      filename: 'The best filename',
      filetype: '',
      filesize: 0,
      audio_file: false,
      confirmed: false,
      download_url: 'https://download.my.attachment',
      created_by: {
        firstname: '',
        fullname: '',
        id: 0,
        lastname: '',
      },
      presigned_post: null,
      attachment_date: attachmentDateMock,
    },
    created_at: '',
    updated_at: '',
    id: 0,
    event_attachment_categories: [
      { id: 0, name: 'Cat1' },
      { id: 1, name: 'Cat2' },
    ],
  },
];

export const transformedDateMock = formatStandard({
  date: moment(attachmentDateMock),
  displayLongDate: true,
});

export default {};
