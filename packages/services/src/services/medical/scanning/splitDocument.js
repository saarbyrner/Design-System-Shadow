// @flow
import { axios } from '@kitman/common/src/utils/services';
import { jobsUrl } from '@kitman/services/src/services/medical/scanning/createJob';

// Types
import type { AllocationAttribute } from '@kitman/modules/src/ElectronicFiles/shared/types';

export const generateSpecificJobUrl = (id: number) => `${jobsUrl}/${id}`;

export type SplitConfig = {
  range_assignments: Array<AllocationAttribute>,
};

export type SplitDocumentErrors = {
  errors: { inbound_fax_id?: Array<string>, attributes?: Object },
};

const splitDocument = async ({
  jobId,
  splitConfig,
}: {
  jobId: number,
  splitConfig: SplitConfig,
}): Promise<void> => {
  await axios.put(generateSpecificJobUrl(jobId), splitConfig);
};

export default splitDocument;
