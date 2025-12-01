// @flow
import moment from 'moment';

export type MediaContentClass = 'image' | 'video' | 'audio' | 'office' | 'file';

// Backend file type groups for entity attachments
export type EntityAttachmentFileGroup =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'zip'
  | 'other';

export type MediaDetails = {
  url: string,
  contentClass: MediaContentClass,
  isWebDisplayable: boolean,
  friendlyMediaSize: string,
  expiration: moment,
  hasExpired: boolean,
};

export type TwilioMedia = {
  sid: string,
  filename?: string,
  contentType: string,
  size: number,
  getContentTemporaryUrl: () => Promise<string>,
};

export type Attachment = {
  filetype: string,
  filesize: number,
  filename: string,
  url: string,
};
