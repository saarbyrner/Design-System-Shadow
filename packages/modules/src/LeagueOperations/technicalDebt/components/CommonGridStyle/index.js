// @flow
import { colors, breakPoints } from '@kitman/common/src/variables';

export const gridStyle = {
  wrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    background: colors.p06,
    border: `1px solid ${colors.neutral_300}`,
    borderRadius: '3px',
  },

  grid: {
    padding: '0',
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
        paddingRight: '24px',
      },
      'th:last-child, td:last-child': {
        paddingRight: '24px',
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
      maxWidth: '600px',
      padding: '8px',
      overflow: 'visible',
    },
  },
};

export const cellStyle = {
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  roundedImage: (size: number = 24) => ({
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'contain',
  }),
  avatarPlaceholder: (size: number = 24) => ({
    borderRadius: '50%',
    backgroundColor: colors.neutral_100,
    width: `${size}px`,
    height: `${size}px`,
    objectFit: 'contain',
  }),
  header: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 24px 32px 24px',
    gap: '8px',
  },
  title: {
    color: colors.grey_300,
    fontSize: '20px',
    fontWeight: 600,
  },
  avatarCell: {
    display: 'flex',
    gap: '12px',
  },
  imageContainer: {
    display: 'flex',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '12px',
    alignItems: 'center',
  },
  linkCell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCell: {
    color: colors.grey_200,
    fontWeight: 400,
    fontSize: '14px',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
  },
  hasClick: {
    cursor: 'pointer',
    color: colors.grey_300,
  },
  prominent: {
    fontWeight: '600 !important',
  },
  icon: {
    fontWeight: 600,
    fontSize: '17px',
    transform: 'scale(1, -1)',
  },
  iconCell: (color: string = colors.green_100) => ({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    '.textButton--kitmanDesignSystem .textButton__icon::before': {
      fontSize: '24px',
    },
    color,
  }),
  error: {
    color: `${colors.red_100} !important`,
    fontWeight: 600,
  },
};

export const statusStyle = {
  statusCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  chip: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    padding: '1px 16px',
    borderRadius: '30px',
    color: colors.grey_300,
    textTransform: 'capitalize',
  },
  incomplete: {
    background: colors.neutral_200,
  },
  rejected: {
    background: colors.red_100_20,
  },
  inactive: {
    background: colors.red_100_20,
  },
  rejected_organisation: {
    background: colors.red_100_20,
  },
  rejected_association: {
    background: colors.red_100_20,
  },
  pending: {
    background: colors.yellow_200,
  },
  pending_organisation: {
    background: colors.yellow_200,
  },
  pending_association: {
    background: colors.yellow_200,
  },
  pending_payment: {
    background: colors.yellow_200,
  },
  approved: {
    background: colors.green_100_20,
  },
  active: {
    background: colors.green_100_20,
  },
  tooltip: {
    padding: '3px',
  },
  tooltipTitle: {
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
};

export const invalidStyle = {
  cell: {
    display: 'flex',
    flexDirection: 'row',
    color: `${colors.red_100} !important`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    gap: '4px',
    cursor: 'pointer',
  },
  tooltip: {
    padding: '3px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  tooltipTitle: {
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
};

export const filtersStyle = {
  filter: {
    [`@media (min-width: ${breakPoints.desktop})`]: {
      minWidth: '180px',

      '.inputText': {
        width: '240px',
      },
    },
    [`@media (max-width: ${breakPoints.desktop})`]: {
      display: 'block',
      marginBottom: '10px',
      width: '100%',
    },
  },
  filtersPanel: {
    paddingLeft: '25px',
    paddingRight: '25px',
  },
  'filters--desktop': {
    gap: '5px',

    [`@media (max-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },
  },
  'filters--mobile': {
    gap: '5px',

    button: {
      marginBottom: '8px',
    },

    [`@media (min-width: ${breakPoints.desktop})`]: {
      display: 'none',
    },

    [`@media (max-width: ${breakPoints.tablet})`]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
};
