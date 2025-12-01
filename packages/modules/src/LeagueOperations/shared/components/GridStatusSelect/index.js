// @flow
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import {
  Autocomplete,
  TextField,
  MenuItem,
  Typography,
} from '@kitman/playbook/components';
import type { SelectOption } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import { useFetchRegistrationStatusOptionsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import useRegistrationStatus from '@kitman/modules/src/LeagueOperations/shared/hooks/useRegistrationStatus';

type Props = {
  value: string,
  onUpdate: Function,
  userType: string,
};

const GridStatusSelect = (props: I18nProps<Props>) => {
  const {
    data: statusOptions = [],
    isLoading,
    isError,
    isFetching,
  } = useFetchRegistrationStatusOptionsQuery();
  const {
    registrationFilterStatuses,
    isLoadingRegistrationFilterStatusesData,
    isErrorRegistrationFilterStatusesData,
    isSuccessRegistrationFilterStatuses,
  } = useRegistrationStatus({
    permissionGroup: props.userType,
  });

  const options =
    (isSuccessRegistrationFilterStatuses && registrationFilterStatuses) ||
    statusOptions;

  const getValue = () => {
    const getInitValue = () =>
      options.find((item) => item.value === props.value) || null;

    return props.value ? { value: getInitValue() } : { value: null };
  };

  const isDisabled = window.featureFlags[
    'league-ops-update-registration-status'
  ]
    ? isLoadingRegistrationFilterStatusesData ||
      isErrorRegistrationFilterStatusesData
    : isLoading || isError || isFetching;

  const renderOption = (renderOptionProps, option: SelectOption) => {
    return (
      <MenuItem {...renderOptionProps} key={option.value}>
        <Typography variant="body2">{option.label}</Typography>
      </MenuItem>
    );
  };

  return (
    <Autocomplete
      {...getValue()}
      onChange={(e, value) => props.onUpdate(value ?? null)}
      getOptionLabel={(option) => option.label}
      size="small"
      sx={{ m: 1, width: '30ch' }}
      // Silences this console error: Received `true` for a non-boolean attribute `select`.
      select={1}
      disabled={isDisabled}
      variant="filled"
      renderInput={(params) => (
        <TextField {...params} label={props.t('Status')} />
      )}
      options={options || []}
      renderOption={renderOption}
      isOptionEqualToValue={(option, value) => option.value === value.value}
    />
  );
};

export const GridStatusSelectTranslated = withNamespaces()(GridStatusSelect);
export default GridStatusSelect;
