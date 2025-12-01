// @flow
import $ from 'jquery';

const confirmFileUpload = (fileId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'PATCH',
      url: `/attachments/${fileId}/confirm`,
      processData: false,
      contentType: false,
      cache: false,
    })
      .done(resolve)
      .fail(reject);
  });
};

// S3 upload workflow:
// Save annotation -> response contains S3 url for upload, reference on annotation is saved
// upload each file using the S3 url
// once upload is completed it sets a flag "confirmed: true" on the attachment (sent back in response)

// Upload flow
// 1: POST: We post an annotation, along with attachment information
// 2: RES: We get the created resource back
// 3: POST: For every attachment on the response, we make a post request to S3 to create the resource
// 4: RES: For every attachment created
// 5: POST: For every attachment created, we update the attachment in the annotation resource by sending a post request to /confirm, marking the attachment as created and thus, can be linked to the annotation
// 6: GET: When fetching the attachment, the BE will filter out any attachments that do not have confirm: true as a property

const uploadFile = (
  file: File,
  fileId: number,
  presignedPost: Object
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    Object.entries(presignedPost.fields).forEach(([k, v]) => {
      // $FlowFixMe
      formData.append(k, v);
    });
    // $FlowFixMe
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      enctype: 'multipart/form-data',
      url: presignedPost.url,
      data: formData,
      processData: false,
      contentType: false,
      cache: false,
    })
      .done(() => {
        confirmFileUpload(fileId).then(resolve).catch(reject);
      })
      .fail(reject);
  });
};

export default uploadFile;
