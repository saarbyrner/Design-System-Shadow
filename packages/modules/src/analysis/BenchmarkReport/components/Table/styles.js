// @flow
import { colors } from '@kitman/common/src/variables';

const dataGridLegendStyles = {
  legendContainer: {
    padding: '24px 0',
  },
  legend: {
    listStyle: 'none',
    marginBottom: '0',
    padding: '0',
  },
  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: '21px',
  },
  legendItemText: {
    marginLeft: '4px',
    fontSize: '14px',
    color: colors.grey_100,
  },
};

const dataGridTableContainerStyles = {
  tableRoot: {
    backgroundColor: 'white',
  },
  tableHeader: {
    padding: '13px 20px 12px',
    color: colors.grey_100,
    backgroundColor: colors.s13,
    borderRadius: '5px 5px 0 0',
  },
  tableHeaderTitle: {
    marginBottom: '0',
    fontSize: '14px',
    lineHeight: '18px',
    fontWeight: '600',
  },
  tableContainer: {
    padding: '0 20px 24px',
  },
};

const dataGridTableRowStyles = {
  '& .MuiDataGrid-row--national': {
    backgroundColor: colors.white,
  },
  '& .MuiDataGrid-row--my-club': {
    backgroundColor: colors.purple_200,
  },
  '& .MuiDataGrid-row--individual-athlete': {
    backgroundColor: colors.yellow_200,
  },
};

export {
  dataGridLegendStyles,
  dataGridTableContainerStyles,
  dataGridTableRowStyles,
};
