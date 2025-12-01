// @flow
import type { CreateJobResponse } from '@kitman/services/src/services/medical/scanning/createJob';
import type { SourceAttachment } from '@kitman/services/src/services/uploads/putFileToPresignedUrl';

export const mockSourceAttachment: SourceAttachment = {
  id: 1,
  url: 'http://s3:9000/injpro-staging/scanning_job_1717695748.pdf',
  filename: 'scanning_job_1717695748.pdf',
  filetype: 'application/pdf',
  filesize: null,
  name: 'scanning_job_1717695748.pdf',
  confirmed: false,
  download_url: 'http://s3:9000/injpro-staging/scanning_job_1717695748.pdf',
};

export const data: CreateJobResponse = {
  id: 1,
  status: 'not_started',
  presigned_put_url:
    'http://s3:9000/injpro-staging/scanning_job_1717695748.pdf',
  presigned_put_headers: {
    'x-amz-acl': 'bucket-owner-full-control',
    'Content-Type': 'application/pdf',
  },
  source_attachment: mockSourceAttachment,
};

export const response = {
  data,
};
