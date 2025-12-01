import $ from 'jquery';
import getLastNote from '../getLastNote';

describe('getLastNote', () => {
  let getLastNoteRequest;

  describe('when last note exits', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      const data = {
        id: 123,
        content: '[Copied from note: 04/03/2021] fake note',
      };

      getLastNoteRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve(data));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await getLastNote(1, 20);

      expect(returnedData).toEqual({
        id: 123,
        content: '[Copied from note: 04/03/2021] fake note',
      });

      expect(getLastNoteRequest).toHaveBeenCalledTimes(1);
      expect(getLastNoteRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/medical/athletes/1/notes/last_authored',
        data: {
          organisation_annotation_type_id: 20,
        },
      });
    });
  });
});
