import moment from 'moment-timezone';
import * as mediaHelper from '../mediaHelper';

describe('Athlete Chat mediaHelper', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('can determine accepted file types', () => {
    expect(mediaHelper.isAcceptedFileType('image/jpg')).toEqual(true);
    expect(mediaHelper.isAcceptedFileType('video/mp4')).toEqual(true);
    expect(mediaHelper.isAcceptedFileType('application/mp4')).toEqual(true);
    expect(mediaHelper.isAcceptedFileType('application/vnd.ms-excel')).toEqual(
      true
    );
    expect(mediaHelper.isAcceptedFileType('application/rtf')).toEqual(true);

    expect(mediaHelper.isAcceptedFileType('madeupformat/muf')).toEqual(false);
  });

  it('can change bytes to friendly file sizes', () => {
    expect(mediaHelper.getFriendlyMediaSize(10)).toEqual('10.0 B');
    expect(mediaHelper.getFriendlyMediaSize(900)).toEqual('900.0 B');
    expect(mediaHelper.getFriendlyMediaSize(1000)).toEqual('1000.0 B');
    expect(mediaHelper.getFriendlyMediaSize(1024)).toEqual('1.0 KB');
    expect(mediaHelper.getFriendlyMediaSize(3000)).toEqual('2.9 KB');
    expect(mediaHelper.getFriendlyMediaSize(3072)).toEqual('3.0 KB');
    expect(mediaHelper.getFriendlyMediaSize(3000000)).toEqual('2.9 MB');
    expect(mediaHelper.getFriendlyMediaSize(3145728)).toEqual('3.0 MB');
    expect(mediaHelper.getFriendlyMediaSize(31457280)).toEqual('30.0 MB');
    expect(mediaHelper.getFriendlyMediaSize(3221225472)).toEqual('3.0 GB');
  });

  it('can get a content class group type from a MIME type', () => {
    expect(mediaHelper.getMediaContentClass('image/jpeg')).toEqual('image');
    expect(mediaHelper.getMediaContentClass('image/png')).toEqual('image');
    expect(mediaHelper.getMediaContentClass('text/plain')).toEqual('file');
    expect(mediaHelper.getMediaContentClass('video/mp4')).toEqual('video');
    expect(mediaHelper.getMediaContentClass('application/mp4')).toEqual(
      'video'
    );
    expect(mediaHelper.getMediaContentClass('audio/mpeg')).toEqual('audio');
    expect(mediaHelper.getMediaContentClass('audio/mp4')).toEqual('audio');
    expect(mediaHelper.getMediaContentClass('audio/mp3')).toEqual('audio');
    expect(mediaHelper.getMediaContentClass('application/msword')).toEqual(
      'office'
    );
  });

  it('can return an icon name from MIME type', () => {
    expect(mediaHelper.acceptedFileTypesToIcons['image/png']).toEqual(
      'file-icon-png'
    );
    expect(mediaHelper.acceptedFileTypesToIcons['audio/mp4']).toEqual(
      'file-icon-mp4'
    );
    expect(mediaHelper.acceptedFileTypesToIcons['image/tif']).toEqual(
      'file-icon-file'
    );
  });

  it('can return a MIME string from filename extension', () => {
    expect(mediaHelper.filenameToMime('test.PDF')).toEqual('application/pdf');
    expect(mediaHelper.filenameToMime('test.png')).toEqual('image/png');
    expect(mediaHelper.filenameToMime('test.mp4', true)).toEqual('audio/mp4');
    expect(mediaHelper.filenameToMime('test.mp4', false)).toEqual('video/mp4');

    expect(mediaHelper.filenameToMime('test.unknown')).toEqual(null);
  });

  it('can return an icon object from a file group string', () => {
    expect(mediaHelper.fileGroupToIcon('image')).toEqual({
      color: '#c31d2b',
      icon: "'\\e993'",
    });
    expect(mediaHelper.fileGroupToIcon('presentation')).toEqual({
      color: '#ffab00',
      icon: "'\\e98d'",
    });
    expect(mediaHelper.fileGroupToIcon('audio')).toEqual({
      color: '#9b58b5',
      icon: "'\\e992'",
    });
  });

  it('can return an icon name from a file group string', () => {
    expect(mediaHelper.acceptedFileTypesToColorfulIcons('image/png')).toEqual(
      'icon-image'
    );
    expect(mediaHelper.acceptedFileTypesToColorfulIcons('audio/mp4')).toEqual(
      'icon-audio-file'
    );
  });

  it('can combine the other utility functions to resolve MIMES to icon', () => {
    expect(mediaHelper.getNewContentTypeColorfulIcons('image/png')).toEqual(
      'icon-image'
    );
    expect(
      mediaHelper.getNewContentTypeColorfulIcons(
        'binary/octet-stream',
        'test.mp3',
        true
      )
    ).toEqual('icon-audio-file');
  });

  it('knows which of our supported types can be displayed on web', () => {
    expect(mediaHelper.isWebDisplayableMedia('image/jpeg')).toEqual(true);
    expect(mediaHelper.isWebDisplayableMedia('image/tiff')).toEqual(false);
  });

  it('can convert a url expiry property timestamp to a moment', () => {
    const testDate1 = mediaHelper.getExpirationFromUrl(
      'http://www.someurl.com/media?Expires=1610467356'
    );
    expect(
      moment('2021-01-12 16:10', 'YYYY-MM-DD HH:mm').isSame(testDate1, 'day')
    ).toEqual(true);

    const testDate2 = mediaHelper.getExpirationFromUrl(
      'http://www.someurl.com/media?Expires=1610295174'
    );
    expect(
      moment('2021-01-10 16:10', 'YYYY-MM-DD HH:mm').isSame(testDate2, 'day')
    ).toEqual(true);
  });

  describe('when checking dates moment against expiry', () => {
    it('can detect when media has expired', () => {
      const fakeDateAfterExpiry = new Date('2021-01-12T18:00:00Z'); // UTC FORMAT
      jest.useFakeTimers();
      jest.setSystemTime(fakeDateAfterExpiry);

      const expiryResult = mediaHelper.checkExpirationFromUrl(
        'http://www.someurl.com/media?Expires=1610295174'
      );
      expect(expiryResult).toEqual(true);

      expect(
        mediaHelper.checkExpiration(
          moment('2021-01-10 16:10 +0000', 'YYYY-MM-DD HH:mm Z')
        )
      ).toEqual(true);

      jest.useRealTimers();
    });

    it('can detect when media is not expired', () => {
      const fakeDateBeforeExpiry = new Date('2021-01-09T18:00:00Z'); // UTC FORMAT
      jest.useFakeTimers();
      jest.setSystemTime(fakeDateBeforeExpiry);

      const expiryResult = mediaHelper.checkExpirationFromUrl(
        'http://www.someurl.com/media?Expires=1610295174'
      );
      expect(expiryResult).toEqual(false);

      expect(
        mediaHelper.checkExpiration(
          moment('2021-01-10 16:10 +0000', 'YYYY-MM-DD HH:mm Z')
        )
      ).toEqual(false);

      jest.useRealTimers();
    });
  });
});
