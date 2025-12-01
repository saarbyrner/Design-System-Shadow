// @flow

import { colors } from '@kitman/common/src/variables';

const style = {
  labelSelector: {
    paddingBottom: '15px',
    borderBottom: `1px solid ${colors.neutral_300}`,
  },
  labelListIcon: { fontWeight: 'bold', fontSize: '16px', marginTop: '6px' },
  loading: {
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelListName: (color: string) => ({
    borderRadius: '3px',
    background: color,
    padding: '3px',
    width: 'fit-content',
    fontSize: '14px',
    color: colors.white,
  }),
};

export default style;
