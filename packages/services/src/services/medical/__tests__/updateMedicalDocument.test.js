import { axios } from '@kitman/common/src/utils/services';
import { updatedDocumentFile } from '../../../mocks/handlers/medical/medicalDocument/mocks/documents.mocks';
import updateMedicalDocument from '../updateMedicalDocument';

describe('updateMedicalDocument', () => {
  let updateMedicalRequest;

  beforeEach(() => {
    updateMedicalRequest = jest.spyOn(axios, 'patch').mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({ data: updatedDocumentFile });
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const documentId = 1;
    const updatedDocument = {
      attachment: { name: 'New Attachment Name' },
    };
    const returnedData = await updateMedicalDocument(
      documentId,
      updatedDocument
    );

    expect(returnedData).toEqual(updatedDocumentFile);
    expect(updateMedicalRequest).toHaveBeenCalledTimes(1);
    expect(updateMedicalRequest).toHaveBeenCalledWith(
      `/medical/document_v2s/${documentId}`,
      {
        document: updatedDocument,
      }
    );
  });
});
