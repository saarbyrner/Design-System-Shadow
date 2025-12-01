// @flow
import { useState, useEffect } from 'react';
import type { SetState } from '@kitman/common/src/types/react';
import { withNamespaces } from 'react-i18next';
import {
  Autocomplete,
  TextField,
  MenuItem,
  Checkbox,
  Stack,
} from '@kitman/playbook/components';
import searchAdditionalUsers from '@kitman/modules/src/AdditionalUsers/shared/redux/services/api/searchAdditionalUsers';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  monitorsIds: Array<number>,
  setAssignedMonitorIds: SetState<Array<number>>,
};

export const SelectMatchMonitor = (props: I18nProps<Props>) => {
  const [matchMonitors, setMatchMonitors] = useState([]);

  useEffect(() => {
    searchAdditionalUsers({
      search_expression: '',
      is_active: true,
      include_inactive: false,
      types: ['match_monitor'],
      per_page: 1000,
      page: 0,
    }).then((monitorData) => {
      setMatchMonitors(
        monitorData?.data?.map((item) => ({
          label: item.fullname,
          value: item.id,
        })) ?? []
      );
    });
  }, []);

  return (
    <Stack sx={{ padding: '10px 18px' }}>
      <Autocomplete
        options={matchMonitors}
        multiple
        disableCloseOnSelect
        renderInput={(params) => (
          <TextField {...params} label={props.t('Match monitor')} />
        )}
        renderOption={(optionProps, option, { selected }) => (
          <MenuItem {...optionProps}>
            <Checkbox checked={selected} />
            <span>{option.label}</span>
          </MenuItem>
        )}
        value={
          matchMonitors.filter((option) =>
            props.monitorsIds?.includes(option.value)
          ) || []
        }
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(_, selectedValue) => {
          props.setAssignedMonitorIds(selectedValue.map((item) => item.value));
        }}
        getOptionLabel={(option) => {
          return option.label ?? '';
        }}
        getOptionKey={(option) => option.value}
        clearOnBlur
        clearOnEscape
      />
    </Stack>
  );
};

export const SelectMatchMonitorTranslated =
  withNamespaces()(SelectMatchMonitor);
export default SelectMatchMonitor;
