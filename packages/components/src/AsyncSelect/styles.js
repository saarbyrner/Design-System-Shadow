// @flow
import zIndices from '@kitman/common/src/variables/zIndices';

export const dropdownTheme = (theme: Object) => {
  return {
    ...theme,
    borderRadius: 3,
    spacing: { ...theme.spacing, controlHeight: 32 },
  };
};

export const dropdownStyles = {
  menuPortal: (base: Object) => ({ ...base, zIndex: zIndices.selectMenu }),
  dropdownIndicator: (base: Object) => ({
    ...base,
    padding: '4px 8px 4px 8px !important',
  }),
};
