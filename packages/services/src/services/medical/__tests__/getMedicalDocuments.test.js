import { axios } from '@kitman/common/src/utils/services';
import { documentsResponse } from '../../../mocks/handlers/medical/medicalDocument/mocks/documents.mocks';
import getMedicalDocuments from '../getMedicalDocuments';

describe('getMedicalDocuments', () => {
  let getMedicalDocumentsRequest;

  beforeEach(() => {
    getMedicalDocumentsRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: documentsResponse });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const filters = {
      athlete_id: 1,
      filename: 'Test',
      document_date: null,
      document_category_ids: [1],
      archived: false,
      issue_occurrence: null,
    };

    const returnedData = await getMedicalDocuments(filters);

    expect(returnedData).toEqual(documentsResponse);
    expect(getMedicalDocumentsRequest).toHaveBeenCalledTimes(1);
    expect(getMedicalDocumentsRequest).toHaveBeenCalledWith(
      '/medical/document_v2s/search',
      {
        filters: {
          archived: false,
          athlete_id: 1,
          document_category_ids: [1],
          document_date: null,
          filename: 'Test',
          issue_occurrence: null,
        },
        page: undefined,
      }
    );
  });
});
