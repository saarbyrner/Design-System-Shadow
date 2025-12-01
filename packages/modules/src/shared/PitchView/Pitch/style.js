// @flow

import { css } from '@emotion/react';

const styles = {
  pitchWrapper: css`
    position: relative;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: auto;
    width: 100%;
    background: url('/img/pitch-view/pitch.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  `,
  inFieldPositionsWrapper: css`
    display: flex;
    flex-direction: row;
    align-items: center;
  `,
};

export default styles;
