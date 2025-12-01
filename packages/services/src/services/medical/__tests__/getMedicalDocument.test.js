import { axios } from '@kitman/common/src/utils/services';
import { documentResponse } from '../../../mocks/handlers/medical/medicalDocument/mocks/documents.mocks';
import getMedicalDocument from '../getMedicalDocument';

describe('getMedicalDocument', () => {
  let getMedicalDocumentRequest;

  beforeEach(() => {
    getMedicalDocumentRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: documentResponse });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const documentId = 1;
    const returnedData = await getMedicalDocument(documentId);
    expect(returnedData).toEqual(documentResponse);

    expect(getMedicalDocumentRequest).toHaveBeenCalledTimes(1);
    expect(getMedicalDocumentRequest).toHaveBeenCalledWith(
      '/medical/document_v2s/1'
    );
  });
});
