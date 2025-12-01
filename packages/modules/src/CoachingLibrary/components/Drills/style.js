// @flow
import { colors } from '@kitman/common/src/variables';

const DISTANCE_FROM_PAGE_TOP_TO_GRID = '250px';

export default {
  wrapper: {
    h1: {
      fontSize: '1.50rem',
    },
    h2: {
      fontSize: '1.25rem',
      paddingLeft: '1.5rem',
      margin: 0,
    },
  },
  wrapperTop: {
    padding: '1rem 1.5rem .25rem',
    backgroundColor: colors.white,
    display: 'flex',
    justifyContent: 'space-between',
  },
  tooltipMenu: {
    '>button': {
      padding: 0,
      backgroundColor: 'transparent',
      'span:before': { fontSize: '2rem !important' },
    },
  },
  gridWrapper: {
    position: 'relative',
    margin: '1rem 1.5rem',
    paddingTop: '1rem',
    backgroundColor: colors.white,
    '.rdg': {
      border: 'none',
      width: '100%',
      height: 'fit-content',
      maxHeight: `calc(100vh - ${DISTANCE_FROM_PAGE_TOP_TO_GRID})`,
    },
    boxShadow: '0px 1px 4px 0px #00000026',

    '.rdg-cell': {
      borderInlineEnd: 'none',
      fontSize: '.875rem',
      boxShadow: 'none',
    },

    '.rdg-header-row': {
      backgroundColor: colors.p06,

      '.rdg-cell': {
        fontSize: '.75rem',
        fontWeight: 600,
        color: colors.grey_100,
      },
    },
  },
  gridWrapperTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: '1.5rem',
  },
  gridTopButtons: {
    display: 'flex',
    gap: '.25rem',
  },
  filters: {
    display: 'flex',
    margin: '.5rem 1.5rem',
    gap: '.25rem',
    '>div': {
      height: '2rem',
      width: '100%',
      maxWidth: '11rem',
    },
    '>div[role="search"]': {
      // Needed in order to display the search icon properly.
      position: 'relative',
      maxWidth: '15.5rem',
      input: {
        height: '2rem',
        padding: '0 .5rem',
      },
      '.searchBar__icon': {
        margin: '.3rem 0',
      },
    },
  },
  checkboxWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingLeft: '1.1rem',
  },
  bulkCheckboxWrapper: {
    position: 'absolute',
    top: '6.85rem',
    left: '1.56rem',
    zIndex: 1,
  },
  name: {
    cursor: 'pointer',
    fontWeight: 600,
  },
  description: {
    '>*': {
      overflow: 'auto',
      textOverflow: 'ellipsis',
    },
  },
  intensity: {
    textTransform: 'capitalize',
  },
  menu: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '2.5rem',
    '>button': {
      padding: 0,
      backgroundColor: 'transparent',
      'span:before': { fontSize: '2rem !important' },
    },
  },
  loadingText: {
    margin: '3rem auto',
    textAlign: 'center',
  },
  gridTooltipMenu: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    div: {
      height: '2rem',
    },
  },
};
