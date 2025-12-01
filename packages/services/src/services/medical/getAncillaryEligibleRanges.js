// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Period } from '@kitman/modules/src/Medical/shared/types/medical/Constraints';

export type EligibleRanges = {
  eligible_ranges: Array<Period>,
};

const getAncillaryEligibleRanges = async (
  athleteId: number
): Promise<EligibleRanges> => {
  const { data } = await axios.get(
    `/medical/athletes/${athleteId}/ancillary_dates/eligible_ranges`
  );

  return data;
};

export default getAncillaryEligibleRanges;
