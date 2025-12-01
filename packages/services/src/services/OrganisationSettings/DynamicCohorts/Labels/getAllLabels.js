// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { FullLabelResponse } from './createLabel';
import baseLabelsURL from './consts';

export type LabelsResponse = Array<FullLabelResponse>;
export const getAllLabels = async ({
  isSystemManaged,
}: { isSystemManaged?: boolean } = {}): Promise<LabelsResponse> => {
  const params = isSystemManaged
    ? {
        include_system_managed: isSystemManaged,
      }
    : {};
  // Fetch all labels from the API
  const { data } = await axios.get(
    baseLabelsURL,
    // add params to the request if needed
    {
      params,
    }
  );

  return data;
};

export default getAllLabels;
