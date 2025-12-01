// @flow
import App from './src/components/App';
import type { AppHeaderProps } from './types';

const AppHeader = (props: AppHeaderProps) => {
  return <App {...props} />;
};

export default AppHeader;
