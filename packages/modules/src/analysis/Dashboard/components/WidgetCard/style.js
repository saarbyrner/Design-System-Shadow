// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const iconColorStyle = `
i {
	color: ${colors.grey_200};
}`;

export default {
  card: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 8px;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
  cardHeader: css`
    background-color: ${colors.p06};
    align-items: center;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    height: 50px;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 10px;

    ${window.getFlag('rep-dashboard-ui-upgrade') ? iconColorStyle : ''}
  `,
  title: css`
    width: 100%;
    h6,
    h3 {
      color: ${colors.black_100};
      font-family: Open Sans;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 18px;
      overflow: hidden;
      width: 100%;

      span {
        display: inline-block;
        max-width: calc(100% - 10px);
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: -2px;
        white-space: nowrap;
      }
    }
  `,
  content: css`
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
};
