// @flow

import { colors } from '@kitman/common/src/variables';

const styles = {
  pitchViewWrapper: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '10vh',
  },
  bannerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff4e5',
    padding: '15px 24px',
  },
  iconStyling: {
    marginRight: '8px',
    color: '#ef6c00',
  },
  squad: {
    margin: '0',
  },
  eventCompleteToggle: {
    display: 'flex',
    gap: '0.37rem',
    alignItems: 'center',
  },
  warningMessage: {
    color: colors.grey_200,
    marginRight: 'auto',
    marginBottom: '0px',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '24px',
    // to support small screen size and maintain inline look
    '@media (max-width: 425px)': {
      fontSize: '.75rem',
    },
  },
  editGameButton: {
    color: colors.grey_200,
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      color: colors.grey_100,
    },
    '@media (max-width: 425px)': {
      fontSize: '.75rem',
    },
  },
  metaInfo: {
    display: 'inline-block',
    marginRight: '1.5625rem',
    marginTop: '.5rem',

    h4: {
      color: '#5f7089',
      fontSize: '12px',
      fontWeight: '600',
      lineHeight: '16px',
      marginBottom: '4px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    p: {
      color: '#1f2d44',
      fontSize: '14px',
      lineHeight: '20px',
      marginBottom: '0',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  backToCalendarButtonWrapper: {
    'button::before': {
      fontSize: '.875rem',
      fontWeight: 600,
      marginTop: '.04rem',
    },
    button: {
      padding: 0,
      height: '1rem',
    },
    '.iconButton__text': {
      margin: '0 .15rem 0',
    },
  },
  subtitle: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: 400,
    color: colors.grey_300,
  },
};

export default styles;
