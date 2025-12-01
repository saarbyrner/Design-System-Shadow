// @flow
import { css } from '@emotion/react';
import { colors, breakPoints } from '@kitman/common/src/variables';

const getStyles = (
  withVerticalLayout: boolean = false,
  withBorder: boolean = false
) => ({
  content: css`
    background: ${colors.p06};
    border: ${withBorder && `1px solid ${colors.neutral_300}`};
    border-radius: 3px;
    display: flex;
    padding: ${withBorder && '24px'};
    margin-bottom: 8px;
    flex-direction: ${withVerticalLayout && 'column'};
    position: relative;
    @media (max-width: ${breakPoints.tablet}) {
      display: block;
    }
  `,
  loaderWrapper: css`
    bottom: ${withVerticalLayout ? '-8px' : 0};
    height: 4px;
    left: 0;
    overflow: hidden;
    position: absolute;
    width: 100%;
  `,
  athleteAvatar: css`
    border-radius: 50%;
    height: 32px;
    width: 32px;
  `,
  leftContent: css`
    flex: 1;
    border-right: ${!withVerticalLayout && `1px solid ${colors.neutral_300}`};
    border-bottom: ${withVerticalLayout && `1px solid ${colors.neutral_300}`};
    margin-bottom: ${withVerticalLayout && '24px'};
    padding-right: ${!withVerticalLayout && '24px'};
    padding-bottom: ${withVerticalLayout && '24px'};

    @media (max-width: ${breakPoints.tablet}) {
      padding-bottom: 24px;
      border-bottom: 1px solid ${colors.neutral_300};
      padding-right: 0;
      border-right: 0;
    }
  `,
  rightContent: css`
    display: ${withVerticalLayout && 'flex'};
    min-width: ${!withVerticalLayout && '485px'};
    max-width: ${!withVerticalLayout && '485px'};
    padding-left: ${!withVerticalLayout && '24px'};
    justify-content: ${withVerticalLayout && 'space-between'};
    color: ${colors.grey_300};

    > div {
      flex: 1;
    }

    @media (max-width: ${breakPoints.desktop}) {
      min-width: ${!withVerticalLayout && '285px'};
      max-width: ${!withVerticalLayout && '285px'};
    }

    @media (max-width: ${breakPoints.tablet}) {
      padding-top: 24px;
      padding-left: 0;
      min-width: 0;
      max-width: 100%;
    }
  `,
  athleteDetails: css`
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    img {
      margin-right: 8px;
    }
  `,
  noteTitle: css`
    align-items: center;
    display: flex;
    gap: 13px;
    @media (max-width: ${breakPoints.tablet}) {
      align-items: flex-start;
      flex-direction: column;
    }
  `,
  noteType: css`
    margin-right: 13px;
  `,
  noteStatus: css`
    text-transform: uppercase;
  `,

  noteDate: css`
    font-size: 16px;
    font-weight: 400;
    color: ${colors.grey_300};
    margin-bottom: 10px;
  `,
  actions: css`
    position: absolute;
    right: ${withVerticalLayout ? 0 : '18px'};
    top: ${withVerticalLayout ? 0 : '22px'};

    @media (max-width: ${breakPoints.tablet}) {
      position: absolute;
      right: 8px;
      top: 12px;
    }
  `,
  actionButton: css`
    background: transparent;
    border: 0;
    color: ${colors.grey_200};
    outline: none;
  `,
  fileTypeIcon: css`
    margin-right: 5px;
    color: ${colors.grey_300};
    font-size: 16px;
  `,
  linkedIssuesList: css`
    list-style: none;
    padding: 0;
    margin: 0;
  `,
  filesList: css`
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
    }
  `,
  metadataDualColumns: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
  `,
  metadataTitle: css`
    margin-bottom: 8px;
    text-transform: capitalize;
  `,
  metadataTitleWrapper: css`
    display: flex;
    justify-content: space-between;
  `,
  authorDetails: css`
    font-size: 11px;
    color: ${colors.grey_200};
    margin-top: ${!withVerticalLayout && '16px'};
  `,
  metadataSection: css`
    margin-bottom: 16px;

    &:last-of-type {
      margin-bottom: 0px;
    }
  `,
  lockIcon: css`
    color: ${colors.grey_300};
    margin-right: 8px;
    font-size: 14px;
  `,
  attachmentLink: css`
    color: ${colors.grey_300};
    font-weight: 600;

    &:visited,
    &:hover,
    &:focus,
    &:active {
      color: ${colors.grey_300};
    }

    &:hover {
      text-decoration: underline;
    }
  `,
});

export default getStyles;
