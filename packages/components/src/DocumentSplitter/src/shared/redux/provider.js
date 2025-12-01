// @flow
import { Provider } from 'react-redux';

import store from '@kitman/components/src/DocumentSplitter/src/shared/redux/store';

// Types
import type { Node } from 'react';

type Props = {
  children?: Node,
};

export default ({ children }: Props) => (
  <Provider store={store}>{children}</Provider>
);
