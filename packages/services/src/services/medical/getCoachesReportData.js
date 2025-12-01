// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { GridData } from '@kitman/modules/src/Medical/rosters/types';
import type { CoachReportFilters } from '@kitman/modules/src/Medical/rosters/src/components/CoachesReportTab/types';

const getCoachesReportData = async (
  payload: CoachReportFilters = {
    next_id: 0,
    filters: {
      athlete_name: 'string',
      date: 'string',
      report_date: 'string',
      positions: [],
      squads: [],
      availabilities: [],
      issues: [],
    },
  }
): Promise<GridData> => {
  const { data } = await axios.post('/medical/coaches/fetch', {
    ...payload,
  });

  return data;
};

export default getCoachesReportData;
