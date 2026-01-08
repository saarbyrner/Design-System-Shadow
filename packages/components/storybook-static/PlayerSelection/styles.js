// @flow
import { colors } from '@kitman/common/src/variables';

export default {
  playerSelection: {
    paddingRight: 10,

    '.accordion__icon': {
      color: colors.grey_100,
      fontWeight: 800,
    },
  },

  entireSectionHeader: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: 18,
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 16,
    color: colors.grey_100,
    marginBottom: 16,
  },

  divider: {
    borderBottom: `1px dotted ${colors.neutral_300}`,
    height: 2,
    marginBottom: 16,
    marginTop: 16,
    width: '100%',
  },

  accordionTitle: {
    alignItems: 'center',
    display: 'flex',
    fontWeight: 600,
    justifyContent: 'space-between',
    width: '100%',
    fontSize: '18px',
    lineHeight: '22px',
    color: colors.grey_200,
  },

  accordionContent: {
    paddingTop: '16px',
  },

  movedAthleteHeader: {
    alignItems: 'center',
    display: 'flex',
    height: '28px',
    justifyContent: 'flex-end',
  },

  movedAthlete: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  section: {
    borderBottom: `1px solid ${colors.neutral_300}`,
    paddingBottom: '7px',
    paddingTop: '16px',

    '&:first-of-type': {
      paddingTop: 0,
    },

    '&:last-of-type': {
      borderBottom: 'none',
    },

    header: {
      alignItems: 'center',
      display: 'flex',
      height: '28px',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
  },

  selectAll: {
    cursor: 'pointer',
    display: 'inline-block',
    padding: '0 10px',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '20px',
    color: colors.grey_100,
    margin: 0,
    borderRight: `1px solid ${colors.p04}`,

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  clearAll: {
    cursor: 'pointer',
    display: 'inline-block',
    padding: '0 10px',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '20px',
    color: colors.grey_100,
    margin: 0,
    paddingRight: 0,

    '&:hover': {
      textDecoration: 'underline',
    },
  },

  positionGroupName: {
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '16px',
    color: colors.grey_100,
    marginLeft: '16px',
  },

  positionItem: {
    fontWeight: 700,
    alignItems: 'center',
    display: 'flex',
    height: 'auto',
    maxHeight: '100px',
    overflow: 'hidden',
    paddingLeft: '18px',
    transition: 'max-height 0.3s ease 1s, background-color 0.5s ease',
  },

  athleteItem: {
    alignItems: 'center',
    display: 'flex',
    height: 'auto',
    maxHeight: '100px',
    overflow: 'hidden',
    paddingLeft: '18px',
    transition: 'max-height 0.3s ease 1s, background-color 0.5s ease',
    fontSize: '14px',
    fontWeight: 400,
  },

  positionGroupList: {
    listStyle: 'none',
    padding: 0,
    marginLeft: '12px',
  },

  positionList: {
    listStyle: 'none',
    padding: 0,

    '&.ungrouped': {
      padding: '12px 0 12px 12px',
    },
  },

  athleteList: {
    listStyle: 'none',
    padding: 0,
  },

  actionButton: {
    alignSelf: 'center',
    marginLeft: 'auto',

    '&.iconButton--transparent': {
      '&::before': {
        color: colors.grey_400,
        fontSize: '16px',
        fontWeight: 600,
      },
    },
  },

  squadsContainer: {
    marginTop: '28px',
  },

  userRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '16px',
    cursor: 'pointer',

    '& > div': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },

    p: {
      margin: 0,
      lineHeight: '20px',
    },
  },

  userRowAvatar: {
    marginLeft: '12px',
    marginRight: '8px',
  },

  userName: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    color: colors.grey_200,
  },

  userRowAthletePosition: {
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '11px',
    lineHeight: '14px',
    color: colors.grey_100,
  },
  userRowDisabled: {
    // in discussion if we should disable injured and unavailable users
    // from being added in the player selection
    // &.disabled,
    // img,
    // .reactCheckbox {
    //   cursor: not-allowed;
    // }
  },

  squadDivider: {
    height: '1px',
    backgroundColor: colors.neutral_300,
    margin: '16px 0px',
  },

  positionGroupWrapper: {
    paddingLeft: '0.1rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  squadSelectAndClearContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  // overriding the styles for dropdownWrapper that are being inherited from PivotSlidingPanel(needs to be addressed whereever SlidingPanel is used)
  playerSelectionContainer: {
    height: '100%',

    '& .dropdownWrapper': {
      width: '100%',
      margin: 0,
      padding: '0 30px',
      '@media (max-width: 600px)': {
        padding: '0 15px',
      },
    },

    '& .dropdownWrapper__search': {
      padding: '0 !important',
      width: '100%',
    },
  },
};
