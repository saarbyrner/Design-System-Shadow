// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';

const styles = {
  wrapper: css`
    border-radius: 3px;
    width: 100%;
    position: relative;
    transition: background-color 0.1s ease-in-out;
    cursor: default;

    &:hover {
      background-color: ${colors.green_100_20};
      button {
        display: block;
      }
    }
    &:active {
      background-color: transparent;
    }
    @media (min-width: 500px) {
      width: 50%;
    }
    @media (min-width: 650px) {
      width: 33.33%;
    }
    @media (min-width: 800px) {
      width: 25%;
    }
    @media (min-width: 1050px) {
      width: 20%;
    }
    @media (min-width: 1350px) {
      width: 33.33%;
    }
    @media (min-width: 1700px) {
      width: 25%;
    }
    @media (min-width: 2000px) {
      width: 20%;
    }
  `,
  dragging: css`
    z-index: 1;
    &:active {
      button {
        display: none;
      }
    }
  `,
  avatar: css`
    border: 1px solid transparent;
    margin-right: 8px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
  `,
  playerInfo: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: auto;
  `,
  playerName: css`
    color: ${colors.grey_200};
    margin: 0px;
  `,
  playerPosition: css`
    color: ${colors.grey_100};
    margin: 0px;
  `,
  deleteButton: css`
    position: absolute;
    z-index: 1;
    top: 33%;
    right: 5px;
    background-color: transparent;
    border: none;
    color: ${colors.grey_100};
    display: none;
    margin-left: auto;
    cursor: pointer;
    font-size: 24px;
  `,
};

export default styles;
