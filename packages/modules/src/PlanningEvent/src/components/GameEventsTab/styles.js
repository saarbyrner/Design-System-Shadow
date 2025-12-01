// @flow
import { colors, breakPoints } from '@kitman/common/src/variables';

const styles = {
  saveFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '75px',
    textAlign: 'right',
    background: colors.white,
    borderTop: `1px solid ${colors.neutral_300}`,
    zIndex: 2147483004,
    button: {
      margin: '10px 20px',
    },
    [`@media (min-width: ${breakPoints.desktop})`]: {
      '.main--mainMenuOpen &': {
        width: 'calc(100% - 220px)',
        paddingLeft: '20px',
      },
    },
  },

  listViewContainer: {
    display: 'flex',
    width: '100%',
    paddingBottom: '10vh',
  },

  bannerInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
  },
};

const importedGameFooter = {
  ...styles.saveFooter,
  justifyContent: 'space-between',
  paddingLeft: '5%',

  '.dmn-dmr-bar-info-bar': {
    display: 'flex',
    alignItems: 'center',
    overflowX: 'scroll',

    p: {
      width: 'fit-content',
    },
  },

  p: {
    marginTop: '10px',
    marginLeft: '4px',
    textOverflow: 'ellipsis',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: '150px',
  },

  [`@media (min-width: ${breakPoints.tablet})`]: {
    p: {
      width: 'fit-content',
    },
  },
};

export default styles;
export { importedGameFooter };
