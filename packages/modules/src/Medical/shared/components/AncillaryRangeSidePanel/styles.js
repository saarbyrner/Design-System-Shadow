// @flow
import { colors } from '@kitman/common/src/variables';

export default {
  sidePanel: {
    '.slidingPanel': {
      display: 'flex',
      flexDirection: 'column',
    },
    '.slidingPanel__heading': {
      minHeight: '80px',
      maxHeight: '80px',
      marginBottom: '0',
    },
  },
  validation: {
    color: colors.red_100,
    padding: '10px',
    marginTop: '10px',
    border: `1px solid ${colors.red_100}`,
  },

  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: '24px',
    overflow: 'auto',
    h6: {
      color: colors.grey_200,
    },
    '.toggleSwitch': {
      marginBottom: '8px',
      '&__label': {
        marginLeft: '0',
        marginRight: '8px',
      },
      '&__input': {
        '&:checked + .toggleSwitch__slider': {
          backgroundColor: colors.grey_200,
          border: `solid 1px ${colors.grey_200}`,
        },
      },
    },
  },
  movementSelector: {
    marginBottom: '16px',
  },
  alertBox: {
    display: 'flex',
    justifyContent: 'space-evenly',
    background: colors.neutral_300,
    padding: '10px 0',
    marginBottom: '10px',
    '.icon-info': {
      fontSize: '16px',
    },
    span: {
      maxWidth: '366px',
    },
  },
  dateRangeSelector: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '8px',
    marginBottom: '16px',
    gridRow: '6',
  },
  nestedSection: {
    border: `1px solid ${colors.neutral_400}`,
    borderLeftWidth: '4px',
    borderRight: '0',
    padding: '8px 0 12px 16px',
    marginBottom: '10px',
  },
  actions: {
    alignItems: 'center',
    background: colors.p06,
    borderTop: `1px solid ${colors.neutral_300}`,
    display: 'flex',
    height: '80px',
    justifyContent: 'end',
    padding: '24px',
    textAlign: 'center',
    width: '100%',
    zIndex: 1000,
  },
};
