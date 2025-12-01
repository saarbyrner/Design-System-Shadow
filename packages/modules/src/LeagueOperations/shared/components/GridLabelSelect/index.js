// @flow
import i18n from '@kitman/common/src/utils/i18n';

import {
  Autocomplete,
  TextField,
  MenuItem,
  Typography,
} from '@kitman/playbook/components';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';

import { useGetAllLabelsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';

type Props = {
  value: Array<number> | null,
  onUpdate: (val: Array<number> | null) => void,
};

const transformLabelData = (labelData) => ({
  id: labelData.id,
  label: labelData.name,
  value: labelData.name.toLowerCase().replace(/\s+/g, '_'),
});

const GridLabelSelect = ({ value, onUpdate }: Props) => {
  const { permissions } = usePermissions();
  const {
    data: labelOptions = [],
    isSuccess,
    isLoading,
    isError,
    isFetching,
  } = useGetAllLabelsQuery({ isSystemManaged: true }); // Fetch all labels, including system-managed ones

  // required for now as the API returns an empty array when there are no labels
  const options =
    isSuccess && Array.isArray(labelOptions)
      ? labelOptions.map(transformLabelData)
      : [];
  const selectedOption = value?.length
    ? options.find((opt) => opt.id === value[0]) ?? null
    : null;

  return permissions.homegrown.canViewHomegrown ? (
    <Autocomplete
      value={selectedOption}
      onChange={(event, newValue) => onUpdate(newValue ? [newValue.id] : null)}
      options={options}
      getOptionLabel={(option) => option?.label ?? ''}
      isOptionEqualToValue={(option, label) => option.id === label.id}
      disabled={isLoading || isError || isFetching}
      renderOption={(props, option) => (
        <MenuItem {...props} key={option.id}>
          <Typography variant="body2">{option.label}</Typography>
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField {...params} label={i18n.t('Labels')} />
      )}
      size="small"
      sx={{ margin: 1, width: '30ch' }}
      data-testid="label-select"
    />
  ) : null;
};

export default GridLabelSelect;
