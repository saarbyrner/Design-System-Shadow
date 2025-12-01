// @flow
import type { CreateActions } from '../types';
import type { Props } from '../../index';

export const createActionsMock: CreateActions = {
  canDeleteAttachments: true,
  canDownload: true,
  // eslint-disable-next-line no-unused-vars
  onClickDelete: (attachment) => {},
  style: {},
};

const idMock = 123;
const nameMock = 'The best name';
const filenameMock = 'The best filename';
const urlMock = 'https://download.my.attachment';
const attachmentDateMock = '2023-08-21T10:43:29Z';
const categoriesMock = [
  { id: 0, name: 'Cat1' },
  { id: 1, name: 'Cat2' },
];
const fileTypeMock = 'file/pdf';

export const mockedAttachments: $ElementType<Props, 'attachments'> = [
  {
    attachment: {
      id: idMock,
      url: '',
      name: nameMock,
      filename: filenameMock,
      filetype: fileTypeMock,
      filesize: 0,
      audio_file: false,
      confirmed: false,
      download_url: urlMock,
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
    event_attachment_categories: categoriesMock,
  },
];

export default {};
