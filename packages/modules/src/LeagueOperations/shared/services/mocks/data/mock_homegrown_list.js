export const data = [
  {
    id: 1,
    title: 'Homegrown title',
    date_submitted: '2025-05-10T14:10:41Z',
    submitted_by: 'Wayne Rooney',
    certified_by: 'Paul Scholes',
    homegrown_document: {
      id: 1,
      entity: {
        type: 'Registration::Private::Models::HomegrownSubmission',
        id: 1,
      },
      title: 'Homegrown.pdf',
      document_date: null,
      expires_at: null,
      document_note: null,
      organisation_generic_document_categories: [
        {
          id: 1601,
          name: 'Homegrown Document',
        },
      ],
      attachment: {
        id: 1,
        url: 'http://s3:9000/injpro-staging/kls/homegrown-doc.pdf',
        filename: 'homegrown-doc.pdf',
        filetype: 'image/png',
        filesize: 282562,
        audio_file: false,
        confirmed: true,
        download_url: 'http://s3:9000/injpro-staging/kls/homegrown-doc.pdf',
        created_by: null,
        created: '2025-06-30T14:10:41Z',
        attachment_date: '2025-06-30T14:10:41Z',
        name: 'homegrown-doc.pdf',
        archived_at: null,
        archive_reason: null,
        presigned_post: {
          url: 'http://s3:9000/injpro-staging',
          fields: {
            key: 'kls/411409b534852829dc944a6ac75f3bb4.gif',
            success_action_status: '201',
            acl: 'bucket-owner-full-control',
            'Content-Type': 'image/gif',
            policy:
              'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0wMVQxNToxMzo1MVoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJpbmpwcm8tc3RhZ2luZyJ9LHsia2V5Ijoia2xzLzQxMTQwOWI1MzQ4NTI4MjlkYzk0NGE2YWM3NWYzYmI0LmdpZiJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsNTI0Mjg4MDAwXSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LHsiYWNsIjoiYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbCJ9LHsiQ29udGVudC1UeXBlIjoiaW1hZ2UvZ2lmIn0seyJ4LWFtei1jcmVkZW50aWFsIjoiZHVtbXkxMjM0LzIwMjUwNzAxL2V1LXdlc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IngtYW16LWFsZ29yaXRobSI6IkFXUzQtSE1BQy1TSEEyNTYifSx7IngtYW16LWRhdGUiOiIyMDI1MDcwMVQxNTA4NTFaIn1dfQ==',
            'x-amz-credential': 'dummy1234/20250701/eu-west-1/s3/aws4_request',
            'x-amz-algorithm': 'AWS4-HMAC-SHA256',
            'x-amz-date': '20250701T150851Z',
            'x-amz-signature':
              '3e34cf385df62b706ed834410129db31adf9219b3432002c9d9a07e8e3bd1342',
          },
        },
      },
      status: 'active',
      archived_at: null,
      is_archived: false,
    },
    certified_document: {
      id: 2,
      entity: {
        type: 'Registration::Private::Models::HomegrownSubmission',
        id: 1,
      },
      title: 'Certified.pdf',
      document_date: null,
      expires_at: null,
      document_note: null,
      organisation_generic_document_categories: [
        {
          id: 1602,
          name: 'Certified Document',
        },
      ],
      attachment: {
        id: 2,
        url: 'http://s3:9000/injpro-staging/kls/certification-doc.pdf',
        filename: 'certification-doc.pdf',
        filetype: 'image/png',
        filesize: 282562,
        audio_file: false,
        confirmed: true,
        download_url: 'http://s3:9000/injpro-staging/kls/certification-doc.pdf',
        created_by: null,
        created: '2025-06-30T14:10:41Z',
        attachment_date: '2025-06-30T14:10:41Z',
        name: 'certification-doc.pdf',
        archived_at: null,
        archive_reason: null,
        presigned_post: {
          url: 'http://s3:9000/injpro-staging',
          fields: {
            key: 'kls/411409b534852829dc944a6ac75f3bb4.gif',
            success_action_status: '201',
            acl: 'bucket-owner-full-control',
            'Content-Type': 'image/gif',
            policy:
              'eyJleHBpcmF0aW9uIjoiMjAyNS0wNy0wMVQxNToxMzo1MVoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJpbmpwcm8tc3RhZ2luZyJ9LHsia2V5Ijoia2xzLzQxMTQwOWI1MzQ4NTI4MjlkYzk0NGE2YWM3NWYzYmI0LmdpZiJ9LFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsNTI0Mjg4MDAwXSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LHsiYWNsIjoiYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbCJ9LHsiQ29udGVudC1UeXBlIjoiaW1hZ2UvZ2lmIn0seyJ4LWFtei1jcmVkZW50aWFsIjoiZHVtbXkxMjM0LzIwMjUwNzAxL2V1LXdlc3QtMS9zMy9hd3M0X3JlcXVlc3QifSx7IngtYW16LWFsZ29yaXRobSI6IkFXUzQtSE1BQy1TSEEyNTYifSx7IngtYW16LWRhdGUiOiIyMDI1MDcwMVQxNTA4NTFaIn1dfQ==',
            'x-amz-credential': 'dummy1234/20250701/eu-west-1/s3/aws4_request',
            'x-amz-algorithm': 'AWS4-HMAC-SHA256',
            'x-amz-date': '20250701T150851Z',
            'x-amz-signature':
              '3e34cf385df62b706ed834410129db31adf9219b3432002c9d9a07e8e3bd1342',
          },
        },
      },
      status: 'active',
      archived_at: null,
      is_archived: false,
    },
  },
];

export const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 2,
};

export const response = {
  data,
  meta,
};

export const mockSubmission = {
  title: 'Test Submission',
  certified_by: 'Louis van Gaal',
  submitted_by: null,
  date_submitted: '',
  homegrown_document: {
    file: {
      filename: 'homegrown.png',
      fileType: 'image/png',
      fileSize: 282562,
      id: 'pu7c03icy',
    },
    state: 'SUCCESS',
    message: '282.6 kB • Complete',
  },
  certified_document: {
    file: {
      filename: 'certified.png',
      fileType: 'image/png',
      fileSize: 82157,
      id: 'dfutci5tr',
    },
    state: 'SUCCESS',
    message: '82.2 kB • Complete',
  },
};
