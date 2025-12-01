// @flow
import moment from 'moment';
import colors from '@kitman/common/src/variables/colors';
import type {
  MediaContentClass,
  MediaDetails,
  TwilioMedia,
  EntityAttachmentFileGroup,
} from '../types/Media';

export const pdfFileType = 'application/pdf';

export const docFileTypes = [
  pdfFileType,
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const textFileTypes = [
  'text/plain',
  'text/rtf',
  'application/rtf',
  'text/csv',
];

export const xlsxMime =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const spreadsheetFileTypes = [xlsxMime, 'application/vnd.ms-excel'];

export const presentationFileTypes = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

export const compressedFileTypes = ['application/zip'];

export const imageFileTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/tiff',
];

export const dicomFileTypes = ['application/dicom'];

export const videoFileTypes = [
  'video/mp4',
  'application/mp4',
  'video/quicktime',
  'video/x-ms-wmv',
];

export const audioFileTypes = [
  'audio/mpeg',
  'audio/mp4',
  'audio/mp3',
  'audio/x-ms-wma',
];

export const acceptedFileTypes = [
  ...docFileTypes,
  ...textFileTypes,
  ...spreadsheetFileTypes,
  ...presentationFileTypes,
  ...imageFileTypes,
  ...videoFileTypes,
  ...audioFileTypes,
  ...dicomFileTypes,
  // Don't include compressedFileTypes without product and eng approval
];

const mimeToIcon: { [string]: string } = {
  'application/pdf': 'file-icon-pdf',
  'image/jpeg': 'file-icon-jpeg',
  'image/jpg': 'file-icon-jpg',
  'image/png': 'file-icon-png',
  'image/tif': 'file-icon-file', // No icon supplied
  'image/gif': 'file-icon-file', // No icon supplied
  'application/msword': 'file-icon-doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'file-icon-docx',
  [xlsxMime]: 'file-icon-xlsx',
  'application/vnd.ms-excel': 'file-icon-xls',
  'application/vnd.ms-powerpoint': 'file-icon-ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'file-icon-pptx',
  'text/plain': 'file-icon-txt',
  'text/rtf': 'file-icon-file', // No icon supplied
  'application/rtf': 'file-icon-file', // No icon supplied
  'text/csv': 'file-icon-csv',
  'video/mp4': 'file-icon-mp4',
  'application/mp4': 'file-icon-mp4',
  'video/quicktime': 'file-icon-mov',
  'video/x-ms-wmv': 'file-icon-file', // No icon supplied
  'audio/mpeg': 'file-icon-file', // No icon supplied
  'audio/mp4': 'file-icon-mp4',
  'audio/mp3': 'file-icon-mp3',
  'audio/x-ms-wma': 'file-icon-file', // No icon supplied
  'application/dicom': 'file-icon-file', // No icon supplied for DICOM files
};

export const acceptedFileTypesToIcons = Object.freeze(mimeToIcon);

export type AcceptedMimeType = $Keys<typeof acceptedFileTypesToIcons>;

const newImageIcon = 'icon-image';
const newTextFileIcon = 'icon-text-file';
const newXslxFileIcon = 'icon-xslx-file';
const newPresentationFileIcon = 'icon-presentation-file';
const newVideoFileIcon = 'icon-video-file';
const newAudioFileIcon = 'icon-audio-file';
const newPdfIcon = 'icon-pdf-file';

export type IconWithColor = {
  icon: string,
  color: string,
};

