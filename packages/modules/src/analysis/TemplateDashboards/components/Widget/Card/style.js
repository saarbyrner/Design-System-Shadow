// @flow
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';

export default {
  cardRoot: css`
    background: ${colors.p06};
    border: 1px solid ${colors.neutral_300};
    border-radius: 8px;
    display: flex;
    padding: 16px;
    position: relative;
    flex-direction: column;
    gap: 5px;

    height: 100%;

    @media (max-width: ${breakPoints.tablet}) {
      display: block;
    }
  `,
  cardHeader: css`
    display: flex;
    align-items: center;
    align-content: flex-start;
    gap: 5px;
    align-self: stretch;
    flex-wrap: wrap;
  `,
  title: css`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    flex: 1 0 0;
  `,
  cardContent: css`
    flex: 1;
  `,
  actions: css`
    display: flex;
    gap: 5px;
  `,
  loading: css`
    background-image: url('../../img/spinner.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 60px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    opacity: 0.4;
  `,
};
