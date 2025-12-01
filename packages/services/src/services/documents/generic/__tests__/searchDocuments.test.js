import { data } from '@kitman/services/src/services/documents/generic/redux/services/mocks/data/searchDocuments';
import { axios } from '@kitman/common/src/utils/services';
import searchDocuments, {
  GENERIC_DOCUMENTS_SEARCH_ENDPOINT,
} from '@kitman/services/src/services/documents/generic/redux/services/apis/searchDocuments';

describe('searchDocuments', () => {
  let searchDocumentsRequest;
  const requestBody = {
    product_area: 'staff_profiles',
    entities: [],
    organisation_document_categories: [],
    status: '',
    document_date: '',
    filename: '',
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the new endpoint', async () => {
    searchDocumentsRequest = jest.spyOn(axios, 'post');

    const returnedData = await searchDocuments(requestBody);

    expect(returnedData).toEqual(data);
    expect(searchDocumentsRequest).toHaveBeenCalledTimes(1);
    expect(searchDocumentsRequest).toHaveBeenCalledWith(
      GENERIC_DOCUMENTS_SEARCH_ENDPOINT,
      requestBody
    );
  });

  it('calls the new endpoint - error response', async () => {
    searchDocumentsRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        throw new Error();
      });

    await expect(async () => {
      await searchDocuments(requestBody);
    }).rejects.toThrow();
  });
});
