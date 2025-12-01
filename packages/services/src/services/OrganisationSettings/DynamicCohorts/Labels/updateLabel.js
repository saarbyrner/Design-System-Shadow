// @flow
import { axios } from '@kitman/common/src/utils/services';
import baseLabelsURL from './consts';
import type { FullLabelResponse } from './createLabel';

type LabelUpdate = {
  id: number,
  name: ?string,
  description: ?string,
  color: ?string,
};

export const updateLabel = async (
  label: LabelUpdate
): Promise<FullLabelResponse> => {
  const { data } = await axios.patch(`${baseLabelsURL}/${label.id}`, label);

  return data;
};

export default updateLabel;
