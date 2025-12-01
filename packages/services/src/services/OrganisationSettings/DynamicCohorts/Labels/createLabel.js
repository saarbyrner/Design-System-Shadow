// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { LabelFormState } from '@kitman/modules/src/DynamicCohorts/Labels/ListLabels/redux/slices/labelSlice';
import baseLabelsURL from './consts';

export type ShortLabelResponse = { id: number, name: string, color: string };

export type FullLabelResponse = {
  id: number,
  name: string,
  description: string | null,
  color: string,
  created_by: { id: number, fullname: string },
  created_on: string,
};

export const createLabel = async (
  label: LabelFormState
): Promise<FullLabelResponse> => {
  const { data } = await axios.post(baseLabelsURL, label);

  return data;
};

export default createLabel;
