// @flow
import colors from '@kitman/common/src/variables/colors';
import { type ObjectStyle } from '@kitman/common/src/types/styles';

export default ({
  sidePanel: {
    '.MuiDialog-container': {
      justifyContent: 'end',
      '.MuiPaper-root': {
        maxWidth: '28.75rem',
      },
    },
    '.MuiBackdrop-root': {
      display: 'none',
    },
    '.MuiPaper-root': {
      boxShadow: '0px 3.2px 7.2px 0px #00000021, 0px 0.6px 1.8px 0px #0000001A',
    },
  },
  clickAwayContainer: {
    height: '100vh',
  },
  sidePanelTitle: {
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: '1.375rem',
    padding: '1.5rem',
    color: colors.grey_300,
  },
  close: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  search: {
    height: '2rem',
    marginBottom: '1.5rem',
    '.MuiInputBase-root': {
      borderRadius: '4px',
      backgroundColor: colors.neutral_200,
      color: colors.grey_200,
      '&:before': {
        display: 'none',
      },
    },
    '.MuiInputBase-input': {
      padding: '0!important',
      height: '2rem',
    },
    '.MuiFormLabel-root': {
      top: '-.5rem',
      fontSize: '.875rem',
      '&.Mui-focused': {
        display: 'none',
      },
    },
  },
  squadsTitle: {
    fontWeight: 600,
    lineHeight: '1.125rem',
  },
  divider: {
    margin: '.5rem 0',
    borderColor: colors.neutral_300,
  },
  squad: {
    boxShadow: 'none!important',
    ':before': {
      opacity: '0!important',
    },
  },
  squadName: {
    padding: 0,
    minHeight: 0,
    '.MuiAccordionSummary-content': {
      margin: 0,
      '.MuiTypography-root': {
        fontSize: '.875rem',
        fontWeight: 400,
      },
    },
  },
  squadDetails: {
    padding: 0,
  },
  checkbox: {
    padding: '0 .375rem 0 9px',
  },
  squadCheckboxLabel: {
    marginTop: '.625rem',
    '.MuiFormControlLabel-label': {
      fontSize: '.875rem',
      fontWeight: 600,
      color: colors.grey_300,
    },
  },
  getGroupHeader: (index: number): ObjectStyle => ({
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: `${index === 0 ? '1.125' : '.5'}rem`,
  }),
  groupName: {
    lineHeight: '1rem',
    fontSize: '.75rem',
    fontWeight: 600,
    color: colors.grey_100,
  },
  groupControls: {
    '.MuiButton-root': {
      padding: '0 .5rem',
      fontSize: '.75rem',
      fontWeight: 400,
      lineHeight: '1',
      minWidth: 'unset',
      color: colors.grey_100,
    },
  },
  groupHeaderDivider: {
    margin: '.125rem 0 .625rem',
    borderColor: colors.neutral_300,
  },
  selectGroup: {
    borderRight: `1px solid ${colors.neutral_300}`,
  },
  athleteCheckboxLabel: {
    '.MuiFormControlLabel-label': {
      fontSize: '.875rem',
      color: colors.grey_300,
    },
  },
  sidePanelActions: {
    height: '5rem',
    padding: '1.5rem',
    justifyContent: 'space-between',
    borderTop: `2px solid ${colors.neutral_300}`,
  },
  sidePanelCancelButton: {
    height: '2rem',
    backgroundColor: 'transparent',
  },
  sidePanelConfirmButton: {
    height: '2rem',
  },
}: ObjectStyle);
