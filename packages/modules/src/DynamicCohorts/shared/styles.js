// @flow
import { colors } from '@kitman/common/src/variables';
import type { ObjectStyle } from '@kitman/common/src/types/styles';

export default ({
  container: {
    margin: '10px 25px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  labelText: {
    color: colors.grey_100,
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '4px',
    width: '100%',
  },
  sharedFilters: {
    marginBottom: '1.75rem',
    maxWidth: '47rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1rem',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
  },
  labelFilterLength: {
    width: '240px',
  },
  grid: {
    padding: 0,
    tbody: {
      tr: {
        td: {
          padding: '8px',
        },
      },
    },
    tr: {
      'td:first-of-type': {
        paddingLeft: '24px',
      },
      'th:last-child, td:last-child': {
        paddingRight: '24px',
      },
    },
    '.dataGrid__loading': {
      margin: '30px',
    },
    '.dataGrid__body': {
      '.athlete__row': {
        verticalAlign: 'top',
      },
    },
    '.dataGrid__cell': {
      width: '300px',
      maxWidth: '600px',
      padding: '8px',
      overflow: 'visible',
    },
  },
  modal: {
    minHeight: '21rem!important',
    footer: {
      justifyContent: 'space-between',

      div: {
        display: 'flex',
        alignItems: 'center',
        '&:first-of-type': {
          gap: '0.5rem',
        },
      },
    },
  },
  modalCenteredContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalTabList: {
    [`.MuiTabs-scroller,
      .MuiTabs-flexContainer,
      .MuiButtonBase-root.MuiTab-root`]: {
      padding: '0!important',
      maxHeight: '2rem',
      minHeight: '2rem',
      height: '2rem',
    },
  },
}: ObjectStyle);
