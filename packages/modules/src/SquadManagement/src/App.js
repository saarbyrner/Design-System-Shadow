// @flow
import { css } from '@emotion/react';
import { breakPoints, colors } from '@kitman/common/src/variables';
import { withNamespaces } from 'react-i18next';

import { ManageSquadsGridTranslated as ManageSquadsGrid } from './components/ManageSquadsGrid';

const style = {
  squadManagement: css`
    background-color: ${colors.neutral_100};
    height: calc(100vh - 50px);
    padding: 24px;

    @media only screen and (max-width: ${breakPoints.desktop}) {
      height: calc(100vh - 60px);
    }
  `,
};

const App = () => {
  return (
    <div className="squadManagement" css={style.squadManagement}>
      <ManageSquadsGrid />
    </div>
  );
};

export const AppTranslated = withNamespaces()(App);
export default App;
