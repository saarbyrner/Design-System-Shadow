// @flow
import { keyframes } from '@emotion/react';

const animations = {
  inLeftMoveX: keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  `,
  inRightMoveX: keyframes`
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  `,
  toastIn: keyframes`
    0% { transform: translateX(420px); }
    100% { transform: translateX(0); }
  `,
};

export const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

export const loaderDash = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

export default animations;
