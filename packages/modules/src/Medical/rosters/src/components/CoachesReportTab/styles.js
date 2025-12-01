// @flow
import { breakPoints, colors } from '@kitman/common/src/variables';
import { rootTheme } from '@kitman/playbook/themes';

// common styles
const commonPadding = '0.5rem'; // 8px
const commonMargin = '0.5rem'; // 8px
const commonBorderRadius = '0.1875rem'; // 3px
const commonGap = '0.3125rem'; // 5px
const commonFontSize = '1.25rem'; // 20px

export const style = {
  tabWrapper: {
    background: colors.p06,
    border: window.featureFlags['coaches-report-v2']
      ? 'none'
      : `1px solid ${colors.neutral_300}`,
    borderRadius: commonBorderRadius,
    [`@media (max-width: ${breakPoints.desktop})`]: {
      '#coachesReportV2Header': {
        justifyContent: 'flex-end',
      },
      '#noteCreationHeader': {
        marginBottom: '1rem', // 16px
      },
    },
  },
  header: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: commonMargin,
    padding: '1.5rem', // 24px
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.57em',
    width: '100%',
  },
  title: {
    color: colors.grey_300,
    fontSize: commonFontSize,
    fontWeight: 600,
  },
  actionButtons: {
    margin: 0,
    display: 'flex',
    gap: '0.25rem', // 4px
  },
  bulkNotesErrorMessage: {
    paddingTop: '0.5rem',
  },
  disabledElement: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
  filters: {
    display: 'flex',
    width: '80%',
  },
  'filters--desktop': {
    gap: commonGap,
    [`@media (max-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },
  },
  'filters--mobile': {
    gap: commonGap,
    button: {
      marginBottom: commonMargin,
    },
    [`@media (min-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },
    [`@media (max-width: ${breakPoints.tablet})`]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
  filter: {
    [`@media (min-width: ${breakPoints.desktop})`]: {
      minWidth: '11.25rem', // 180px
      '.inputText': {
        width: '15rem', // 240px
      },
    },
    [`@media (max-width: ${breakPoints.desktop})`]: {
      display: 'block',
      marginBottom: '0.625rem', // 10px
      width: '100%',
    },
  },
  filtersPanel: {
    paddingLeft: '1.5625rem', // 25px
    paddingRight: '1.5625rem', // 25px
    margin: `${commonMargin} 0 0 0`,
  },
};

export const gridStyle = {
  commentContainer: {
    input: {
      display: 'inline-block',
      minWidth: '99%',
    },
  },
  addEditCommentContainer: {
    display: 'flex',
  },
  commentInputStyles: {
    background: colors.neutral_200,
    color: colors.grey_300,
    '&:focus': {
      outline: 'none',
      border: 'none',
      boxShadow: 'none',
    },
  },
  loadingText: {
    color: colors.neutral_300,
    fontSize: '0.875rem', // 14px
    fontWeight: 'normal',
    lineHeight: '1.25rem', // 20px
    marginTop: '1.5rem', // 24px
    textAlign: 'center',
    height: '3.75rem', // 60px
  },
  grid: {
    marginTop: window.featureFlags['update-perf-med-headers']
      ? undefined
      : '1.5rem', // 24px
    padding: 0,
    '.dataGrid__cell:first-child': {
      width: '10%',
      tableLayout: 'fixed',
    },
    '.dataGrid__cell:nth-child(2)': {
      width: '30%',
      tableLayout: 'fixed',
    },
    '.dataGrid__cell:nth-child(3)': {
      width: '50%',
      tableLayout: 'fixed',
    },
    'tbody tr td': {
      padding: commonPadding,
    },
    'tr th:first-of-type, tr td:first-of-type': {
      paddingLeft: '1.5rem', // 24px
    },
    'tr th:last-child, tr td:last-child': {
      paddingRight: '1.5rem', // 24px
    },
    '.dataGrid__loading': {
      marginTop: '5rem', // 80px
    },
    '.dataGrid__body .athlete__row': {
      verticalAlign: 'top',
    },
    '.dataGrid__cell': {
      width: '18.75rem', // 300px
      maxWidth: '25rem', // 400px
      padding: commonPadding,
      paddingTop: '0.26rem', // 4.16px approx
      paddingBottom: '0.135rem', // 2.16px approx
      overflow: 'visible',
    },
    '.dataGrid__fillerCell': {
      width: '0px',
    },
  },
  headerCell: {
    color: colors.grey_100,
    fontSize: '0.5625rem', // 9pt approx
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  athleteCell: {
    display: 'flex',
    width: '17.5rem', // 280px
  },
  imageContainer: {
    display: 'flex',
    width: '1.79em', // 28.65px approx
  },
  image: {
    borderRadius: '1.25rem', // 20px
    height: '2.5rem', // 40px
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '0.75rem', // 12px
  },
  rosters: {
    marginRight: '0.25rem', // 4px
  },
  defaultCell: {
    display: 'block',
    width: '15.625rem', // 250px
    overflowWrap: 'normal',
    whiteSpace: 'normal',
  },
};

export const commonStyles = {
  position: {
    color: colors.grey_100,
    fontSize: '0.75rem', // 12px
  },
};

export const v2styles = {
  dataGridWrapper: {
    width: '100%',
    height: '31.25rem', // 500px
    '[role="row"] [role="cell"]:first-of-type': {
      paddingLeft: '2.55rem', // 41px approx
      paddingRight: '1.5rem', // 24px
    },
    '[role="row"] [role="cell"]': {
      paddingBottom: '0.625rem', // 10px
      paddingTop: commonPadding,
    },
    // all checkboxes(select all)
    '[role="rowgroup"]': {
      marginLeft: '1rem', // 16px
    },
    '.MuiDataGrid-rowCount': {
      alignSelf: 'start',
      paddingBottom: '0.5rem',
    },
    '.MuiDataGrid-footerContainer': {
      flexDirection: 'column',
    },
  },
  athleteCell: {
    display: 'flex',

    // Athlete avatar img
    '.MuiAvatar-root': {
      display: 'flex',
      alignSelf: 'end',
      width: '2.125rem', // 34px approx
      height: '2.125rem', // 34px approx
    },
  },
  athleteDetailsContainer: {
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'column',
    marginLeft: '0.75rem', // 12px
    'span, a': {
      color: rootTheme.palette.text.primary,
    },
    a: {
      fontWeight: 400,
      '&:hover': {
        fontWeight: 700,
        textDecoration: 'underline',
      },
    },
  },
  hideCellBorder: {
    // Remove outer spacing from datagrid
    '[role="grid"]': {
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: 'unset',
    },
    // styles the note cells in the note column
    '[data-field="most_recent_coaches_note"]': {
      outline: 'none !important',
      padding: '0 !important',
      '&:focus': {
        border: 'none',
      },
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  inlineCopyLastNoteButton: {
    width: 'auto',
    height: '3rem', // 48px
    position: 'absolute',
    top: '4rem', // 64px
    right: '0',
    paddingRight: commonPadding,
    paddingLeft: '0',
    zIndex: '1',
    background: 'none',
    fontWeight: 400,
    letterSpacing: '0.0109rem', // 0.175px
    '&:hover': {
      background: 'none',
    },
  },
  inlineRichtextEditorButtons: {
    position: 'absolute',
    bottom: commonMargin,
    right: commonMargin,
    zIndex: '1',
    '&:focus': {
      background: 'none',
      outline: 'none',
    },
    // cancel button
    '& button:first-of-type': {
      marginRight: commonMargin,
      background: 'none',
      color: rootTheme.palette.text.primary,
      '&:hover': {
        background: rootTheme.palette.text.primary,
        color: rootTheme.palette.common.white,
      },
    },
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '0.3125rem', // 5px
    right: '0.625rem', // 10px
    display: 'flex',
    flexDirection: 'row-reverse',
    gap: '0.625rem', // 10px
  },
  modalWrapper: {
    bgcolor: 'background.paper',
    boxShadow: 24,
    left: '50%',
    p: 4,
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    height: '40rem', // 640px
    width: '50rem', // 800px
    paddingTop: 1,
    paddingLeft: 2,
    paddingRight: 2,
    borderRadius: '.3rem',
    border: 'none',
    '[class$="-editor"]': {
      height: '30rem', // 480px
    },
    h2: {
      paddingBottom: '1rem', // 16px
    },
  },
};

export default style;
