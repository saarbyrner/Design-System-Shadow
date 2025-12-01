// @flow
import { axios } from '@kitman/common/src/utils/services';

// Types
import type { SourceAttachment } from '@kitman/services/src/services/uploads/putFileToPresignedUrl';

export const jobsUrl = '/medical/scanning/jobs';
export const JobStatuses = {
  notStarted: 'not_started',
  started: 'started',
  completed: 'completed',
  error: 'error',
};

export type JobStatus = $Values<typeof JobStatuses>;

export type CreateJobResponse = {
  id: number,
  status: JobStatus,
  presigned_put_url: string,
  presigned_put_headers: { [string]: string },
  source_attachment: SourceAttachment,
};

const createJob = async (): Promise<CreateJobResponse> => {
  const { data } = await axios.post(jobsUrl);
  return data;
};

export default createJob;
