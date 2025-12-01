// @flow

import type { Node } from 'react';
import { ThemeProvider as Provider } from '@mui/material';
import { rootTheme } from '@kitman/playbook/themes';
import type { Theme } from '@mui/material';

type ProviderProps = {
  theme?: Theme,
  children: Node,
};

const ThemeProvider = (props: ProviderProps) => {
  const { theme, children } = props;
  const providerTheme = theme || rootTheme;

  return <Provider theme={providerTheme}>{children}</Provider>;
};

export default ThemeProvider;
