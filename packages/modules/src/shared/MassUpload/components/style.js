// @flow
import { colors } from '@kitman/common/src/variables';

export default {
  container: {
    padding: '8px',
    border: `1px solid ${colors.neutral_300}`,
    borderRadius: '3px',
    maxHeight: '35vh',

    '.dataGrid': {
      maxHeight: '30vh !important',
    },
  },
  tabCustomStyle: {
    '.rc-tabs-bar': {
      backgroundColor: colors.p06,
    },
    '.rc-tabs-tabpane': {
      padding: '8px',
      backgroundColor: colors.white,
    },
  },
  modalAdditionalStyle: {
    maxHeight: '55vh !important',
  },
};
