import $ from 'jquery';
import saveProcedureAttachment from '../saveProcedureAttachment';

const mockedProcedureAttachmentResponse = [
  {
    id: 251261,
    url: 'http://s3:9000/injpro-staging/test',
    filetype: 'image/png',
    filename: 'test.png',
    filesize: 103536,
    audio_file: false,
    confirmed: true,
    presigned_post: {
      url: 'http://s3:9000/injpro-staging',
      fields: {
        key: 'kitman/8f212f413722cc437f4826241aaac9ee.png',
        success_action_status: '201',
      },
    },
    download_url: 'http://s3:9000/injpro-staging/test',
    created_by: {
      id: 232323,
      firstname: 'John',
      lastname: 'Carew',
      fullname: 'Carew, John',
    },
    created: '2023-02-22T18:41:45Z',
    attachment_date: '2023-02-22T18:41:45Z',
  },
];

describe('saveProcedure', () => {
  let saveProcedureAttachmentRequest;

  const formState = {
    athleteId: 1,
    procedureId: 34,
    attachments: [
      {
        original_filename: 'test.png',
        filetype: 'image/png',
        filesize: '103536',
      },
    ],
  };

  beforeEach(() => {
    const deferred = $.Deferred();
    saveProcedureAttachmentRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        deferred.resolve(mockedProcedureAttachmentResponse)
      );
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveProcedureAttachment(
      1,
      34,
      formState.attachments
    );

    expect(returnedData).toEqual(mockedProcedureAttachmentResponse);
    expect(saveProcedureAttachmentRequest).toHaveBeenCalledTimes(1);

    expect(saveProcedureAttachmentRequest).toHaveBeenCalledWith({
      method: 'POST',
      contentType: 'application/json',
      url: `/medical/procedures/${formState.procedureId}/attach`,
      data: JSON.stringify({
        attachments_attributes: formState.attachments,
      }),
    });
  });
});
