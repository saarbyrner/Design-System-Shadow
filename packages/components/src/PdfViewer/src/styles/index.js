// @flow
import { colors } from '@kitman/common/src/variables';

const styles = {
  pdfContainer: {
    display: 'flex',
    position: 'relative',
  },
  pagesContainer: {
    border: `2px solid ${colors.neutral_300}`,
  },
  pages: {
    overflowX: 'scroll',
    scrollBehavior: 'smooth',
  },
  page: {
    padding: '5px',
  },
  thumbnailsContainer: {
    background: colors.neutral_300,
  },
  thumbnails: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: '5px',
    overflowX: 'scroll',
  },
  thumbnail: {
    padding: '5px',
  },
  thumbnailPage: {
    border: `1px solid ${colors.neutral_400}`,
  },
  thumbnailActive: {
    backgroundColor: colors.neutral_400,
  },
};

export default styles;
