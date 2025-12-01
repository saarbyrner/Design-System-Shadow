// @flow
import type { Node } from 'react';
import type { SerializedStyles } from '@emotion/react';
import styles from './style';

type Props = {
  children: Node,
  styles?: SerializedStyles,
};

function DashboardLayout(props: Props) {
  return <div css={[styles.root, props.styles]}>{props.children}</div>;
}

const Header = (props: Props) => {
  return <div css={[styles.header, props.styles]}>{props.children}</div>;
};

const Content = (props: Props) => {
  return <div css={[styles.content, props.styles]}>{props.children}</div>;
};

type LoadingProps = {
  isLoading: boolean,
};
const Loading = ({ isLoading }: LoadingProps) => {
  return isLoading ? <div css={styles.loading} /> : null;
};

DashboardLayout.Header = Header;
DashboardLayout.Content = Content;
DashboardLayout.Loading = Loading;

export default DashboardLayout;
