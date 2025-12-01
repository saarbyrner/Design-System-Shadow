// @flow
import { axios } from '@kitman/common/src/utils/services';

export type DrugFormOption = {
  value: string,
  label: string,
};

export const url = '/ui/medical/medications/drug_forms';
const getDrugForms = async (): Promise<Array<DrugFormOption>> => {
  const { data } = await axios.get(url);

  return data.drug_forms;
};

export default getDrugForms;
