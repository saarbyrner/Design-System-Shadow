// @flow
import { colors } from '@kitman/common/src/variables';

const contentHeight = '100vh - 156px';
const accordionButtonHeight = '.5rem';
const style = {
  loadingText: {
    margin: '75% auto',
    textAlign: 'center',
  },
  content: {
    height: `calc(${contentHeight})`,
    padding: '18px 24px 60px',
    overflow: 'auto',
  },
  row: {
    marginBottom: '16px',
    width: '100%',
  },
  rowHeader: {
    marginBottom: '8px',
    fontSize: '12px',
    fontWeight: '600',
    color: colors.grey_100,
  },
  error: {
    color: colors.red_100,
    fontSize: '.75rem',
  },
  requiredRowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  requiredLabel: {
    fontWeight: 400,
  },
  drillLinkTitleInput: {
    flex: 1,
    marginRight: '5px',
  },
  drillLinkURLInput: {
    flex: 1.5,
    marginLeft: '5px',
  },
  actions: {
    background: colors.white,
    borderTop: `1px solid ${colors.s14}`,
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
    left: 0,
    padding: '30px',
    position: 'absolute',
    width: '100%',
  },
  singleAction: {
    justifyContent: 'end',
  },
  mainLibraryAction: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: colors.s18,
    fontSize: '14px',
    marginLeft: '10px',
  },
  associatedSquadsLabel: {
    marginTop: '.3rem',
    fontSize: '.6875rem',
  },
  activityBasedOptions: {
    width: '100%',
    borderLeft: `4px solid ${colors.neutral_500}`,
    paddingLeft: '.5rem',
    hr: {
      marginTop: '.5rem',
      marginBottom: '.5rem',
      borderTop: `2px solid ${colors.neutral_300}`,
    },
  },
  activityBasedOptionsLastSeparator: {
    marginTop: '.5rem',
    marginBottom: '1rem',
    borderTop: `2px solid ${colors.neutral_300}`,
  },
  urlRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'stretch',
    marginBottom: '10px',

    a: {
      marginLeft: '12px',
    },

    label: {
      display: 'none',
    },

    '&:first-of-type': {
      label: {
        display: 'inline-block',
      },
    },
  },
  activityRow: {
    marginBottom: 0,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap-reverse',
    marginBottom: '1rem',
  },
  tag: {
    marginTop: '.5rem',
    marginRight: '.375rem',
  },
  linkContainer: {
    display: 'grid',
    gridColumn: 'span 2',
    gridRow: '10',
    columnGap: '8px',
    gridTemplateColumns: '1fr 1fr 0.2fr',
    marginTop: '16px',
  },
  linkTitle: {
    gridColumn: '1 / 1',
    marginBottom: '16px',
  },
  titleUriSeparator: {
    marginRight: '2px',
    marginLeft: '2px',
  },
  disabledFileUploadArea: {
    '*': {
      cursor: 'not-allowed !important',
    },
  },
  linkUri: {
    gridColumn: '2 / 2',
    marginBottom: '16px',
  },
  linkAddButton: {
    gridColumn: '3/3',
    margin: '16px 0px',
    paddingTop: '8px',
  },
  linkRender: {
    backgroundColor: colors.neutral_100,
    borderColor: colors.neutral_100,
    alignItems: 'center',
    color: colors.grey_200,
    display: 'flex',
    marginBottom: '8px',
  },
  attachmentLink: {
    color: colors.grey_200,
    fontWeight: '400',

    [`&:visited,
      &:hover,
      &:focus,
      &:active`]: {
      color: colors.grey_300,
    },

    '&:hover': {
      textDecoration: 'underline',
    },
  },
  links: {
    gridColumn: 'span 3',
  },
  sidePanelTitle: {
    paddingRight: '0.5rem',
  },
  deleteDrillButton: {
    color: colors.grey_300,
    cursor: 'pointer',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.3125rem',
  },
  actionButtonsSpread: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  accordion: {
    title: {
      marginLeft: '.5rem',
      width: 'initial',
      color: colors.grey_100,
      fontSize: '.75rem',
      fontWeight: 600,
    },
    button: {
      position: 'relative',
      marginBottom: accordionButtonHeight,
      marginLeft: '.75rem',

      'span:before': {
        position: 'absolute',
        top: `calc(${accordionButtonHeight} / -2)`,
        left: `calc(${accordionButtonHeight} / -2)`,
        fontSize: '.5rem',
      },
    },
  },
  invalidActivityNameInput: {
    input: {
      background: `${colors.red_100} !important`,
    },
  },
};

export default style;
