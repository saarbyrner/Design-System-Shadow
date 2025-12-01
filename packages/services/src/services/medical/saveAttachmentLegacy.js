// @flow
import $ from 'jquery';

const saveAttachment = (file: File, fileTitle?: string): Promise<any> => {
  const formData = new FormData();
  formData.append('attachment', file);
  if (fileTitle) formData.append('attachment_name', fileTitle);

  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/attachments',
      contentType: false,
      processData: false,
      data: formData,
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default saveAttachment;
