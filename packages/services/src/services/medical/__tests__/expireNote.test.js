import $ from 'jquery';
import expireNote from '../expireNote';

describe('expireNote', () => {
  let expireNoteRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    expireNoteRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await expireNote(1);

    expect(expireNoteRequest).toHaveBeenCalledTimes(1);
    expect(expireNoteRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: '/medical/notes/1/expire',
        contentType: 'application/json',
      })
    );
  });
});
