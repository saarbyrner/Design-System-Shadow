import $ from 'jquery';
import saveAttachment from '../saveAttachmentLegacy';

describe('saveAttachment', () => {
  let saveAttachmentRequest;

  const mockedAttachment = new File(['fakeImage'], 'fakeImage.jpg', {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });

  beforeEach(() => {
    const deferred = $.Deferred();
    saveAttachmentRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedAttachment));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Saving a note', () => {
    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await saveAttachment(mockedAttachment);

      expect(returnedData).toEqual(mockedAttachment);

      const formData = new FormData();
      formData.append('attachment', mockedAttachment);
      expect(saveAttachmentRequest).toHaveBeenCalledTimes(1);
      expect(saveAttachmentRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/attachments',
        contentType: false,
        data: formData,
        processData: false,
      });
    });

    it('calls the correct endpoint and also passes in the file title', async () => {
      await saveAttachment(mockedAttachment, 'Fake Image Title');

      const formData = new FormData();
      formData.append('attachment', mockedAttachment);
      formData.append('attachment_name', 'Fake Image Title');
      expect(saveAttachmentRequest).toHaveBeenCalledTimes(1);
      expect(saveAttachmentRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/attachments',
        contentType: false,
        data: formData,
        processData: false,
      });
    });
  });
});
