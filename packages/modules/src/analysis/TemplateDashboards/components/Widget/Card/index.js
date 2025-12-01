// @flow
import type { Node } from 'react';
import type { SerializedStyles } from '@emotion/react';
import styles from './style';

type Props = {
  children: Node,
  styles?: SerializedStyles,
};

function Card(props: Props) {
  return <div css={[styles.cardRoot, props.styles]}>{props.children}</div>;
}

const Header = (props: Props) => {
  return <div css={[styles.cardHeader, props.styles]}>{props.children}</div>;
};

const Actions = (props: Props) => {
  return <div css={[styles.actions, props.styles]}>{props.children}</div>;
};

const Title = (props: Props) => {
  return <div css={[styles.title, props.styles]}>{props.children}</div>;
};

const Content = (props: Props) => {
  return <div css={[styles.cardContent, props.styles]}>{props.children}</div>;
};

type LoadingProps = {
  isLoading: boolean,
};
const Loading = ({ isLoading }: LoadingProps) => {
  return isLoading ? (
    <div data-testid="TemplateDashboards|Card.Loading" css={styles.loading} />
  ) : null;
};

Card.Header = Header;
Card.Actions = Actions;
Card.Title = Title;
Card.Content = Content;
Card.Loading = Loading;

export default Card;
