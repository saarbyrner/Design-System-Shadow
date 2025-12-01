// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const style = {
  textLabel: css`
    width: 59px;
    height: 16px;
    font-family: 'Open Sans';
    font-style: normal;
    line-height: 16px;
    flex: none;
    order: 0;
    flex-grow: 0;
    color: ${colors.grey_100};
    font-size: 12px;
    font-weight: 600;
    margin-right: 24px;
    margin-bottom: 0px;
  `,
  textValue: css`
    width: 37px;
    height: 20px;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: ${colors.grey_200};
    flex: none;
    order: 0;
    flex-grow: 0;
  `,
};

export default style;
