// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

export default {
  flex: css`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  `,
  gap: {
    display: 'flex',
    gap: '6px',
  },
  header: css`
    background-color: ${colors.white};
    padding: 24px;
  `,
  rosterLink: css`
    align-items: center;
    color: ${colors.grey_100} !important;
    display: flex;
    margin-bottom: 16px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;

    &:hover {
      color: ${colors.grey_100};
      text-decoration: underline;
    }

    i {
      display: inline-block;
      margin-right: 4px;
    }
  `,
  content: css`
    display: flex;
  `,
  athleteAvatar: css`
    border-radius: 50%;
    height: 84px;
    width: 84px;
  `,
  athleteContent: css`
    margin: 4px 0 0 24px;
    padding-bottom: 10px;
    overflow: auto;

    @media (min-width: ${breakPoints.tablet}) {
      padding-bottom: 0;
    }
  `,
  athleteNameWrapper: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 12px;

    @media (min-width: ${breakPoints.tablet}) {
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
  `,
  athleteName: css`
    color: ${colors.grey_300};
    font-size: 24px;
    font-weight: 600;
    margin: 0 22px 0 0;
    white-space: nowrap;
  `,
  athleteAllergies: css`
    display: flex;
    margin-right: 12px;
  `,
  athleteAllergy: css`
    margin-right: 12px;
  `,
  athleteDataWrapper: css`
    display: flex;
  `,
  athleteData: css`
    margin-right: 40px;
    h4 {
      color: ${colors.grey_100};
      margin-bottom: 2px;
      white-space: nowrap;
    }
    p {
      margin: 0;
    }
  `,
  noDataContent: css`
    text-align: center;
    display: block;
  `,
};
