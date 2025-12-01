import { render, screen, within } from '@testing-library/react';
import DataGrid from 'react-data-grid';
import {
  data,
  reactDataGridColumns,
} from '@kitman/modules/src/Medical/issues/src/components/AssessmentTab/ResultsTableDummyData';

/**
 * A robust formatter for cells whose data is an object (e.g., { date, value }).
 * It uses the `column` prop passed by react-data-grid to dynamically access
 * the correct data from the `row` object, and renders the `value` property.
 */
const ObjectFormatter = ({ row, column }) => {
  const cellData = row[column.key];
  if (
    typeof cellData === 'object' &&
    cellData !== null &&
    'value' in cellData
  ) {
    return <>{cellData.value}</>;
  }
  return <>{cellData}</>;
};

const formattedColumns = reactDataGridColumns.map((column) => {
  const firstRowData = data.length > 0 ? data[0][column.key] : undefined;
  if (
    typeof firstRowData === 'object' &&
    firstRowData !== null &&
    'value' in firstRowData
  ) {
    return { ...column, formatter: ObjectFormatter };
  }
  return column;
});

describe('<DataGrid />', () => {
  const props = {
    columns: formattedColumns,
    rows: data,
  };

  test('should render key data grid headers', () => {
    render(<DataGrid {...props} />);
    const expectedHeaders = ['Section', 'Baseline', 'Apr 01'];

    expectedHeaders.forEach((headerName) => {
      expect(
        screen.getByRole('columnheader', { name: headerName })
      ).toBeInTheDocument();
    });
  });

  test('should render data rows with correct content', () => {
    render(<DataGrid {...props} />);

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1);

    const firstDataRow = rows[1]; // rows[0] is the header row

    expect(
      within(firstDataRow).getByRole('gridcell', {
        name: 'Total number of symptoms:',
      })
    ).toBeInTheDocument();
    expect(
      within(firstDataRow).getByRole('gridcell', { name: '3/22' })
    ).toBeInTheDocument();
    expect(
      within(firstDataRow).getAllByRole('gridcell', { name: '10' })[0]
    ).toBeInTheDocument();
  });
});
