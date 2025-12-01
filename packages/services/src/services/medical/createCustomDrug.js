// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  CustomDrugData,
  CreateCustomDrugResponse,
} from '@kitman/modules/src/Medical/shared/types/medical/Medications';

const createCustomDrug = async (
  drug: CustomDrugData
): Promise<CreateCustomDrugResponse> => {
  const { data } = await axios.post('/medical/drugs/custom_drugs', drug);
  return data;
};

export default createCustomDrug;
