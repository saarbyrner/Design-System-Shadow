// @flow
import { axios } from '@kitman/common/src/utils/services';

export type UnitOption = {
  value: string,
  label: string,
  group: string,
};

export const url = '/ui/medical/medications/med_strength_units';
const getMedStrengthUnits = async (): Promise<Array<UnitOption>> => {
  const { data } = await axios.get(url);

  return data.med_strength_units;
};

export default getMedStrengthUnits;
