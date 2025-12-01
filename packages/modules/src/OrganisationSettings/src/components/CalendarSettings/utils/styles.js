// @flow
import { colors } from '@kitman/common/src/variables';

const removeNewEventButtonMeasurements = '2rem';
export const parentAndEmptyRowBackgroundColor = colors.neutral_100;

type CreateTableStyles = {
  includeCheckboxes: boolean,
  canArchiveCustomEvents?: boolean,
  cellWidthRem?: number,
};

export const createTableStyles = ({
  includeCheckboxes,
  cellWidthRem,
  canArchiveCustomEvents = true,
}: CreateTableStyles) => ({
  thead: {
    tr: {
      '.dataGrid__cell': {
        lineHeight: '1.1rem',
        paddingBottom: '0.313rem',
        paddingLeft: '0.625rem',
      },
    },
  },
  '.eventTypeParent': {
    borderTop: `2px solid ${colors.neutral_300}`,
    '> td': {
      backgroundColor: parentAndEmptyRowBackgroundColor,
      fontWeight: 600,
    },
  },
  '.emptyRow > td': {
    backgroundColor: parentAndEmptyRowBackgroundColor,
    fontWeight: 600,
  },
  'tr > td': {
    padding: '0.75rem',
    ...(cellWidthRem && { width: `${cellWidthRem}rem` }),
  },
  ...(cellWidthRem && {
    '.dataGrid__rowActionsCell': {
      width: '1rem',
    },
  }),
  '.dataGrid__cell:first-of-type': {
    minWidth: '1.5rem',
    ...((includeCheckboxes || !canArchiveCustomEvents) && {
      width: '1.5rem',
    }),
    padding: '0.12rem',
    '> div': {
      marginLeft: '1.5rem',
      ...(!canArchiveCustomEvents && {
        display: 'none',
      }),
    },
    '::after': {
      width: '0',
    },
  },
  '.tooltipMenu__item': {
    minWidth: 0,
    span: {
      paddingRight: 0,
    },
  },
});

type CreateHeaderStyles = {
  marginBottomRem: number,
};
export const createHeaderStyles = ({
  marginBottomRem,
}: CreateHeaderStyles) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: `${marginBottomRem}rem`,
});

export default {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  pageContainer: {
    backgroundColor: colors.p06,
    padding: '1rem 1.5rem',
    margin: '5px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  eventTypesWrapper: {
    flexGrow: 1,
  },

  headerButtons: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: '0.25rem',
  },

  editTableContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    button: {
      height: removeNewEventButtonMeasurements,
      width: removeNewEventButtonMeasurements,
      minWidth: removeNewEventButtonMeasurements,
    },
  },
  tableContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.375rem',
  },
  skeletonContainer: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '0.5rem',
  },
};
