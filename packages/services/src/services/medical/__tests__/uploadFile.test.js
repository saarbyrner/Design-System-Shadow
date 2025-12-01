import $ from 'jquery';
import uploadFile from '../uploadFile';

describe('uploadFile', () => {
  let api;

  beforeEach(() => {
    const deferred = $.Deferred();

    api = jest.spyOn($, 'ajax').mockImplementation(() => deferred.resolve({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoints', async () => {
    const file = { data: 'file_data' };
    await uploadFile(file, 1, {
      url: '/upload_url',
      fields: {},
    });

    const formData = new FormData();
    formData.append('file', file);
    expect(api).toHaveBeenCalledWith({
      type: 'POST',
      url: '/upload_url',
      cache: false,
      contentType: false,
      data: formData,
      enctype: 'multipart/form-data',
      processData: false,
    });
    expect(api).toHaveBeenCalledWith({
      type: 'PATCH',
      url: '/attachments/1/confirm',
      cache: false,
      contentType: false,
      processData: false,
    });
  });
});
