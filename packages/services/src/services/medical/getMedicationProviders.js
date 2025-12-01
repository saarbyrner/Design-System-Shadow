// @flow
import { axios } from '@kitman/common/src/utils/services';

export type Provider = {
  value: string,
  label: string,
};

export type MedicationProviders = {
  medications: Provider[],
};

const getMedicationProviders = async (): Promise<MedicationProviders> => {
  const { data } = await axios.post(`/ui/medical/medications/providers`);

  return data;
};

export default getMedicationProviders;
