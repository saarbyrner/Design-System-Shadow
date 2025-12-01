// @flow
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { colors } from '@kitman/common/src/variables';

export default {
  entities: {
    padding: '12px 24px',
  },
  label: {
    color: colors.grey_300,
    fontSize: convertPixelsToREM(14),
    lineHeight: convertPixelsToREM(16),
    fontWeight: '600',
    marginBottom: convertPixelsToREM(10),
    marginTop: convertPixelsToREM(10),
  },
  datePickers: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: convertPixelsToREM(8),
    paddingLeft: convertPixelsToREM(24),
    paddingRight: convertPixelsToREM(24),

    '& div': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
};
