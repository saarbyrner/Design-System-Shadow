// @flow
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { colors } from '@kitman/common/src/variables';

export default {
  subtitle: { color: colors.grey_100, fontSize: convertPixelsToREM(16) },
  borderIndent: `1px solid ${colors.grey_200_12}`,
  inputBackgroundStyle: {
    '.MuiInputBase-root': {
      background: colors.neutral_200,
      borderRadius: '3px',
    },
  },
};
