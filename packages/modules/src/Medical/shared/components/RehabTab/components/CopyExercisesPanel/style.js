// @flow
import {
  colors,
  breakPoints,
  zIndices,
  bannerHeights,
} from '@kitman/common/src/variables';

export default {
  copyExercisePanel: {
    zIndex: zIndices.slidingPanel,
    backgroundColor: colors.white,
    filter: `drop-shadow(0px 2px 8px ${colors.light_transparent_background}) drop-shadow(0px 2px 15px ${colors.semi_transparent_background})`,
    overflowX: 'clip',
    position: 'relative',

    [`@media only screen and (min-width: ${breakPoints.desktop})`]: {
      height: '100vh',
      maxHeight: '100vh',
      top: `-${bannerHeights.tablet}`,
      marginBottom: `-${bannerHeights.tablet}`,
    },
    [`@media only screen and (max-width: ${breakPoints.desktop})`]: {
      height: '100vh',
      maxHeight: '100vh',
      top: `-${bannerHeights.desktop}`,
      marginBottom: `-${bannerHeights.desktop}`,
    },
  },

  scrollingContainer: {
    overflowY: 'auto',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    label: 'eventGroups',
    flex: 1,
    padding: '24px',
  },

  datepickerWrapper: {
    width: '200px',
  },

  content: {
    display: 'grid',
    rowGap: '16px',
    gridTemplateColumns: '1fr',
    gridAutoRows: 'min-content',
    overflow: 'auto',
    flex: 1,

    '.toggleSwitch__label': {
      marginLeft: '0px',
    },

    '.radioList__mainLabel': {
      color: colors.grey_100,
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '4px',
      marginTop: '4px',
    },

    '.inputRadio__label': {
      color: colors.grey_100,
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '4px',
      marginTop: '4px',
    },
  },

  actions: {
    alignItems: 'center',
    background: colors.p06,
    borderTop: `1px solid ${colors.neutral_300}`,
    display: 'flex',
    height: '80px',
    justifyContent: 'flex-end',
    padding: '24px',
    textAlign: 'center',
    width: '100%',
    zIndex: 1000,
    gap: '8px',
  },
};
