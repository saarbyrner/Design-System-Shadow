// @flow
import { colors } from '@kitman/common/src/variables';

export default {
  header: {
    position: 'fixed',
    marginTop: '-50px',
    width: 'stretch',
    zIndex: 1,
    height: '50px',
    maxHeight: '50px',
    background: colors.p06,
    padding: '8px',
    borderBottom: `1px solid ${colors.neutral_300}`,
    borderLeft: `1px solid ${colors.neutral_300}`,
    borderRight: `1px solid ${colors.neutral_300}`,
    display: 'flex',
  },
  buttonMoverContracted: {
    width: '0px',
    transition: 'width 0.2s ease-in-out',
  },
  buttonMoverExpanded: {
    width: '440px',
    transition: 'width 0.2s ease-in-out',
  },
  burgerButton: {
    height: '32px',
    width: '32px',
    borderRadius: '3px',
    background: colors.neutral_300,
    border: 0,
    color: colors.grey_200,
    '&:focus': {
      filter: `drop-shadow(0px 0px 5px ${colors.grey_100})`,
    },
  },
  scrollContainer: {
    display: 'flex',
    overflowY: 'hidden',
    overflowX: 'auto',
    flex: 1,
  },
  headerContainer: {
    display: 'contents',
  },
  filters: {
    display: 'flex',
    flex: 1,
    minWidth: '740px',
  },
  actionButtons: {
    display: 'flex',
    position: 'fixed',
    right: '8px',
  },
  marginRight8: {
    marginRight: '8px',
  },
  dayModeSelect: {
    minWidth: '170px',
    marginRight: '8px',
  },
  datePicker: {
    minWidth: '170px',
    marginRight: '8px',
  },
  changeDayButtons: {
    marginLeft: '4px',
    minWidth: '64px',
    '.iconButton': {
      fontWeight: 900,
      color: colors.grey_200,
      height: '32px',
      minWidth: '32px !important',
      padding: '0px',
      '&:focus': {
        filter: `drop-shadow(0px 0px 5px ${colors.grey_100})`,
      },
    },
  },
  actions: {
    height: '100%',
    alignItems: 'center',
    display: 'flex',
    gap: '8px',
  },
  actionText: {
    alignSelf: 'center',
  },
};
