// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Box,
  Stack,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

import { css } from '@emotion/react';
import { useSettings } from './SettingsContext';

type Props = {};

const styles = {
  formControl: css`
    min-width: 150px;
  `,
};

const sizeOptions = [
  { value: 'a4', label: 'A4' },
  { value: 'us_letter', label: 'US Letter' },
];

const orientationOptions = [
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
];

function SettingsForm(props: I18nProps<Props>) {
  const { fieldValue, onFieldValueChange } = useSettings();

  return (
    <>
      <Stack spacing={2} direction="row" paddingX={2}>
        <Box css={styles.formControl}>
          <FormControl>
            <InputLabel id="page-size-field-label">
              {props.t('Page Size')}
            </InputLabel>
            <Select
              labelId="page-size-field-label"
              id="page-size-field"
              value={fieldValue('size')}
              onChange={(e) => onFieldValueChange('size', e.target.value)}
              renderValue={(selected) =>
                sizeOptions.find(({ value }) => value === selected)?.label || ''
              }
            >
              {sizeOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box css={styles.formControl}>
          <FormControl>
            <InputLabel id="radio-button-field-label">
              {props.t('Orientation')}
            </InputLabel>
            <Select
              labelId="radio-button-field-label"
              id="radio-button-field"
              value={fieldValue('orientation')}
              onChange={(e) =>
                onFieldValueChange('orientation', e.target.value)
              }
              renderValue={(selected) =>
                orientationOptions.find(({ value }) => value === selected)
                  ?.label || ''
              }
            >
              {orientationOptions.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </>
  );
}

export const SettingsFormTranslated: ComponentType<Props> =
  withNamespaces()(SettingsForm);
export default SettingsForm;
