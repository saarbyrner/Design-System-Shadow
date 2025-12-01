import moment from 'moment';
import * as mediaHelper from '@kitman/common/src/utils/mediaHelper';

describe('Athlete Chat mediaHelper', () => {
  it('can determine accepted file types', () => {
    expect(mediaHelper.isAcceptedFileType('image/jpg')).toBe(true);
    expect(mediaHelper.isAcceptedFileType('video/mp4')).toBe(true);
    expect(mediaHelper.isAcceptedFileType('application/mp4')).toBe(true);
    expect(mediaHelper.isAcceptedFileType('madeupformat/muf')).toBe(false);
  });

  it('can change bytes to friendly file sizes', () => {
    expect(mediaHelper.getFriendlyMediaSize(10)).toBe('10.0 B');
    expect(mediaHelper.getFriendlyMediaSize(900)).toBe('900.0 B');
    expect(mediaHelper.getFriendlyMediaSize(1000)).toBe('1000.0 B');
    expect(mediaHelper.getFriendlyMediaSize(1024)).toBe('1.0 KB');
    expect(mediaHelper.getFriendlyMediaSize(3000)).toBe('2.9 KB');
    expect(mediaHelper.getFriendlyMediaSize(3072)).toBe('3.0 KB');
    expect(mediaHelper.getFriendlyMediaSize(3000000)).toBe('2.9 MB');
    expect(mediaHelper.getFriendlyMediaSize(3145728)).toBe('3.0 MB');
    expect(mediaHelper.getFriendlyMediaSize(31457280)).toBe('30.0 MB');
    expect(mediaHelper.getFriendlyMediaSize(3221225472)).toBe('3.0 GB');
  });

  it('can get a content class group type from a MIME type', () => {
    expect(mediaHelper.getMediaContentClass('image/jpeg')).toBe('image');
    expect(mediaHelper.getMediaContentClass('image/png')).toBe('image');
    expect(mediaHelper.getMediaContentClass('text/plain')).toBe('file');
    expect(mediaHelper.getMediaContentClass('video/mp4')).toBe('video');
    expect(mediaHelper.getMediaContentClass('application/mp4')).toBe('video');
    expect(mediaHelper.getMediaContentClass('audio/mpeg')).toBe('audio');
    expect(mediaHelper.getMediaContentClass('audio/mp4')).toBe('audio');
    expect(mediaHelper.getMediaContentClass('audio/mp3')).toBe('audio');
    expect(mediaHelper.getMediaContentClass('application/msword')).toBe(
      'office'
    );
  });

  it('knows which of our supported types can be displayed on web', () => {
    expect(mediaHelper.isWebDisplayableMedia('image/jpeg')).toBe(true);
    expect(mediaHelper.isWebDisplayableMedia('image/tiff')).toBe(false);
  });

  it('can convert a url expiry property timestamp to a moment', () => {
    const testDate1 = mediaHelper.getExpirationFromUrl(
      'http://www.someurl.com/media?Expires=1610467356'
    );
    expect(
      moment('2021-01-12 16:10', 'YYYY-MM-DD HH:mm').isSame(testDate1, 'day')
    ).toBe(true);

    const testDate2 = mediaHelper.getExpirationFromUrl(
      'http://www.someurl.com/media?Expires=1610295174'
    );
    expect(
      moment('2021-01-10 16:10', 'YYYY-MM-DD HH:mm').isSame(testDate2, 'day')
    ).toBe(true);
  });

  describe('when checking dates moment against expiry', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('can detect when media has expired', () => {
      const fakeDateAfterExpiry = new Date('January 12, 2021 18:00:00');
      jest.setSystemTime(fakeDateAfterExpiry);

      const expiryResult = mediaHelper.checkExpirationFromUrl(
        'http://www.someurl.com/media?Expires=1610295174'
      );
      expect(expiryResult).toBe(true);

      expect(
        mediaHelper.checkExpiration(
          moment('2021-01-10 16:10 +0000', 'YYYY-MM-DD HH:mm Z')
        )
      ).toBe(true);
    });

    it('can detect when media is not expired', () => {
      const fakeDateBeforeExpiry = new Date('January 9, 2021 18:00:00');
      jest.setSystemTime(fakeDateBeforeExpiry);

      const expiryResult = mediaHelper.checkExpirationFromUrl(
        'http://www.someurl.com/media?Expires=1610295174'
      );
      expect(expiryResult).toBe(false);

      expect(
        mediaHelper.checkExpiration(
          moment('2021-01-10 16:10 +0000', 'YYYY-MM-DD HH:mm Z')
        )
      ).toBe(false);
    });
  });
});