export const filenameToMime = (filename: string, audio: ?boolean): ?string => {
  if (!filename) {
    return null;
  }
  const filenameLower = filename.toLowerCase();
  if (filenameLower.match('.*.pdf$')) {
    return pdfFileType;
  }
  if (filenameLower.match('.*.jpeg$') || filenameLower.match('.*.jpg$')) {
    return 'image/jpg';
  }
  if (filenameLower.match('.*.png$') || filenameLower.match('.*.png$')) {
    return 'image/png';
  }
  if (filenameLower.match('.*.gif$')) {
    return 'image/gif';
  }
  if (filenameLower.match('.*.doc$')) {
    return 'application/msword';
  }
  if (filenameLower.match('.*.docx$')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  if (filenameLower.match('.*.xlsx$')) {
    return xlsxMime;
  }
  if (filenameLower.match('.*.xls$')) {
    return 'application/vnd.ms-excel';
  }
  if (filenameLower.match('.*.ppt$')) {
    return 'application/vnd.ms-powerpoint';
  }
  if (filenameLower.match('.*.pptx$')) {
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }
  if (filenameLower.match('.*.txt$') || filenameLower.match('.*.text$')) {
    return 'text/plain';
  }
  if (filenameLower.match('.*.rtf$')) {
    return 'application/rtf';
  }
  if (filenameLower.match('.*.csv$')) {
    return 'text/csv';
  }
  if (filenameLower.match('.*.mp4$')) {
    return audio ? 'audio/mp4' : 'video/mp4';
  }
  if (filenameLower.match('.*.mpeg$')) {
    return audio ? 'audio/mpeg' : 'video/mpeg';
  }
  if (filenameLower.match('.*.mov$')) {
    return 'video/quicktime';
  }
  if (filenameLower.match('.*.wmv$')) {
    return 'video/x-ms-wmv';
  }
  if (filenameLower.match('.*.mp3$')) {
    return 'audio/mp3';
  }
  if (filenameLower.match('.*.wma$')) {
    return 'audio/x-ms-wma';
  }
  if (
    filenameLower.match('.*.dcm$') ||
    filenameLower.match('.*.dicm$') ||
    filenameLower.match('.*.dicom$')
  ) {
    return 'application/dicom';
  }

  return null;
};

export const fileGroupToIcon = (
  group: EntityAttachmentFileGroup
): IconWithColor => {
  switch (group) {
    case 'image':
      return {
        icon: "'\\e993'",
        color: colors.red_100,
      };
    case 'video':
      return {
        icon: "'\\e991'",
        color: colors.teal_100,
      };
    case 'audio':
      return {
        icon: "'\\e992'",
        color: colors.purple_100,
      };
    case 'pdf':
      return { icon: "'\\e98e'", color: colors.orange_200 };
    case 'document':
      return {
        icon: "'\\e98f'",
        color: colors.blue_100,
      };
    case 'spreadsheet':
      return {
        icon: "'\\e990'",
        color: colors.green_100,
      };
    case 'presentation':
      return {
        icon: "'\\e98d'",
        color: colors.yellow_100,
      };
    case 'zip':
      return { icon: "'\\e997'", color: colors.grey_100 };
    default:
      return { icon: "'\\e996'", color: colors.grey_100 };
  }
};

export const acceptedFileTypesToColorfulIcons = (mime: string): ?string => {
  if (imageFileTypes.includes(mime)) {
    return newImageIcon;
  }
  if (mime === 'text/csv') {
    return newXslxFileIcon; // Think is better suited than text icon
  }
  if (mime === pdfFileType) {
    return newPdfIcon; // We don't look in doc types as have a custom icon for pdf
  }
  if (textFileTypes.includes(mime) || docFileTypes.includes(mime)) {
    return newTextFileIcon;
  }
  if (videoFileTypes.includes(mime)) {
    return newVideoFileIcon;
  }
  if (spreadsheetFileTypes.includes(mime)) {
    return newXslxFileIcon;
  }
  if (presentationFileTypes.includes(mime)) {
    return newPresentationFileIcon;
  }
  if (audioFileTypes.includes(mime)) {
    return newAudioFileIcon;
  }
  if (compressedFileTypes.includes(mime)) {
    return 'file-icon-file'; // No zip icon yet
  }
  return null;
};

/**
 * @return {string} return icon name from content type if available, 'file-icon-file' is default.
 */
export const getContentTypeIcon = (contentType: string): string => {
  if (contentType in acceptedFileTypesToIcons) {
    return acceptedFileTypesToIcons[contentType];
  }
  return 'file-icon-file';
};

export const getNewContentTypeColorfulIcons = (
  contentType: string,
  filename: ?string = null,
  audioFile: ?boolean = false
): string => {
  const result = acceptedFileTypesToColorfulIcons(contentType);
  if (result) {
    return result;
  }
  if (filename && (!contentType || contentType === 'binary/octet-stream')) {
    const mime = filenameToMime(filename, audioFile);
    if (mime) {
      return acceptedFileTypesToColorfulIcons(mime) || 'file-icon-file';
    }
  }

  return 'file-icon-file';
};

/**
 * @return {boolean} return true if is a file type we allow.
 */
export const isAcceptedFileType = (contentType: string): boolean => {
  return acceptedFileTypes.includes(contentType);
};

/**
 * @return {string} return a string like '5 KB' or '10 MB' etc. from a number of bytes.
 */
export const getFriendlyMediaSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0.0 B';
  }
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** e).toFixed(1)} ${
    e === 0 ? 'B' : `${'KMGTP'.charAt(e - 1)}B`
  }`;
};

/**
 * @return {MediaContentClass} return a category of the media type. Like this is an 'image'.
 */
export const getMediaContentClass = (
  contentType: string
): MediaContentClass => {
  switch (contentType) {
    case 'image/jpeg':
    case 'image/jpg':
    case 'image/png':
    case 'image/gif':
      return 'image';

    case pdfFileType:
    case 'text/plain':
    case 'text/rtf':
    case 'application/rtf':
    case 'text/csv':
      return 'file';

    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case xlsxMime:
    case 'application/vnd.ms-excel':
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'office';

    case 'video/mp4':
    case 'application/mp4':
    case 'video/quicktime':
    case 'video/x-ms-wmv':
      return 'video';

    case 'audio/mpeg':
    case 'audio/mp4':
    case 'audio/mp3':
    case 'audio/x-ms-wma':
      return 'audio';

    case 'application/dicom':
      return 'image';

    default:
      return 'file';
  }
};

/**
 * @return {boolean} return true if something a webbrower can likely show inline
 */
export const isWebDisplayableMedia = (contentType: string): boolean => {
  switch (contentType) {
    // Images
    case 'image/jpeg':
    case 'image/jpg':
    case 'image/png':
    case 'image/gif':
      return true;

    // Videos
    case 'video/mp4':
    case 'application/mp4':
    case 'video/quicktime': // So long as mp4 emcoded it can work. Best to just allow.
      return true;

    // Audio
    case 'audio/mpeg':
    case 'audio/mp4':
      return true;

    default:
      return false;
  }
};

/**
 * @return {moment} return a moment js moment equal to the Expires param unix timestamp
 */
export const getExpirationFromUrl = (url: string): moment => {
  const match = RegExp('[?&]expires=([^&]*)').exec(url.toLowerCase());
  if (match) {
    const expiresTimestamp = decodeURIComponent(match[1].replace(/\+/g, ' '));
    return moment.unix(Number(expiresTimestamp));
  }
  return moment().add(7, 'days'); // Assume not expired so return some distant time as a fallback
};

/**
 * @return {boolean} return true if expired ( current time is past the expiry time )
 */
export const checkExpiration = (expiry: moment): boolean => {
  if (expiry && expiry.isValid() && expiry.isBefore()) {
    return true; // Expired
  }
  return false; // Not yet Expired
};

/**
 * @return {boolean} return true if expired ( current time is past the expiry time )
 */
export const checkExpirationFromUrl = (url: string): boolean => {
  return checkExpiration(getExpirationFromUrl(url));
};

export const createMediaDetails = (
  url: string,
  media: TwilioMedia
): MediaDetails => {
  const expiry = getExpirationFromUrl(url);
  return {
    url,
    contentClass: getMediaContentClass(media.contentType),
    isWebDisplayable: isWebDisplayableMedia(media.contentType),
    friendlyMediaSize: getFriendlyMediaSize(media.size),
    expiration: expiry,
    hasExpired: checkExpiration(expiry),
  };
};
