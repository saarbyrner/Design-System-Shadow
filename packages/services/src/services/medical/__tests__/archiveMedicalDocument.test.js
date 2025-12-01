import { axios } from '@kitman/common/src/utils/services';
import { documentResponse } from '../../../mocks/handlers/medical/medicalDocument/mocks/documents.mocks';
import archiveMedicalDocument from '../archiveMedicalDocument';

describe('archiveDocument', () => {
  let archiveDocumentRequest;

  beforeEach(() => {
    archiveDocumentRequest = jest
      .spyOn(axios, 'patch')
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
    const archiveReasonId = 2;
    const returnedData = await archiveMedicalDocument(
      documentResponse.document.id,
      archiveReasonId
    );

    expect(returnedData).toEqual(documentResponse);

    expect(archiveDocumentRequest).toHaveBeenCalledTimes(1);
    expect(archiveDocumentRequest).toHaveBeenCalledWith(
      `/medical/document_v2s/${documentResponse.document.id}/archive`,
      { archive_reason_id: 2 }
    );
  });
});
