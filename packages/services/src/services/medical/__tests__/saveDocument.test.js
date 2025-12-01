import $ from 'jquery';
import { documentsResponse } from '../../../mocks/handlers/medical/medicalDocument/mocks/documents.mocks';
import saveDocument from '../saveDocument';

describe('saveDocument', () => {
  let saveDocumentRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveDocumentRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(documentsResponse));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const documents = [
      {
        athlete_id: 1,
        document_category_ids: [1],
        document_date: '2023-03-01T11:43:23Z',
        attachment: {
          attachment_date: '2023-03-01T11:43:23Z',
          audio_file: false,
          confirmed: true,
          created: '2023-03-01T11:43:23Z',
          created_by: null,
          download_url: 'www.kitmanlabs.com',
          filename: 'image (1).png',
          filesize: 89598,
          filetype: 'image/png',
          id: 3951,
          presigned_post: null,
          url: 'www.kitmanlabs.com',
          medical_attachment_category_ids: [123],
        },
        injury_occurrence_ids: [],
        illness_occurrence_ids: [],
        annotation: {
          title: '',
          content: '',
        },
      },
    ];

    const returnedData = await saveDocument(documents);
    expect(returnedData).toEqual(documentsResponse);

    expect(saveDocumentRequest).toHaveBeenCalledTimes(1);
    expect(saveDocumentRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/medical/document_v2s/bulk_create',
      contentType: 'application/json',
      data: JSON.stringify(documents),
    });
  });
});
