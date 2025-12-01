// @flow
import type { Node } from 'react';
import { Provider } from 'react-redux';
import store from './store';

type Props = {
  children?: Node,
};

export default ({ children }: Props) => (
  <Provider store={store}>{children}</Provider>
);
