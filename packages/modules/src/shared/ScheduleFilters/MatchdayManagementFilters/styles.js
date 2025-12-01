// @flow
import { breakPoints } from '@kitman/common/src/variables';

const styles = {
  searchBarContainer: {
    width: '240px',
    position: 'relative',

    input: {
      height: '37px',
      padding: '8px 35px 8px 11px',
    },

    '& .icon-search': {
      margin: 0,
      top: '5px',
    },
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '24px',
    width: '100%',

    [`@media (min-width: ${breakPoints.desktop})`]: {
      flexDirection: 'row',

      '.inputText': {
        width: '240px',
      },
    },
  },
  filter: {
    marginBottom: '5px',
    minWidth: '160px',

    '.kitmanReactSelect__menu': {
      maxWidth: 'fit-content',
    },

    [`@media (min-width: ${breakPoints.desktop})`]: {
      marginRight: '10px',
      marginBottom: '0px',
    },
  },
};

export default styles;
