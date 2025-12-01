// @flow
import { css } from '@emotion/react';

const style = {
  wrapper: css({
    padding: '1.5rem',
  }),
  headerWrapper: css({
    display: 'grid',
    gridTemplateColumns: '1fr min-content',
    h3: {
      fontSize: '1.25rem',
    },
  }),
  bodyWrapper: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  richTextDisplay: css({
    paddingBottom: '1.5rem',
  }),
  collectionSidePanel: css({
    '.slidingPanel': {
      overflow: 'hidden',
    },
  }),
};

export default style;
