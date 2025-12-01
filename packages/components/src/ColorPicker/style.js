// @flow
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import colors from '@kitman/common/src/variables/colors';
import contrastingText from '@kitman/common/src/styles/contrastingText';

const swatchSize = '2.8125rem';
const swatchBorderRadius = '5px';
const pickerOnlyTopControlsSelector = '.flexbox-fix:nth-of-type(2) > div';
const pickerOnlyBottomControlsSelector = '.flexbox-fix:nth-of-type(3) > div';

export default ({
  wrapper: {
    ':hover': {
      '#deleteColor': {
        opacity: 1,
        visibility: 'visible',
      },
    },
  },
  swatch: {
    background: colors.white,
    borderRadius: swatchBorderRadius,
    cursor: 'pointer',
    height: swatchSize,
    width: swatchSize,
    textAlign: 'center',
    verticalAlign: 'middle',
    lineHeight: swatchSize,
  },
  swatchColor: {
    borderRadius: swatchBorderRadius,
    height: swatchSize,
    width: swatchSize,
  },
  swatchLabel: {
    ...contrastingText,
    userSelect: 'none',
  },
  picker: {
    position: 'absolute',
    zIndex: 2,
  },
  pickerOnly: {
    '.sketch-picker': {
      boxShadow: 'none!important',
      [`${pickerOnlyTopControlsSelector}:nth-of-type(1)`]: {
        flex: '1 0 100%!important',
      },
      [`${pickerOnlyTopControlsSelector}:nth-of-type(2) > div`]: {
        top: '1.125rem!important',
        right: '.25rem!important',
        bottom: '-2.5rem!important',
        left: '-4.65rem!important',
      },
      [`${pickerOnlyBottomControlsSelector}:first-of-type > div`]: {
        '&:before': {
          content: '"#"',
          position: 'absolute',
          top: '.4rem!important',
          right: '10.875rem!important',
          zIndex: 1,
          fontSize: '.75rem!important',
        },
        input: {
          height: '2rem!important',
          width: '7rem!important',
          backgroundColor: colors.neutral_200,
          boxShadow: 'none!important',
          borderRadius: '3px',
          fontSize: '.75rem!important',
        },
        label: {
          display: 'none!important',
        },
      },
      [`${pickerOnlyBottomControlsSelector}:not(:first-of-type)`]: {
        display: 'none!important',
      },
    },
  },
  delete: {
    background: colors.white,
    border: `1px solid ${colors.s13}`,
    borderRadius: '25px',
    boxShadow: `1px 2px 3px 0 ${colors.p03}66`,
    color: colors.s25,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    height: '1.5625rem',
    marginLeft: '1.6875rem',
    marginTop: '-.4375rem',
    opacity: 0,
    padding: '.25rem',
    position: 'absolute',
    transition: 'visibility 0s, opacity 0.1s linear',
    visibility: 'hidden',
    width: '1.5625rem',
  },
  hidden: { display: 'none' },
  exampleTextSwatchColor: {
    width: '3.0625rem',
    height: '2rem',
    lineHeight: '2rem',
  },
}: ObjectStyle);
