// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  header: css`
    background-color: ${colors.white};
    padding: 24px;
  `,
  actions: css`
    align-items: center;
    display: flex;
    justify-content: space-between;
  `,
  athleteSection: css`
    display: flex;
  `,
  backlink: css`
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
  athleteAvatar: css`
    border-radius: 50%;
    height: 84px;
    width: 84px;
  `,
  athleteContent: css`
    margin: 4px 0 0 24px;
    overflow: auto;
  `,
  athleteNameWrapper: css`
    margin-bottom: 12px;
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
    margin-top: 7px;
    margin-right: 12px;
    overflow: auto;
  `,
  athleteAllergy: css`
    margin-right: 12px;
  `,
};
