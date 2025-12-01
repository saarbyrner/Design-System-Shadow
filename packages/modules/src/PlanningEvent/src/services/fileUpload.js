// @flow
import $ from 'jquery';

export const startFileUpload = (
  file: File,
  fileId: number,
  presignedPost: Object
): Promise<Object> => {
  const formData = new FormData();
  Object.entries(presignedPost.fields).forEach(([key, value]) => {
    // $FlowFixMe
    formData.append(key, value);
  });
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      enctype: 'multipart/form-data',
      url: presignedPost.url,
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};

export const finishFileUpload = (fileId: number): Promise<Object> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'PATCH',
      url: `/attachments/${fileId}/confirm`,
      processData: false,
      contentType: false,
      cache: false,
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
};
