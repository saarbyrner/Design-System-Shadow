// @flow
import {
  useGetBenchmarkTestsQuery,
  useGetTestingWindowsQuery,
  useGetAgeGroupsQuery,
  useGetMaturationStatusesQuery,
  useGetPositionGroupsQuery,
} from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import type {
  GenerateResultsEventParams,
  GenerateResultsEventReturnValue,
} from '@kitman/common/src/utils/TrackingData/src/types/leagueBenchmarkReporting';

const format = ({
  ids,
  options,
}: {
  ids: Array<number>,
  options: Array<{
    id: number,
    name: string,
  }>,
}) =>
  ids?.map<string>((id) => {
    const option = options.find((o) => o.id === id);
    if (!option) return '';
    return option.name;
  });

const formatSeasons = (
  seasons: Array<number> | typeof undefined
): Array<string> =>
  seasons?.map<string>((season) => `${season}/${season + 1}`) ?? [];

const useGenerateResultsEvent = (
  params: GenerateResultsEventParams
): GenerateResultsEventReturnValue => {
  const {
    data: trainingVariableOptions,
    isLoading: areBenchmarkTestOptionsLoading,
  } = useGetBenchmarkTestsQuery();
  const {
    data: testingWindowOptions,
    isLoading: areTestingWindowOptionsLoading,
  } = useGetTestingWindowsQuery();
  const { data: ageGroupOptions, isLoading: areAgeGroupOptionsLoading } =
    useGetAgeGroupsQuery();
  const {
    data: maturationStatusOptions,
    isLoading: areMaturationStatusOptionsLoading,
  } = useGetMaturationStatusesQuery();
  const { data: positionGroupOptions, isLoading: arePositionGroupsLoading } =
    useGetPositionGroupsQuery();

  if (
    [
      areBenchmarkTestOptionsLoading,
      areTestingWindowOptionsLoading,
      areAgeGroupOptionsLoading,
      areMaturationStatusOptionsLoading,
      arePositionGroupsLoading,
    ].some(Boolean)
  ) {
    return {};
  }

  return {
    ...params,
    TrainingVariables: format({
      options: trainingVariableOptions,
      ids: params.training_variable_ids,
    }),
    Seasons: formatSeasons(params.seasons),
    TestingWindows: format({
      ids: params.testing_window_ids,
      options: testingWindowOptions,
    }),
    AgeGroups: format({ ids: params.age_group_ids, options: ageGroupOptions }),
    MaturationStatuses: format({
      ids: params.maturation_status_ids,
      options: maturationStatusOptions,
    }),
    Positions: format({
      ids: params.position_ids,
      options: positionGroupOptions,
    }),
    ComparedAgainst: {
      NumberOfAthletes: params.compare_to?.athlete_ids.length,
      Seasons: formatSeasons(params.compare_to?.seasons),
      TestingWindows: format({
        ids: params.testing_window_ids,
        options: testingWindowOptions,
      }),
    },
  };
};

export default useGenerateResultsEvent;
