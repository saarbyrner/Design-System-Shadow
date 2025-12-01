// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { HeaderTranslated as Header } from './components/Header';
import Tabs from './containers/TabsContainer';

function App() {
  return (
    <div
      css={css`
        background: ${colors.background};
      `}
    >
      <Header />
      <div
        css={css`
          background-color: ${colors.white};
          padding-top: 34px;
          margin-bottom: 24px;
        `}
      >
        <Tabs />
      </div>
    </div>
  );
}

export default App;
