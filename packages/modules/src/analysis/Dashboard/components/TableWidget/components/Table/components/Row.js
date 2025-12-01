// @flow
import type { Node } from 'react';

type Props = {
  children?: Node,
};

const Row = (props: Props) => <tr {...props}>{props.children}</tr>;

export default Row;
