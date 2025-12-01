// @flow
import type { Node } from 'react';

type Props = {
  children?: Node,
};

const Cell = (props: Props) => <td {...props}>{props.children}</td>;

export default Cell;
