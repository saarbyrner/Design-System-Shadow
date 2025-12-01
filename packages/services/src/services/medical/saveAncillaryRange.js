/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';

type SaveAncillaryRangeParams = {
  athleteId: number,
  movementType: string,
  start_date: Date | null,
  end_date: Date | null,
};

const saveAncillaryRange = async ({
  athleteId,
  movementType,
  start_date,
  end_date,
}: SaveAncillaryRangeParams): Promise<boolean> => {
  const requestData = {
    start_date,
    end_date,
    type: movementType,
  };

  const { data } = await axios.post(
    `/medical/athletes/${athleteId}/ancillary_dates`,
    requestData
  );
  return data;
};

export default saveAncillaryRange;
