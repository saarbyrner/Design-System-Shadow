import $ from 'jquery';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import getTerminologies from '../getTerminologies';

describe('getTerminologies', () => {
  i18nextTranslateStub();
  let request;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when there is no custom terminology saved', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      request = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve([]));
    });

    it('calls the correct endpoint and returns the list of terminologies without custom values', async () => {
      const returnedData = await getTerminologies();
      expect(returnedData).toEqual([
        {
          key: 'development_goal',
          originalName: 'Development goal',
          customName: null,
        },
      ]);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/terminologies',
      });
    });
  });

  describe('when there is a saved custom terminology', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      request = jest
        .spyOn($, 'ajax')
        .mockImplementation(() =>
          deferred.resolve([{ key: 'development_goal', value: 'IPA' }])
        );
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getTerminologies();

      expect(returnedData).toEqual([
        {
          key: 'development_goal',
          originalName: 'Development goal',
          customName: 'IPA',
        },
      ]);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/ui/terminologies',
      });
    });
  });
});
