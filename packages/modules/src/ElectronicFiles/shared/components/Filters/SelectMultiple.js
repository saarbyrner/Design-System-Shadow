// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Option } from '@kitman/playbook/types';
import { Autocomplete } from '@kitman/playbook/components';
import { renderInput } from '@kitman/playbook/utils/Autocomplete';

type Props = {
  label: string,
  value: Array<Option>,
  onChange: (Array<Option>) => void,
  options: Array<Option>,
};

const SelectMultipleFilter = ({
  label,
  value = [],
  onChange,
  options,
}: I18nProps<Props>) => {
  return (
    <Autocomplete
      fullWidth
      disablePortal
      size="small"
      multiple
      value={value}
      onChange={(e, val) => onChange(val)}
      options={options}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      groupBy={(option) => option.group}
      renderInput={(params) => renderInput({ params, label })}
      limitTags={2}
      sx={{ maxWidth: '450px' }}
    />
  );
};

export const SelectMultipleFilterTranslated: ComponentType<Props> =
  withNamespaces()(SelectMultipleFilter);
export default SelectMultipleFilter;
