// @flow
import { css } from '@emotion/react';

import { colors } from '@kitman/common/src/variables';

export const style = {
  athleteCell: css({
    display: 'flex',
    lineHeight: '20px',
  }),
  imageContainer: css({
    display: 'flex',
    alignItems: 'center',
  }),
  detailsContainer: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: '12px',
  }),
  name: css({
    marginBottom: '0px',
    lineHeight: '20px',
  }),
  position: css({
    color: colors.grey_100,
    fontSize: '12px',
  }),
  header: css({
    display: 'flex',
    color: colors.grey_100,
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
  }),
  toggleColumnStyle: css({
    '.toggleSwitch': {
      marginLeft: '70px',
    },
  }),
  toggleStyles: css({
    '.toggleSwitch': {
      '&__input': {
        '&:checked + .toggleSwitch__slider': {
          backgroundColor: colors.blue_400,
          border: `solid 1px ${colors.blue_400}`,
        },
      },
    },
  }),
};

export default {};
