// @flow

import { colors } from '@kitman/common/src/variables';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  wrapper: {
    backgroundColor: colors.white,
    boxShadow: '0 1px 4px 0 #00000026',
    border: `1px solid ${colors.s13}`,
    overflow: 'scroll',
    minHeight: '100vh',
    padding: '24px 24px 16px 24px',
    mediaMinWidth: '1050px',
    headerDisplay: 'flex',
    flexDirection: 'column',
    h3Color: colors.grey_300,
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
    display: 'flex',
    flexGrow: '1',
  },
  title: {
    marginBottom: '24px',
  },
};

export default styles;
