// @flow
import { css } from '@emotion/react';
import { breakPoints } from '@kitman/common/src/variables';

const styles = {
  gameEventsHeaderContainer: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    padding: 0px 24px;

    .hiddenButton {
      visibility: hidden;
    }

    @media (min-width: ${breakPoints.tablet}) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  `,
  buttonContainer: css`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 150px;
      height: 35px;
      border-radius: 0px;
    }

    @media (min-width: ${breakPoints.tablet}) {
      margin-bottom: 0px;
    }
  `,
};

export default styles;
