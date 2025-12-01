import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getDocumentNoteCategories';
import getDocumentNoteCategories from '../getDocumentNoteCategories';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('getDocumentNoteCategories', () => {
  let getDocumentNoteCategoriesRequest;

  beforeEach(() => {
    getDocumentNoteCategoriesRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDocumentNoteCategories();
    expect(returnedData).toEqual(serverResponse);
    expect(getDocumentNoteCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(getDocumentNoteCategoriesRequest).toHaveBeenCalledWith(
      '/ui/document_note_categories'
    );
  });
});
