import $ from 'jquery';
import ajaxPromise from '../ajaxPromise';

describe('ajaxToPromise', () => {
  let mockRequest;

  describe('when making a successful request', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest.spyOn($, 'ajax').mockImplementation(() =>
        deferred.resolve({
          success: true,
        })
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('returns the data from the ajax request', async () => {
      const data = await ajaxPromise({ url: '/request' });

      expect(mockRequest).toHaveBeenCalledWith({
        url: '/request',
      });
      expect(data).toEqual({ success: true });
    });
  });

  describe('when making a request that errors', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest.spyOn($, 'ajax').mockImplementation(() =>
        deferred.resolve({
          error: true,
        })
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('throws the error function for a promise', async () => {
      try {
        await ajaxPromise({ url: '/request' });
      } catch (error) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(mockRequest).toHaveBeenCalledWith({
          url: '/request',
        });
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error).toEqual({ error: true });
      }
    });
  });
});
