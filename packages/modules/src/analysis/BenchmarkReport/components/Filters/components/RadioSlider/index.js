// @flow
import { useState, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Slider,
  Box,
  Typography,
} from '@kitman/playbook/components';
import colors from '@kitman/common/src/variables/colors';
import { getHasDefaultBioBandRange } from '@kitman/modules/src/analysis/BenchmarkReport/utils';
import {
  BIO_BAND_RADIO_ENUM_LIKE,
  DEFAULT_BIO_BAND_RANGE,
  ADULT_HEIGHT_TRANSLATION_CONTEXT,
} from '@kitman/modules/src/analysis/BenchmarkReport/consts';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { BioBandOption } from '@kitman/modules/src/analysis/BenchmarkReport/types';

type Props = {
  option: BioBandOption,
  onChange: (BioBandOption) => void,
};

const RadioSlider = (props: I18nProps<Props>) => {
  const hasDefaultValue =
    !props.option.value || getHasDefaultBioBandRange(props.option.value);

  const [value, setValue] = useState(
    hasDefaultValue
      ? BIO_BAND_RADIO_ENUM_LIKE.Any
      : BIO_BAND_RADIO_ENUM_LIKE.Range
  );
  const [range, setRange] = useState(props.option);

  const [rangeStart, rangeEnd] = range.value;

  const shouldShowSlider = value === BIO_BAND_RADIO_ENUM_LIKE.Range;

  const radioOptions = [
    { value: BIO_BAND_RADIO_ENUM_LIKE.Any, label: props.t('Any') },
    { value: BIO_BAND_RADIO_ENUM_LIKE.Range, label: props.t('Select range') },
  ];

  // Prevents the slider ‘thumbs’ from crossing, and allows them to stop at an
  // interval (set to 1 for now).
  const handleChange = (
    event: Event,
    [newStartValue, newEndValue]: Array<number>,
    activeThumb: number
  ) => {
    let updatedValue;

    if (activeThumb === 0) {
      updatedValue = [Math.min(newStartValue, rangeEnd - 1), rangeEnd];
    } else {
      updatedValue = [rangeStart, Math.max(newEndValue, rangeStart + 1)];
    }

    setRange({
      value: updatedValue,
      label: props.t('{{filterValueOne}}%–{{filterValueTwo}}% of AH', {
        filterValueOne: updatedValue[0],
        filterValueTwo: updatedValue[1],
        context: 'AH is an abbreviation of ‘adult height’',
      }),
    });
  };

  return (
    <Box
      css={{
        padding: '0.5rem',
        backgroundColor: colors.white,
        width: '100%',
      }}
    >
      <FormControl>
        <RadioGroup
          row
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            let newRange = {
              value: [65, 100],
              label: props.t('65%–100% of AH', {
                context: ADULT_HEIGHT_TRANSLATION_CONTEXT,
              }),
            };
            if (event.target.value === BIO_BAND_RADIO_ENUM_LIKE.Any) {
              newRange = {
                value: DEFAULT_BIO_BAND_RANGE,
                label: props.t('Any'),
              };
            }
            setRange(newRange);
          }}
        >
          {radioOptions.map((option) => (
            <FormControlLabel
              value={option.value}
              label={option.label}
              key={`${option.label}_label`}
              css={{
                '& .MuiTypography-root': {
                  fontSize: '0.875rem',
                },
              }}
              control={
                <Radio
                  css={{
                    '& .MuiSvgIcon-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              }
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Box
        css={{
          borderTop: `1px solid ${colors.neutral_300}`,
        }}
      >
        {shouldShowSlider && (
          <Box
            css={{
              display: 'flex',
              padding: '0.5rem 0',
            }}
          >
            <Slider
              min={65}
              max={100}
              defaultValue={65}
              value={range.value}
              css={{
                margin: '0.5rem 0',
              }}
              getAriaLabel={() => {
                props.t('Bio band range');
              }}
              onChange={handleChange}
              valueLabelDisplay="auto"
              disableSwap
            />
          </Box>
        )}

        <Box
          css={{
            display: 'flex',
            justifyContent: shouldShowSlider ? 'space-between' : 'flex-end',
            alignItems: 'center',
            paddingTop: shouldShowSlider ? '0' : '1rem',
          }}
        >
          {shouldShowSlider && (
            <Typography
              css={{
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              {props.t('{{filterValueOne}}%–{{filterValueTwo}}% of AH', {
                filterValueOne: rangeStart,
                filterValueTwo: rangeEnd,
                context: ADULT_HEIGHT_TRANSLATION_CONTEXT,
              })}
            </Typography>
          )}

          <Button
            color="secondary"
            onClick={() => {
              props.onChange(range);
            }}
          >
            {props.t('Apply')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const RadioSliderTranslated: ComponentType<Props> =
  withNamespaces()(RadioSlider);
export default RadioSlider;
