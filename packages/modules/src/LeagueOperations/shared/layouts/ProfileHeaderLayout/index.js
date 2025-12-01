// @flow
import type { Node } from 'react';

import { colors } from '@kitman/common/src/variables';

import { css } from '@emotion/react';

const styles = {
  profileHeader: css`
    position: relative;
    background-color: ${colors.white};
    padding: 18px;
  `,
  column: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  row: css`
    display: flex;
    flex-direction: row;
    gap: 8px;
  `,
  left: css`
    display: flex;
    gap: 8px;
    flex: 1;
  `,
  right: css`
    display: flex;
    gap: 8px;
    align-items: end;
  `,
  actions: css`
    display: flex;
    flex-direction: row;
    gap: 6px;
  `,
  main: css`
    display: flex;
    flex-direction: row;
    gap: 16px;
  `,
  avatar: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  content: css`
    display: flex;
    align-items: start;
    justify-content: center;
    flex-direction: column;
    flex: 1;
  `,
};

type Props = {
  children: Node,
};

const ProfileHeaderLayout = (props: Props): Node => {
  return <div css={styles.profileHeader}>{props.children}</div>;
};

const Left = (props: Props): Node => {
  return <div css={[styles.column, styles.left]}>{props.children}</div>;
};

const Right = (props: Props): Node => {
  return <div css={[styles.row, styles.right]}>{props.children}</div>;
};

const Actions = (props: Props): Node => {
  return <div css={styles.actions}>{props.children}</div>;
};

const Main = (props: Props): Node => {
  return <div css={styles.main}>{props.children}</div>;
};

const Avatar = (props: Props): Node => {
  return <div css={styles.avatar}>{props.children}</div>;
};

const Content = (props: Props): Node => {
  return <div css={styles.content}>{props.children}</div>;
};

ProfileHeaderLayout.Actions = Actions;
ProfileHeaderLayout.Main = Main;
ProfileHeaderLayout.Avatar = Avatar;
ProfileHeaderLayout.Content = Content;
ProfileHeaderLayout.Left = Left;
ProfileHeaderLayout.Right = Right;

export default ProfileHeaderLayout;
