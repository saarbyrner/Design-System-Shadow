// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { GridData } from '@kitman/modules/src/Medical/rosters/types';
import type { CoachReportComment } from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/types';

const setCoachesReportComment = async (
  payload: CoachReportComment = {
    athlete_id: '',
    comment: '',
    comment_date: '',
  }
): Promise<GridData> => {
  let data = { rows: [], columns: [], next_id: null };

  if (payload.athlete_id) {
    data = await axios.post(
      `/athletes/${payload.athlete_id}/availability_comments`,
      {
        ...payload,
      }
    );
  }

  return data;
};

export default setCoachesReportComment;
