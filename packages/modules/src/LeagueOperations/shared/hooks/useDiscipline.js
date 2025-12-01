// @flow
import { useEffect } from 'react';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import { useGetSeasonMarkerRangeQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/fixturesAPI';
import { DISCIPLINE_AREA_FEATURE_FLAG } from '@kitman/modules/src/LeagueOperations/DisciplineApp/consts';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
  seasonDateRange: Array<string>,
};

const useDiscipline = (): ReturnType => {
  const locationAssign = useLocationAssign();

  const {
    isLoading: isGlobalLoading,
    hasFailed: hasGlobalFailed,
    isSuccess: isGlobalSuccess,
  } = useGlobal();

  const {
    isLoading: isSeasonDateRangeLoading,
    isError: isSeasonDateRangeError,
    isSuccess: isSeasonDateRangeSuccess,
    data: seasonDateRange,
  } = useGetSeasonMarkerRangeQuery();

  useEffect(() => {
    if (!window.featureFlags[DISCIPLINE_AREA_FEATURE_FLAG]) {
      locationAssign('/');
    }
  }, [locationAssign]);

  const isLoading = [isGlobalLoading, isSeasonDateRangeLoading].includes(true);

  const isError = [hasGlobalFailed, isSeasonDateRangeError].includes(true);

  const isSuccess = [isGlobalSuccess, isSeasonDateRangeSuccess].includes(true);

  return {
    isLoading,
    isError,
    isSuccess,
    seasonDateRange,
  };
};
export default useDiscipline;
