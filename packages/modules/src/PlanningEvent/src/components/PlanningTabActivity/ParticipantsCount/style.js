// @flow
import { tooltipClasses } from '@mui/material/Tooltip';

import { colors } from '@kitman/common/src/variables';
import { type ObjectStyle } from '@kitman/common/src/types/styles';

export default ({
  stack: {
    alignItems: 'center',
  },
  tooltip: {
    [`.${tooltipClasses.tooltip}`]: {
      fontSize: '.625rem',
      fontWeight: 600,
      color: colors.grey_200,
      backgroundColor: colors.neutral_400,
      marginTop: '0px',
    },
  },
  tooltipIconButton: {
    padding: 0,
    color: colors.grey_200,
  },
}: ObjectStyle);
