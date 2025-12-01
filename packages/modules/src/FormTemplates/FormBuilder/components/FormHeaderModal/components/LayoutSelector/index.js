// @flow
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import { type ComponentType } from 'react';

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Typography,
  Radio,
  RadioGroup,
} from '@kitman/playbook/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type LayoutType = 'left' | 'right' | 'center';

type Props = {
  layout: LayoutType,
  handleChange: (layout: LayoutType) => void,
};

const LayoutSelector = ({ t, layout, handleChange }: I18nProps<Props>) => {
  const getAlignment = (layoutOption: LayoutType) => {
    switch (layoutOption) {
      case 'left':
        return 'flex-start';
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      default:
        return 'flex-start';
    }
  };

  const renderLayoutOption = (layoutOption: LayoutType) => (
    <Box
      sx={{
        backgroundColor: colors.neutral_200,
        display: 'flex',
        p: 2,
        justifyContent: getAlignment(layoutOption),
      }}
    >{`${t('Logo')} | ${t('Title')}`}</Box>
  );

  const layoutOptions = ['left', 'center', 'right'];

  return (
    <FormControl>
      <FormLabel id="layout-radio-buttons-group-label">
        <Typography
          variant="subtitle1"
          mb={1}
          sx={{ color: 'text.primary', fontSize: '14px' }}
        >
          {t('Layout')}
        </Typography>
      </FormLabel>
      <RadioGroup
        aria-labelledby="layout-radio-buttons-group-label"
        defaultValue={layout}
        value={layout}
        name="layout-radio-buttons-group"
      >
        {layoutOptions.map((option) => (
          <Box
            key={option}
            sx={{ display: 'flex', alignItems: 'center' }}
            mb={1}
          >
            <FormControlLabel
              value={option}
              control={<Radio />}
              onChange={(e) => {
                handleChange(e.target.value);
              }}
            />
            <Box sx={{ flexGrow: 1 }}>{renderLayoutOption(option)}</Box>
          </Box>
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export const LayoutSelectorTranslated: ComponentType<Props> =
  withNamespaces()(LayoutSelector);
export default LayoutSelector;
