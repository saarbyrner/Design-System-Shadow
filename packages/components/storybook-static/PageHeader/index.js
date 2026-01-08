// @flow
import type { Node } from 'react';
import classNames from 'classnames';

type Props = {
  noMargin?: boolean,
  children?: Node,
};

const PageHeader = (props: Props) => (
  <div
    role="heading"
    aria-level="1"
    className={classNames('pageHeader', {
      'pageHeader--noMargin': props.noMargin,
    })}
  >
    {props.children}
  </div>
);

export default PageHeader;
