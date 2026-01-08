// @flow
import { colors } from '@kitman/common/src/variables';
import zIndices from '@kitman/common/src/variables/zIndices';

export const dropdownTheme = (theme: Object) => {
  return {
    ...theme,
    borderRadius: 3,
    spacing: { ...theme.spacing, controlHeight: 32 },
  };
};
export const indicatorSeparatorStyle = {
  alignSelf: 'stretch',
  backgroundColor: colors.neutral_400,
  marginBottom: 8,
  marginTop: 8,
  width: 1,
  marginLeft: '12px',
};

export const dropdownStyles = {
  menuPortal: (base: Object) => ({ ...base, zIndex: zIndices.selectMenu }),
  dropdownIndicator: (base: Object) => ({
    ...base,
    padding: '4px 8px 4px 8px !important',
  }),
  valueContainer: (base: Object) => ({
    ...base,
    minHeight: '30px !important',
    height: 'auto !important',
    maxHeight: 'none !important',
    width: '100px',
  }),
  multiValueLabel: (base: Object) => ({
    ...base,
    color: colors.grey_300,
    ':hover': {
      cursor: 'default',
    },
  }),
  multiValueRemove: (base: Object) => ({
    ...base,
    color: colors.grey_200,
    ':hover': {
      color: colors.red_100,
      backgroundColor: colors.red_50,
    },
  }),
  multiValue: (base: Object) => ({
    ...base,
    maxWidth: '500px',
  }),
};
