// @flow

import { colors } from '@kitman/common/src/variables';

const displayNoneWhenPrinted = {
  '@media print': {
    display: 'none',
  },
};

const wrapperWidth = `max(calc(${window.innerWidth}px - 120px), 1080px)`;
const tableWidth = `max(calc(${wrapperWidth} - 30px), 950px)`;

const displayAndRotateWhenPrinted = {
  '@media print': {
    display: 'table-cell',
    transform: 'rotate(20deg)',
    backgroundColor: 'transparent',
  },
};

const minWidthWhenPrinted = {
  '@media print': {
    minWidth: wrapperWidth,
    maxWidth: wrapperWidth,
  },
};

const cellCommon = {
  border: `1px solid ${colors.s14}`,
  padding: '8px 12px',
  textAlign: 'center',
  minWidth: '100px',
};

const athleteCellCommon = {
  fontWeight: 'bold',
  textAlign: 'left',
  border: `1px solid ${colors.s14}`,
  padding: '8px 12px',
  whiteSpace: 'nowrap',
  position: 'sticky',
  left: '-5px', // ensure the athlete column sticks to the left
  backgroundColor: colors.p06,
  zIndex: '1',
};

export default {
  container: {
    display: 'block',
    justifyContent: 'center',
    alignItems: 'center',
    tableLayout: 'fixed',
    overflowY: 'auto',
    overflowX: 'visible !important',
    height: '100vh',
    width: '100%',
    borderCollapse: 'separate',
    ...minWidthWhenPrinted,
  },
  table: {
    width: '100%',

    '@media print': {
      tableLayout: 'fixed',
      borderCollapse: 'collapse',
      minWidth: tableWidth,
      maxWidth: tableWidth,

      '@page': {
        size: 'A3',
      },
    },
  },
  cell: cellCommon,
  rotatedCell: {
    ...cellCommon,
    ...displayNoneWhenPrinted,
  },
  printedRotatedCell: {
    ...cellCommon,
    display: 'none',
    ...displayAndRotateWhenPrinted,
    paddingTop: '1.5rem',
  },
  heading: {
    border: `1px solid ${colors.s14}`,
    padding: '5px',
    position: 'relative',
    textAlign: 'center',
    backgroundColor: colors.p06,
  },
  sticky: {
    position: 'sticky',
    zIndex: '2',
    top: '-10px',
  },
  athleteHeader: {
    fontWeight: 'bold',
    textAlign: 'left',
    border: `1px solid ${colors.s14}`,
    padding: '8px 12px',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: '-10px',
    left: '-5px',
    backgroundColor: colors.p06,
    minWidth: '100px',
    zIndex: '1',
  },
  icon: {
    position: 'absolute',
    padding: '5px',
    color: '#bec3c7',
    opacity: '0',
    top: '0',
    right: '0',

    '&:hover': {
      opacity: 1,
      cursor: 'pointer',
    },
  },
  arrowIcon: {
    color: colors.p01,
    fontWeight: '600',
  },
  tableIcon: {
    position: 'absolute',
    padding: '18px',
    fontSize: '18px',
    color: '#bec3c7',
    top: '0',
    right: '0',
    cursor: 'pointer',
  },
  athleteCell: {
    ...athleteCellCommon,
    ...displayNoneWhenPrinted,
  },
  printedAthleteCell: {
    ...athleteCellCommon,
    display: 'none',
    ...displayAndRotateWhenPrinted,
  },
  wrapper: {
    background: colors.p06,
    border: `1px solid ${colors.neutral_300}`,
    borderRadius: '8px',
    display: 'flex',
    padding: '16px',
    position: 'relative',
    flexDirection: 'column',
    gap: '5px',
    height: '80vh',
    ...minWidthWhenPrinted,
  },
  sorted: {
    color: colors.p01,
  },
  legendWrapper: {
    display: 'flex',
    flexDirection: 'row',
    padding: '5px',
    gap: '8px',
    margin: '0 5px',
    alignItems: 'center',
  },
  legend: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 5px',
  },
  legendText: {
    fontSize: '12px',
    margin: '0 5px',
  },
};
