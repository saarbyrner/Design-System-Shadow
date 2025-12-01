// @flow
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { onSetUserToBeDisciplined } from '@kitman/modules/src/LeagueOperations/shared/redux/slices/disciplinaryIssueSlice';
import {
  LazyAutocomplete,
  type LazyAutocompleteLoadParams,
} from '@kitman/playbook/components';
import {
  useLazySearchDisciplineDropdownAthleteListQuery,
  useLazySearchDisciplineDropdownUserListQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/disciplineApi';
import { type DisciplineSearchItem } from '@kitman/modules/src/LeagueOperations/shared/types/discipline';

type Props = {
  label: string,
  selectedAthleteId: number,
  userType: 'athlete' | 'staff',
  onChange: (id: ?number) => void,
};

const DisciplineUserDropdown = (props: Props) => {
  const { label, selectedAthleteId, userType = 'athlete', onChange } = props;
  const isAthleteDropdown = userType === 'athlete';
  const dispatch = useDispatch();

  const handleOptionChange = (value) => {
    onChange(value ? value.id : null);
    // Saves user to update user profile on save.
    dispatch(
      onSetUserToBeDisciplined({
        userToBeDisciplined: {
          user_id: value?.id,
          name: value?.label,
          squads: value?.squads || [],
          organisations: value?.organisations || [],
        },
      })
    );
  };

  const [triggerAthlete, athleteResult] =
    useLazySearchDisciplineDropdownAthleteListQuery();
  const [triggerUserQuery, userResult] =
    useLazySearchDisciplineDropdownUserListQuery();
  const trigger = isAthleteDropdown ? triggerAthlete : triggerUserQuery;
  const result = isAthleteDropdown ? athleteResult : userResult;

  const handleLoad = useCallback(
    ({ page, pageSize, searchText }: LazyAutocompleteLoadParams) => {
      trigger({ page, per_page: pageSize, search_expression: searchText });
    },
    [trigger]
  );

  const mapUserOption = ({
    user_id: userId,
    firstname,
    lastname,
    squads = [],
  }: DisciplineSearchItem) => ({
    id: userId,
    label: `${firstname} ${lastname}`,
    squads,
  });

  return (
    <LazyAutocomplete
      load={handleLoad}
      data={result?.data?.data}
      isLoading={result.isFetching}
      totalPages={result?.data?.meta?.total_pages}
      optionMapper={mapUserOption}
      label={label}
      loadingText="Loading..."
      value={selectedAthleteId}
      onChange={handleOptionChange}
    />
  );
};

export default DisciplineUserDropdown;
