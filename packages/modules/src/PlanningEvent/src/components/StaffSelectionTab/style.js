// @flow
import { colors } from '@kitman/common/src/variables';

export const userFormatterClassName = 'userFormatter';
export const participationFormatterClassName = 'participationFormatter';
const style = {
  userCell: {
    display: 'flex',
    lineHeight: '1.2em',
    height: '2rem',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '8px',
  },
  position: {
    color: colors.grey_100,
    fontSize: '.5rem',
  },
  loadingText: {
    marginTop: '1.25rem',
    height: '2.5rem',
    textAlign: 'center',
  },
  wrapper: {
    backgroundColor: colors.white,
    boxShadow: '0 1px 4px 0 #00000026',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  heading: {
    fontSize: '1.25rem',
    margin: 0,
  },
  gridWrapper: {
    display: 'flex',

    '.rdg': {
      minHeight: '350px',
      border: 'none',
      width: '100%',
    },

    '.rdg-cell': {
      boxShadow: 'none',
      borderInlineEnd: 'none',
      fontSize: '.875rem',

      [`.${userFormatterClassName}, .${participationFormatterClassName}`]: {
        overflow: 'auto',
      },
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
  activityTogglerWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '.37rem',
  },
  activityTogglerLabel: {
    display: 'block',
  },
  bulkActivityTogglerFormatter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingLeft: '1.1rem',
  },
  emptyTable: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '50vh',
  },
  emptyTableText: {
    color: colors.grey_100,
    fontWeight: 600,
  },
};

const appHeaderHeightInPx = 50;
const planningSectionHeaderInPx = 133.5;
const tabsBarInPx = 39;
const tabTopMarginInPx = 16;
const tabHeaderInPx = 69.5;
const topOffset =
  appHeaderHeightInPx +
  planningSectionHeaderInPx +
  tabsBarInPx +
  tabTopMarginInPx +
  tabHeaderInPx;
export const tableStyle = {
  maxHeight: `calc(100vh - ${topOffset}px`,
};

export default style;
