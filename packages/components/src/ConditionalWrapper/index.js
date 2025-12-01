// @flow
import type { Node } from 'react';

type Props = {
  condition: boolean,
  wrapper: (Node) => Node,
  children: Node,
};

const ConditionalWrapper = ({ condition, wrapper, children }: Props) =>
  condition ? wrapper(children) : children;

export default ConditionalWrapper;
