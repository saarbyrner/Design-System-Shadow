// @flow
import type { ElementRef, ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TextField, InputAdornment } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';

type Props = {
  inputRef?: ElementRef<any>,
  value: string,
  onChange: (value: string) => void,
  disabled?: boolean,
};

const SearchFilter = ({
  inputRef,
  value = '',
  onChange,
  disabled = false,
  t,
}: I18nProps<Props>) => {
  return (
    <TextField
      inputRef={inputRef}
      label={t('Search')}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <KitmanIcon name={KITMAN_ICON_NAMES.Search} fontSize="small" />
          </InputAdornment>
        ),
      }}
      sx={{ width: '180px' }}
      disabled={disabled}
    />
  );
};

export const SearchFilterTranslated: ComponentType<Props> =
  withNamespaces()(SearchFilter);
export default SearchFilter;
