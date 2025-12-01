import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import {
  columnsData,
  rowsData,
} from '@kitman/modules/src/analysis/BenchmarkReport/benchmark-report-data.mock';

import { DataGridTableTranslated as DataGridTable } from '../DataGridTable';

describe('BenchmarkReport|Table|DataGridTable', () => {
  it('renders the DataGridTable component', async () => {
    render(<DataGridTable columnsData={columnsData} rowsData={rowsData} />);

    columnsData.forEach((column) => {
      expect(screen.getByLabelText(column.headerName)).toBeInTheDocument();
    });

    const exportToCsvButton = screen.getByRole('button', { name: 'Export' });
    expect(exportToCsvButton).toBeVisible();

    await userEvent.click(exportToCsvButton);
    await waitFor(() => {
      expect(screen.getByText('Download as CSV')).toBeInTheDocument();
    });
  });

  it('applies the correct background classes to rows', () => {
    const { container } = render(
      <DataGridTable columnsData={columnsData} rowsData={rowsData} />
    );

    const resultsNationalRows = container.getElementsByClassName(
      'MuiDataGrid-row--national'
    );
    expect(resultsNationalRows.length).toBe(4);

    const resultsMyClubRows = container.getElementsByClassName(
      'MuiDataGrid-row--my-club'
    );
    expect(resultsMyClubRows.length).toBe(4);

    const resultsIndividualAthleteRows = container.getElementsByClassName(
      'MuiDataGrid-row--individual-athlete'
    );
    expect(resultsIndividualAthleteRows.length).toBe(3);

    expect(
      screen.getAllByText('National')[0].closest('.MuiDataGrid-row')
    ).toHaveClass('MuiDataGrid-row--national');

    expect(
      screen.getAllByText('My club')[0].closest('.MuiDataGrid-row')
    ).toHaveClass('MuiDataGrid-row--my-club');

    expect(
      screen.getAllByText('Individual athlete')[0].closest('.MuiDataGrid-row')
    ).toHaveClass('MuiDataGrid-row--individual-athlete');
  });
});
