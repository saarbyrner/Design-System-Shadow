// @flow
import { type ComponentType } from 'react';
import { type I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';

import {
  Stack,
  DateRangePicker,
  FormControl,
  Autocomplete,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from '@kitman/playbook/components';

import { useGetStaffUsersQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { useGetAthleteReviewTypesQuery } from '@kitman/modules/src/AthleteReviews/src/shared/redux/developmentGoals';
import moment from 'moment';
import { AppStatus } from '@kitman/components';
import type { SetState } from '@kitman/common/src/types/react';
import { getStatusLabelsEnumLike } from '../shared/enum-likes';
import type { AthleteReviewsFilters } from '../shared/types';

type Props = {
  filters: AthleteReviewsFilters,
  setFilters: SetState<AthleteReviewsFilters>,
};

const Filters = ({
  filters: {
    user_ids: userIds,
    athlete_review_type_id: athleteReviewTypeId,
    review_status: reviewStatus,
  },
  setFilters,
  t,
}: I18nProps<Props>) => {
  const { data: staffUsers = [], error: staffUsersError } =
    useGetStaffUsersQuery();

  const {
    data: athleteReviewTypes = [],
    isError: athleteReviewTypesError,
    isLoading: areAthleteReviewTypesLoading,
  } = useGetAthleteReviewTypesQuery();

  const statusLabels = getStatusLabelsEnumLike(t);
  const statusOptions = Object.entries(statusLabels).map(([id, value]) => ({
    id,
    value,
  }));

  const isError = staffUsersError || athleteReviewTypesError;
  if (isError) {
    return <AppStatus status="error" />;
  }

  return (
    <Stack direction="row" spacing={1}>
      <FormControl sx={{ width: 250 }}>
        <InputLabel id="select-staff-label">{t('Staff')}</InputLabel>
        <Select
          labelId="select-staff-label"
          label={t('Staff')}
          value={userIds}
          onChange={({ target: { value } }) => {
            setFilters((prev) => ({
              ...prev,
              user_ids: value,
            }));
          }}
          multiple
        >
          {staffUsers.map(({ id, fullname }) => {
            return (
              <MenuItem key={id} value={id}>
                {fullname}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <DateRangePicker
        formatDensity="dense"
        sx={{
          '& .MuiFormControl-root': {
            marginLeft: 0,
          },
          '& .MuiTypography-root ': {
            marginLeft: 0,
          },
        }}
        onChange={([startDate, endDate]) =>
          setFilters((prev) => ({
            ...prev,
            review_start_date: moment(startDate).toString(),
            review_end_date: moment(endDate).toString(),
          }))
        }
      />

      <FormControl sx={{ width: 250 }}>
        <Autocomplete
          value={
            athleteReviewTypes.find(({ id }) => id === athleteReviewTypeId) ||
            null
          }
          onChange={(e, value) =>
            setFilters((prev) => ({
              ...prev,
              athlete_review_type_id: value?.id,
            }))
          }
          options={athleteReviewTypes}
          getOptionLabel={({ review_name: reviewName }) => reviewName}
          renderOption={(props, { id, review_name: reviewName }) => (
            <li {...props} key={id}>
              {reviewName}
            </li>
          )}
          style={{ maxWidth: 350 }}
          renderInput={(params) => (
            <TextField {...params} label={t('Review Type')} />
          )}
          loading={areAthleteReviewTypesLoading}
        />
      </FormControl>

      <FormControl sx={{ width: 250 }}>
        <Autocomplete
          value={statusOptions.find(({ id }) => id === reviewStatus) || null}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(e, value) =>
            setFilters((prev) => ({
              ...prev,
              review_status: value?.id,
            }))
          }
          options={statusOptions}
          getOptionLabel={({ value }) => value}
          renderOption={(props, { id, value }) => (
            <li {...props} key={id}>
              {value}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label={t('Status')} />
          )}
          loading={areAthleteReviewTypesLoading}
        />
      </FormControl>
    </Stack>
  );
};

export const FiltersTranslated: ComponentType<Props> =
  withNamespaces()(Filters);
export default Filters;
