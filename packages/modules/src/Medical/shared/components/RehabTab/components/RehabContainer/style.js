// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

export default {
  AllDroppableContainers: css`
    height: 100%;
    min-height: 240px;
    padding-bottom: 60px;
  `,

  headerActionButton: css`
    margin-top: 3px;
    > .iconButton {
      min-width: 32px;
      padding: 0px 2px;
    }
  `,

  selectAll: css`
    margin-top: 12px;
    margin-right: 2px;
  `,

  editNoteButtons: css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin: 4px;
  `,

  noteDisplay: css`
    display: grid;
    grid-template-columns: 1fr 50px;
    padding: 6px 4px 6px 4px;
    border-bottom: 1px solid ${colors.neutral_300};
    font-size: 14px;
    line-height: 18px;
    color: ${colors.grey_200};

    .iconButton {
      display: none;
      background: ${colors.neutral_200};
      color: ${colors.grey_200};
      height: 24px;
      width: 24px;
      padding: 0px;
      &:focus {
        filter: drop-shadow(0px 0px 5px ${colors.grey_100});
      }
    }
    &:hover {
      .iconButton {
        display: block;
      }
    }
  `,

  noteWrapper: css`
    .richTextDisplay--abbreviated {
      max-height: initial;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;

      &:after {
        background-image: none;
      }
    }
  `,

  dayDisplay: css`
    margin: 0px;
    background: ${colors.white};
    flex: 1;
  `,

  hoverColumn: css`
    background: ${colors.neutral_300};
  `,

  dayInformationHeader: css`
    border-bottom: 1px solid ${colors.neutral_300};
    min-height: 40px;
    height: fit-content;
    position: sticky;
    top: -1px;
    z-index: 1;
    background: ${colors.p06};
  `,

  dayActionButtons: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    clear: none;
    position: absolute;
    right: 0;
  `,

  dayInformation: css`
    flex: 1;
    padding: 4px 6px 4px 6px;
    display: flex;
    flex-direction: column;
  `,

  dayHeader: css`
    font-weight: 600;
    color: ${colors.grey_200};
    margin: 0px;
    font-size: 12px;
    padding: 3px;
    margin-left: -3px;
    width: fit-content;
  `,

  dayHeaderToday: css`
    font-weight: 600;
    color: ${colors.p06};
    margin: 0px;
    font-size: 12px;
    border-radius: 3px;
    background: ${colors.blue_100};
    padding: 2px 3px;
    margin-left: -3px;
    width: fit-content;
  `,

  dayOfInjury: css`
    font-weight: 400;
    color: ${colors.grey_100};
    margin: 0px;
    font-size: 11px;
    line-height: 14px;
  `,

  transferMessage: css`
    font-weight: 600;
    color: ${colors.grey_100};
    padding: 6px;
    text-align: center;
  `,
};
