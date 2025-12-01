// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AllocationAttribute } from '@kitman/modules/src/ElectronicFiles/shared/types';

export const generateEndpointUrl = (id: number) =>
  `/efax/inbound_faxes/${id}/allocations`;

export type SplitConfig = Array<AllocationAttribute>;

const splitDocument = async ({
  id,
  splitConfig,
}: {
  id: number,
  splitConfig: SplitConfig,
}): Promise<void> => {
  const { data } = await axios.post(generateEndpointUrl(id), {
    allocations_attributes: splitConfig,
  });

  return data;
};

export default splitDocument;
