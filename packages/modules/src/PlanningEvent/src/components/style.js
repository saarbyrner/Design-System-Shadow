// @flow
import { css } from '@emotion/react';
import {
  breakPoints,
  bannerHeights,
  colors,
} from '@kitman/common/src/variables';

export default {
  gridLayout: css`
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-areas: 'content slideout';
  `,

  content: css`
    grid-area: content;
    display: flex;
    flex-flow: column;
    max-width: 100%;
    overflow: hidden;
  `,
  teamToggle: css`
    padding: 15px 20px;
    background-color: ${colors.white};
  `,
  slideout: css`
    grid-area: slideout;
    position: relative;

    height: calc(100vh - ${bannerHeights.tablet});

    @media only screen and (min-width: ${breakPoints.desktop}) {
      height: calc(100vh - ${bannerHeights.tablet});
    }
    @media only screen and (max-width: ${breakPoints.desktop}) {
      height: calc(100vh - ${bannerHeights.desktop});
    }
  `,

  errorBannerContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${colors.s14};
    background-color: ${colors.red_100};
    padding: 20px 30px;
    margin-bottom: 10px;
    z-index: 1000;
    width: 100%;

    span {
      color: ${colors.white};
    }
  `,

  errorNotificationContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid ${colors.s14};
    background-color: ${colors.p06};
    bottom: 90px;
    padding: 20px 30px;
    position: absolute;
    width: 100%;
    z-index: 1000;

    &.formation_error {
      bottom: 80px;
    }
  `,
  removedPlayerErrorText: css`
    display: flex;
    align-items: center;
    color: ${colors.red_100};
    font-size: 12px;
    font-weight: 500;

    i {
      margin-right: 5px;
      font-size: 16px;
    }
  `,
  dismissText: css`
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  `,
  leagueAndOfficialLayout: css`
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-areas: 'content slideout';
    background-color: ${colors.s23};

    @media (min-width: ${breakPoints.tablet}) {
      padding: 16px 20px;
    },
  `,
  shiftContent: css`
    padding-left: 269px;
  `,
  addAthletesSidePanel: {
    display: 'flex',
    flexDirection: 'column',
    // 104px is height header + padding
    height: 'calc(100% - 104px)',
  },
  addAthletesSidePanelContent: {
    flexGrow: 1,
    position: 'relative',
    overflowY: 'auto',
  },
  addAthletesSidePanelActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '96px',
    padding: '0 30px',
    background: `${colors.p06}`,
    borderTop: `1px solid ${colors.s14}`,
  },
};
