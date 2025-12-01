// @flow
export default {
  headerWrapper: {
    container: 'header / inline-size',
    width: '100%',

    // Hide rollover element if container is smaller than 28rem
    '@container header (max-width: 28rem)': {
      '[data-container-rollover]': {
        display: 'none',
      },
    },
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  rollOver: {
    lineHeight: '9px',
    fontSize: '10px',
    padding: '4px 8px !important',
    margin: 'auto',
    zIndex: 999,
    transition: 'visibility 0.3s ease',
  },
};
