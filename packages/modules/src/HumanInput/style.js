// @flow

export const gridStyle = {
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
      'padding-left': '24px',
      'padding-right': '24px',
    },
    'th:last-child, td:last-child': {
      'padding-right': '24px',
    },
  },
  '.dataGrid__loading': {
    margin: '30px',
  },
  '.dataGrid__body': {
    '.dataGrid__row': {
      height: '56px',
    },
  },
  '.dataGrid__cell': {
    width: '300px',
    'max-width': '600px',
    padding: '8px',
    overflow: 'visible',
  },
};

export default gridStyle;
