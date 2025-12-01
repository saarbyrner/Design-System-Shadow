import $ from 'jquery';
import {
  openNoteDetailModal,
  closeNoteDetailModal,
  fetchNoteDetailSuccess,
  fetchNoteDetailError,
  fetchNoteDetail,
} from '../noteDetailModal';

jest.mock('jquery', () => ({
  ajax: jest.fn(),
}));

describe('Note Detail Modal Actions', () => {
  it('has the correct action OPEN_NOTE_DETAIL_MODAL', () => {
    const expectedAction = {
      type: 'OPEN_NOTE_DETAIL_MODAL',
    };

    expect(openNoteDetailModal()).toEqual(expectedAction);
  });

  it('has the correct action CLOSE_NOTE_DETAIL_MODAL', () => {
    const expectedAction = {
      type: 'CLOSE_NOTE_DETAIL_MODAL',
    };

    expect(closeNoteDetailModal()).toEqual(expectedAction);
  });

  it('has the correct action FETCH_NOTE_DETAIL_SUCCESS', () => {
    const expectedAction = {
      type: 'FETCH_NOTE_DETAIL_SUCCESS',
      payload: { annotation: { id: 1, title: 'Note title' } },
    };

    expect(fetchNoteDetailSuccess({ id: 1, title: 'Note title' })).toEqual(
      expectedAction
    );
  });

  it('has the correct action FETCH_NOTE_DETAIL_ERROR', () => {
    const expectedAction = {
      type: 'FETCH_NOTE_DETAIL_ERROR',
    };

    expect(fetchNoteDetailError()).toEqual(expectedAction);
  });

  describe('when fetching a note detail', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('sends the correct request', () => {
      const mockResponse = {
        annotation: { id: 987, title: 'Note title' },
      };

      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = fetchNoteDetail(987);
      const dispatcher = jest.fn();
      thunk(dispatcher);

      expect($.ajax).toHaveBeenCalledWith({
        method: 'GET',
        url: '/annotations/987',
        contentType: 'application/json',
      });

      mockDone.mock.calls[0][0](mockResponse);

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'FETCH_NOTE_DETAIL_SUCCESS',
        payload: { annotation: { id: 987, title: 'Note title' } },
      });
    });
  });

  describe('When fetching a note detail fails', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches the correct action', () => {
      const mockDone = jest.fn();
      const mockFail = jest.fn();

      $.ajax.mockReturnValue({
        done: mockDone.mockReturnValue({ fail: mockFail }),
        fail: mockFail,
      });

      const thunk = fetchNoteDetail();
      const dispatcher = jest.fn();
      thunk(dispatcher);

      mockFail.mock.calls[0][0]();

      expect(dispatcher).toHaveBeenCalledWith({
        type: 'FETCH_NOTE_DETAIL_ERROR',
      });
    });
  });
});
