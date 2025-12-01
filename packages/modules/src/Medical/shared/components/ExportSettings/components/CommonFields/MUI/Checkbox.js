// @flow
import { type Node, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import { useExportSettings } from '../../Context';

type Props = {
  fieldKey: string,
  label: string,
  defaultValue?: boolean,
  isCached?: boolean,
};

const Checkbox = ({
  fieldKey,
  label,
  defaultValue = false,
  isCached = false,
  t,
}: I18nProps<Props>): Node => {
  const { setFieldValue, formState } = useExportSettings();

  const value = formState[fieldKey] ?? defaultValue;

  const handleChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    setFieldValue(fieldKey, event.target.checked, isCached);
  };

  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          checked={value}
          onChange={handleChange}
          name={fieldKey}
          color="primary"
        />
      }
      label={t(label)}
    />
  );
};

export const CheckboxTranslated: ComponentType<Props> =
  withNamespaces()(Checkbox);
export default Checkbox;
