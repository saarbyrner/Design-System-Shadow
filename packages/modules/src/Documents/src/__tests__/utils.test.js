import moment from 'moment-timezone';
import { data } from '@kitman/services/src/mocks/handlers/documents/getDocuments';
import {
  getFeedbackMessage,
  formatDate,
  getFormattedDocument,
  getFormattedDocuments,
} from '../utils';

describe('getFeedbackMessage', () => {
  it('should return the correct feedback message when the feedback type is PROGRESS_UPLOAD and the file name is passed', () => {
    expect(getFeedbackMessage('PROGRESS_UPLOAD', 'imageMocked.jpg')).toBe(
      'Uploading imageMocked.jpg'
    );
  });

  it('should return the correct feedback message when the feedback type is PROGRESS_UPLOAD and the file name is not passed', () => {
    expect(getFeedbackMessage('PROGRESS_UPLOAD')).toBe('Uploading document');
  });

  it('should return the correct feedback message when the feedback type is SUCCESS_UPLOAD and the file name is passed', () => {
    expect(getFeedbackMessage('SUCCESS_UPLOAD', 'imageMocked.jpg')).toBe(
      'imageMocked.jpg uploaded successfully'
    );
  });

  it('should return the correct feedback message when the feedback type is SUCCESS_UPLOAD and the file name is not passed', () => {
    expect(getFeedbackMessage('SUCCESS_UPLOAD')).toBe(
      'document uploaded successfully'
    );
  });

  it('should return the correct feedback when message type is ERROR_UPLOAD', () => {
    expect(getFeedbackMessage('ERROR_UPLOAD', 'imageMocked.jpg')).toBe(
      'Upload unsuccessful'
    );
  });

  it('should return the correct feedback message when the feedback type is PROGRESS_DELETE and the file name is passed', () => {
    expect(getFeedbackMessage('PROGRESS_DELETE', 'imageMocked.jpg')).toBe(
      'Deleting imageMocked.jpg'
    );
  });

  it('should return the correct feedback message when the feedback type is PROGRESS_DELETE and the file name is not passed', () => {
    expect(getFeedbackMessage('PROGRESS_DELETE')).toBe('Deleting document');
  });

  it('should return the correct feedback message when the feedback type is SUCCESS_DELETE and the file name is passed', () => {
    expect(getFeedbackMessage('SUCCESS_DELETE', 'imageMocked.jpg')).toBe(
      'imageMocked.jpg deleted successfully'
    );
  });

  it('should return the correct feedback message when the feedback type is SUCCESS_DELETE and the file name is not passed', () => {
    expect(getFeedbackMessage('SUCCESS_DELETE')).toBe(
      'document deleted successfully'
    );
  });

  it('should return the correct feedback when message type is ERROR_DELETE', () => {
    expect(getFeedbackMessage('ERROR_DELETE', 'imageMocked.jpg')).toBe(
      'Delete unsuccessful'
    );
  });
});

describe('formatDate', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('should return the correct date formatted', () => {
    expect(formatDate(moment('2022-07-25T10:01:02Z'))).toBe(
      '25 Jul 2022 at 10:01 am'
    );
  });

  describe('when the standard-date-formatting flag is on', () => {
    beforeEach(() => {
      window.featureFlags['standard-date-formatting'] = true;
    });

    afterEach(() => {
      window.featureFlags['standard-date-formatting'] = false;
    });

    it('should return the correct date formatted', () => {
      expect(formatDate(moment('2022-07-25T10:01:02Z'))).toBe(
        'Jul 25, 2022 10:01 AM'
      );
    });
  });
});

describe('getFormattedDocument', () => {
  it('should return the correct document formatted', () => {
    expect(getFormattedDocument(data.documents[0])).toEqual({
      id: 124565,
      name: 'mock-video.mp4',
      modifiedDate: '2020-07-27T11:27:03Z',
      owner: 'John Doe',
      size: 1207850,
      url: 'http://www.mock-video.com',
      downloadUrl: 'http://www.mock-video-download.com',
    });
  });
});

describe('getFormattedDocuments', () => {
  it('should return the correct documents formatted', () => {
    expect(getFormattedDocuments(data.documents)(getFormattedDocument)).toEqual(
      [
        {
          id: 124565,
          name: 'mock-video.mp4',
          modifiedDate: '2020-07-27T11:27:03Z',
          owner: 'John Doe',
          size: 1207850,
          url: 'http://www.mock-video.com',
          downloadUrl: 'http://www.mock-video-download.com',
        },
        {
          id: 142354,
          name: 'mock-audio.mp3',
          modifiedDate: '2021-05-27T12:25:00Z',
          owner: 'John Doe',
          size: 934147,
          url: 'http://www.mock-audio.com',
          downloadUrl: 'http://www.mock-audio-download.com',
        },
        {
          id: 196670,
          name: 'mock-image.jpg',
          modifiedDate: '2021-11-27T09:15:00Z',
          owner: 'John Doe',
          size: 24521,
          url: 'http://www.mock-image.com',
          downloadUrl: 'http://www.mock-image-download.com',
        },
      ]
    );
  });
});
