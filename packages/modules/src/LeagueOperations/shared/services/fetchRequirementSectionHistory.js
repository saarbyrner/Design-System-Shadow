/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { RequirementHistory } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type RequestParams = {
  registration_id: number,
  user_id: number,
  section_id: number,
};

const fetchRequirementSectionHistory = async ({
  registration_id,
  user_id,
  section_id,
}: RequestParams): Promise<RequirementHistory> => {
  try {
    const { data } = await axios.post(
      `/registration/registrations/${registration_id}/sections/${section_id}/history`,
      {
        user_id,
      }
    );

    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchRequirementSectionHistory;
