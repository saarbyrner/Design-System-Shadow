// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Option } from '@kitman/playbook/types';
import { Autocomplete } from '@kitman/playbook/components';
import { renderInput } from '@kitman/playbook/utils/Autocomplete';

type Props = {
  label: string,
  options: Array<Option>,
  value: ?Option,
  onChange: (value: Option) => void,
  disabled?: boolean,
};

const SelectFilter = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: I18nProps<Props>) => {
  return (
    <Autocomplete
      disablePortal
      size="small"
      value={value}
      onChange={(e, val) => onChange(val)}
      options={options}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      groupBy={(option) => option.group}
      renderInput={(params) => renderInput({ params, label })}
      sx={{ width: '165px' }}
      disabled={disabled}
    />
  );
};

export const SelectFilterTranslated: ComponentType<Props> =
  withNamespaces()(SelectFilter);
export default SelectFilter;
