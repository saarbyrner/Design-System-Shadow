// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  title: css({
    color: `${colors.grey_300}`,
    fontWeight: 600,
    fontSize: '20px',
  }),
  statistics: css({
    backgroundColor: `${colors.p06}`,
    marginBottom: 0,
    alignItems: 'center',
    display: 'flex',
    gap: '56px',
  }),
  statistic: css({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '58px',
  }),
  statisticTitle: css({
    fontSize: '16px',
    color: `${colors.grey_100}`,
    fontWeight: 600,
  }),
  value: css({
    fontSize: '14px',
    color: `${colors.grey_300}`,
    fontWeight: 400,
  }),
};
