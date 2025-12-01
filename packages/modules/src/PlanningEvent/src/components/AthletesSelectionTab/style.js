// @flow
import { colors } from '@kitman/common/src/variables';

import { size as checkboxSize } from '@kitman/components/src/Checkbox/New/style';

export const athleteFormatterClassName = 'athleteFormatter';
export const participationFormatterClassName = 'participationFormatter';
const statusWrapperPadding = '.38rem';
const statusIconSize = '.5rem';
const style = {
  athleteCell: {
    display: 'flex',
    lineHeight: '1.2em',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '8px',
  },
  position: {
    color: colors.grey_100,
    fontSize: '.6875rem',
  },
  loadingText: {
    position: 'absolute',
    backgroundColor: colors.white,
    bottom: 0,
    left: 0,
    right: 0,
    height: '3.5rem',
    paddingTop: '1.25rem',
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
    paddingTop: '1.13rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
  },
  heading: {
    fontSize: '1.25rem',
    margin: 0,
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
  positionFilter: {
    '.kitmanReactSelect__menu': {
      width: '15rem',
    },
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    marginBottom: '24px',

    '.header-title': {
      fontSize: '22px',
      fontWeight: 500,
      marginBottom: '20px',
    },

    '.header-action-row': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  gridWrapper: {
    position: 'relative',

    '.rdg': {
      minHeight: '350px',
      border: 'none',
      width: '100%',
    },
    '.MuiDataGrid-columnHeaderTitleContainerContent': {
      width: '100%',

      [`.${participationFormatterClassName}`]: {
        width: '100%',
      },
      '.kitmanReactSelect__placeholder': {
        position: 'fixed',
      },
    },

    [`.${participationFormatterClassName}`]: {
      width: '100%',
    },

    '.rdg-cell': {
      boxShadow: 'none',
      borderInlineEnd: 'none',
      fontSize: '.875rem',

      [`.${athleteFormatterClassName}, .${participationFormatterClassName}`]: {
        overflow: 'auto',

        '.kitmanReactSelect__control': {
          backgroundColor: colors.white,
          borderColor: colors.white,

          ':hover': {
            backgroundColor: colors.colour_light_shadow,
            borderColor: colors.colour_light_shadow,
          },
        },
      },
    },

    '.kitmanReactSelect__control': {
      backgroundColor: colors.white,
      border: 'none',
    },
    '.rdg-summary-row': {
      backgroundColor: colors.white,
      borderBlockEnd: '2px solid #e8eaed',

      '.rdg-cell': {
        fontSize: '.75rem',
        fontWeight: 600,
        color: colors.grey_100,
        borderBlockEnd: `2px solid ${colors.neutral_300}`,
      },

      '.kitmanReactSelect__control': {
        ':hover': {
          backgroundColor: colors.white,
        },
      },
    },

    '.rdg-header-row': {
      backgroundColor: colors.p06,

      '.rdg-cell': {
        fontSize: '.75rem',
        fontWeight: 600,
        color: colors.grey_100,
        border: '0rem',
      },

      '.kitmanReactSelect__control': {
        backgroundColor: colors.grey_400,
        ':hover': {
          backgroundColor: colors.white,
        },
      },
    },
  },
  activityTogglerWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '.37rem',
  },
  groupCalculationsTogglerWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '.37rem',
  },
  activityTogglerLabel: {
    display: 'block',
  },
  groupCalculationsTogglerLabel: {
    display: 'block',
  },
  bulkActivityTogglerFormatter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingLeft: '1.1rem',
  },
  bulkActivityTogglerVerticalFormatter: {
    paddingTop: '.1rem',
    lineHeight: checkboxSize,
  },
  bulkActivityTogglerAndLabelVertical: {
    display: 'flex',
    gap: '.6rem',
  },
  bulkActivityTogglerAndLabelVerticalMui: {
    display: 'flex',
    gap: '.6rem',
    paddingLeft: '.1rem',
  },
  statusWrapper: {
    position: 'relative',
  },
  status: {
    borderRadius: '10px',
    backgroundColor: `${colors.green_100_20}`,
    paddingRight: statusWrapperPadding,
    paddingLeft: `calc(${statusWrapperPadding} + .7rem)`,
    lineHeight: '1.25rem',
    width: 'fit-content',
    textTransform: 'capitalize',
  },
  statusIcon: {
    position: 'absolute',
    top: '.85rem',
    left: '.4rem',
    width: statusIconSize,
    height: statusIconSize,
    borderRadius: '50%',
    backgroundColor: 'red',
  },
  statusIconMui: {
    top: '.36rem',
  },
  selectHeaderContainer: {
    minWidth: '7.5rem',
  },
  footer: {
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

    '.share-footer-text': {
      display: 'flex',
      alignItems: 'center',
    },
    '.footer-loading-p': {
      marginRight: '20px',
    },

    p: {
      margin: 0,
      textAlign: 'left',
      color: colors.grey_300,
      fontFamily: 'Open Sans',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '24px',
      marginLeft: '4px',
    },

    button: {
      margin: '10px 20px',
    },
  },
  footerInfo: {
    display: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '20px',

    '&.errorInfo': {
      'p, i': { color: colors.red_100 },
    },

    '@media (min-width: 800px)': {
      display: 'flex',
    },
  },
  searchBarContainer: {
    width: '240px',
    position: 'relative',

    input: {
      height: '37px',
      padding: '8px 35px 8px 11px',
    },

    '.icon-search': {
      margin: 0,
      top: '5px',
    },
  },
  athleteAvatar: {
    display: 'none',
    marginRight: '8px',

    '@media (min-width: 800px)': {
      display: 'block',
    },
  },

  athleteFullName: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    color: colors.grey_200,
  },

  athletePositionName: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '11px',
    lineHeight: '14px',
    color: colors.grey_100,
  },
  team: {
    alignItems: 'center',
    color: colors.grey_300,
    fontFamily: 'Open Sans',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '20px',
  },
  actions: {
    '.textButton__icon::before': {
      fontSize: '22px',
    },
  },
};

const DISTANCE_FROM_PAGE_TOP_TO_GRID = '360px';
export const tableStyle = {
  maxHeight: `calc(100vh - ${DISTANCE_FROM_PAGE_TOP_TO_GRID})`,
};

export default style;
