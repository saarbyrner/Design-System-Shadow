// @flow
import { css } from '@emotion/react';
import { colors } from '@kitman/common/src/variables';
import { StockListContainerTranslated as StockListContainer } from './containers/StockListContainer';

const style = {
  container: css`
    background: ${colors.background};
  `,
};

const App = () => {
  return (
    <div css={style.container}>
      <StockListContainer />
    </div>
  );
};

export default App;
