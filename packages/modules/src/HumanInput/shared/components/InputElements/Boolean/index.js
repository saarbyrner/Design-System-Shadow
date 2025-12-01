// @flow
/* eslint-disable react/jsx-boolean-value */

import {
  FormControlLabel,
  Switch,
  Stack,
  Typography,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
} from '@kitman/playbook/components';
import { withNamespaces } from 'react-i18next';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  element: HumanInputFormElement,
  value: string,
  onChange: Function,
};

const BooleanInput = (props: I18nProps<Props>) => {
  const { element, value, onChange } = props;
  const { element_id: elementId, text } = element.config;
  const { style = 'toggle', readonly } = element.config?.custom_params || {};

  const getControlElement = () => {
    switch (style) {
      case 'checkbox':
        return (
          <Checkbox
            id={`${elementId}-checkbox`}
            checked={value}
            onChange={() => onChange(!value)}
            disabled={readonly}
          />
        );

      case 'switch':
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>{props.t('No')}</Typography>
            <Switch
              id={`${elementId}-switch`}
              checked={value}
              onChange={() => onChange(!value)}
              readOnly={readonly}
            />
            <Typography>{props.t('Yes')}</Typography>
          </Stack>
        );
      case 'toggle':
      default:
        return (
          <ToggleButtonGroup
            color="primary"
            value={value}
            exclusive
            disabled={readonly}
            onChange={(event, newValue) => {
              onChange(newValue);
            }}
          >
            <ToggleButton value={false} disabled={readonly}>
              {props.t('No')}
            </ToggleButton>
            <ToggleButton value={true} disabled={readonly}>
              {props.t('Yes')}
            </ToggleButton>
          </ToggleButtonGroup>
        );
    }
  };
  return (
    <FormControlLabel
      labelPlacement="start"
      control={getControlElement()}
      label={text}
      inputProps={{ 'aria-label': `${text || ''} switch` }}
      sx={{ mr: 0, ml: 0, justifyContent: 'space-between' }}
    />
  );
};

export const BooleanInputTranslated = withNamespaces()(BooleanInput);
export default BooleanInput;
