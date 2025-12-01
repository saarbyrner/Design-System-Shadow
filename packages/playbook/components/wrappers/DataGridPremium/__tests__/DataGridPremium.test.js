import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import i18n from 'i18next';
import { setI18n } from 'react-i18next';

import DataGridPremium from '@kitman/playbook/components/wrappers/DataGridPremium';

import { DEFAULT_INITIAL_PAGE_SIZE } from '../constants';

setI18n(i18n);

const sampleColumns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'string' },
  { field: 'name', headerName: 'Name', width: 150, type: 'string' },
  { field: 'age', headerName: 'Age', width: 100, type: 'number' },
];
const sampleRows = [
  { id: 'r1', name: 'Zoe', age: 28 },
  { id: 'r2', name: 'Alice', age: 35 },
  { id: 'r3', name: 'Bob', age: 22 },
  { id: 'r4', name: 'Charlie', age: 40 },
  { id: 'r5', name: 'Diana', age: 30 },
  { id: 'r6', name: 'Eve', age: 25 },
];

describe('DataGridPremiumWrapper', () => {
  let mockBulkActionOnAction;

  beforeEach(() => {
    mockBulkActionOnAction = jest.fn();
  });

  const getSampleBulkActions = () => [
    { key: 'delete', label: 'Delete', onAction: mockBulkActionOnAction },
    { key: 'archive', label: 'Archive', onAction: mockBulkActionOnAction },
  ];

  it('renders correctly with minimal required props', () => {
    render(<DataGridPremium rows={sampleRows} columns={sampleColumns} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();

    // Column headers
    sampleColumns.forEach((col) => {
      expect(
        screen.getByRole('columnheader', { name: col.headerName })
      ).toBeInTheDocument();
    });

    // Check for some row data
    expect(screen.getByRole('gridcell', { name: 'Zoe' })).toBeInTheDocument();
  });

  it('displays correct initial page size based on default', () => {
    render(<DataGridPremium rows={sampleRows} columns={sampleColumns} />);

    const rowsDisplayed = screen.getAllByRole('row').length - 1; // -1 for header row
    const expectedRows = Math.min(sampleRows.length, DEFAULT_INITIAL_PAGE_SIZE);

    expect(rowsDisplayed).toBe(expectedRows);
  });

  it('displays correct initial page size when prop is provided', () => {
    const customInitialPageSize = 2;

    render(
      <DataGridPremium
        rows={sampleRows}
        columns={sampleColumns}
        pageSize={customInitialPageSize}
      />
    );

    const rowsDisplayed = screen.getAllByRole('row').length - 1; // -1 for header row

    expect(rowsDisplayed).toBe(
      Math.min(sampleRows.length, customInitialPageSize)
    );
  });

  describe('Loading States', () => {
    it('shows skeleton loading overlay by default when loading is true', () => {
      render(
        <DataGridPremium loading rows={sampleRows} columns={sampleColumns} />
      );

      // MUI DataGridPremium renders a specific overlay.
      expect(screen.getByRole('grid')).toHaveClass(
        'MuiDataGrid-main--hasSkeletonLoadingOverlay'
      );
    });

    it('shows spinner loading overlay when loadingVariant is spinner', () => {
      render(
        <DataGridPremium
          loading
          rows={[]}
          columns={sampleColumns}
          loadingVariant="spinner"
        />
      );

      // MUI typically uses a role="progressbar" for its CircularProgress (spinner)
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows linear progress loading overlay when loadingVariant is linear-progress', () => {
      render(
        <DataGridPremium
          loading
          rows={[]}
          columns={sampleColumns}
          loadingVariant="linear-progress"
        />
      );

      // Linear progress also uses role="progressbar"
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows no visual loading overlay when loadingVariant is "none" and loading is true', () => {
      render(
        <DataGridPremium
          loading
          rows={[]}
          columns={sampleColumns}
          loadingVariant="none"
        />
      );

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('shows "No rows" overlay when not loading and rows are empty', () => {
      render(
        <DataGridPremium rows={[]} columns={sampleColumns} loading={false} />
      );

      expect(screen.getByText('No rows')).toBeInTheDocument();
    });
  });

  describe('Toolbar Logic', () => {
    it('renders ConfigurableGridToolbar by default when no bulk actions are active', () => {
      render(<DataGridPremium rows={sampleRows} columns={sampleColumns} />);

      expect(
        screen.getByRole('button', { name: /columns/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /filters/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /density/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /export/i })
      ).toBeInTheDocument();
    });

    it('hides specific toolbar buttons if props are false', () => {
      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          showFilterButton={false}
          showDensitySelectorButton={false}
        />
      );
      expect(
        screen.getByRole('button', { name: /columns/i })
      ).toBeInTheDocument(); // Still shown
      expect(
        screen.queryByRole('button', { name: /filters/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /density/i })
      ).not.toBeInTheDocument();
    });

    it('renders no toolbar if all standard buttons are hidden and no bulk actions defined', () => {
      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          showColumnSelectorButton={false}
          showFilterButton={false}
          showDensitySelectorButton={false}
          showExportButton={false}
          showQuickFilter={false}
          bulkActions={undefined} // Explicitly no bulk actions
        />
      );

      // Check that common toolbar buttons are not present
      expect(
        screen.queryByRole('button', { name: /columns/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /filters/i })
      ).not.toBeInTheDocument();

      const toolbarContainer = screen
        .getByRole('grid')
        .querySelector('.MuiDataGrid-toolbarContainer');
      expect(toolbarContainer).not.toBeInTheDocument();
    });

    it('switches to BulkActionsToolbar when rows are selected and bulkActions are provided', async () => {
      const user = userEvent.setup();

      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          bulkActions={getSampleBulkActions()}
        />
      );

      // ConfigurableGridToolbar should be visible initially
      expect(
        screen.getByRole('button', { name: /columns/i })
      ).toBeInTheDocument();

      // We'll target the first row's checkbox.
      const rowCheckboxes = await screen.findAllByRole('checkbox');

      // First checkbox is often "select all", second is for the first data row.
      await user.click(rowCheckboxes[1]);

      // BulkActionsToolbar should now be visible
      // Check for elements specific to BulkActionsToolbar
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Delete' })
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Archive' })
        ).toBeInTheDocument();
      });

      // ConfigurableGridToolbar elements should be gone
      expect(
        screen.queryByRole('button', { name: /columns/i })
      ).not.toBeInTheDocument();
    });

    it('calls onAction when a bulk action button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          bulkActions={getSampleBulkActions()}
        />
      );

      const rowCheckboxes = await screen.findAllByRole('checkbox');

      await user.click(rowCheckboxes[1]);
      await user.click(rowCheckboxes[2]);

      const deleteButton = await screen.findByRole('button', {
        name: 'Delete',
      });

      await user.click(deleteButton);

      expect(mockBulkActionOnAction).toHaveBeenCalledTimes(1);

      // The first argument to onAction should be the array of selected IDs.
      expect(mockBulkActionOnAction).toHaveBeenCalledWith(['r1', 'r2']);
    });

    it('shows export button with default options', () => {
      render(
        <DataGridPremium
          showExportButton
          rows={sampleRows}
          columns={sampleColumns}
          // excelExportOptions not provided, should use MUI defaults
        />
      );

      const exportButton = screen.getByRole('button', { name: /export/i });

      expect(exportButton).toBeInTheDocument();
    });

    it('passes excelExportOptions to the toolbar', () => {
      const customExportOptions = {
        fileName: 'custom_export.xlsx',
        includeHeaders: false,
      };

      // We mainly test that providing the prop doesn't break rendering.
      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          showExportButton
          excelExportOptions={customExportOptions}
        />
      );
      const exportButton = screen.getByRole('button', { name: /export/i });

      expect(exportButton).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('checkboxes are visible and allow selection when checkboxSelection is true', async () => {
      const user = userEvent.setup();
      const mockOnRowSelectionModelChange = jest.fn();

      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          checkboxSelection
          onRowSelectionModelChange={mockOnRowSelectionModelChange}
        />
      );

      const rowCheckboxes = await screen.findAllByRole('checkbox');

      expect(rowCheckboxes.length).toEqual(sampleRows.length + 1); // includes header checkbox

      await user.click(rowCheckboxes[1]); // Click checkbox for the first data row

      expect(mockOnRowSelectionModelChange).toHaveBeenCalledTimes(1);
      expect(mockOnRowSelectionModelChange).toHaveBeenCalledWith([
        sampleRows[0].id,
      ]);

      await user.click(rowCheckboxes[2]); // Click checkbox for the second data row

      expect(mockOnRowSelectionModelChange).toHaveBeenCalledTimes(2);
      expect(mockOnRowSelectionModelChange).toHaveBeenCalledWith([
        sampleRows[0].id,
        sampleRows[1].id,
      ]);
    });

    it('checkboxes are visible by default when bulkActions are provided', async () => {
      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          bulkActions={getSampleBulkActions()}
        />
      );

      const rowCheckboxes = await screen.findAllByRole('checkbox');

      expect(rowCheckboxes.length).toBeGreaterThan(sampleRows.length);
    });
  });

  describe('Client-Side Pagination and PageSizeOptions', () => {
    it('allows changing page size via pageSizeOptions', async () => {
      const user = userEvent.setup();

      const customPageSizeOptions = [2, 4, 6];

      render(
        <DataGridPremium
          rows={sampleRows} // 6 rows
          columns={sampleColumns}
          pageSize={2}
          pageSizeOptions={customPageSizeOptions}
        />
      );

      // Initially 2 rows should be displayed
      expect(screen.getAllByRole('row').length - 1).toBe(2);

      // Alternative 1: Using getByLabelText
      const pageSizeSelect = screen.getByLabelText(/rows per page/i);

      await user.click(pageSizeSelect);

      // Options should be visible
      await Promise.all(
        customPageSizeOptions.map(async (option) => {
          const element = await screen.findByRole('option', {
            name: option.toString(),
          });

          expect(element).toBeInTheDocument();
        })
      );

      await user.click(pageSizeSelect);

      // Change to 4 rows per page
      const option4 = await screen.findByRole('option', { name: '4' });

      await user.click(option4);

      await waitFor(() => {
        expect(screen.getAllByRole('row').length).toBe(5); // 4 data rows + 1 header row
      });

      // Change to 6 rows per page
      await user.click(pageSizeSelect); // Re-open select

      const option6 = await screen.findByRole('option', { name: '6' });

      await user.click(option6);

      expect(
        screen.getByRole('button', {
          name: /rows per page: 6/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe('Server-Side Pagination', () => {
    const mockServerRowsPage1 = sampleRows.slice(0, 2);
    const mockServerRowsPage2 = sampleRows.slice(2, 4);
    const totalServerRows = sampleRows.length; // 6

    let mockOnAsyncPaginationModelChange;

    beforeEach(() => {
      mockOnAsyncPaginationModelChange = jest.fn();
    });

    it('renders initial page of server-side data and uses custom pagination component', () => {
      render(
        <DataGridPremium
          rows={mockServerRowsPage1}
          columns={sampleColumns}
          asyncPagination
          rowCount={totalServerRows}
          pageNumber={0}
          pageSize={2}
          onAsyncPaginationModelChange={mockOnAsyncPaginationModelChange}
        />
      );

      // Check for data from the first page
      expect(screen.getByRole('gridcell', { name: 'Zoe' })).toBeInTheDocument();
      expect(
        screen.getByRole('gridcell', { name: 'Alice' })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('gridcell', { name: 'Bob' })
      ).not.toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /page 1/i, current: true })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /go to page 2/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /go to page 3/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /go to page 4/i })
      ).not.toBeInTheDocument();

      // MUI's default "Rows per page:" selector should NOT be visible if custom pagination is used for server-side
      expect(screen.queryByLabelText(/rows per page/i)).not.toBeInTheDocument();
    });

    it('calls onAsyncPaginationModelChange when custom pagination page is changed', async () => {
      const user = userEvent.setup();
      render(
        <DataGridPremium
          rows={mockServerRowsPage1} // Initially page 0 data
          columns={sampleColumns}
          asyncPagination
          rowCount={totalServerRows}
          pageNumber={0}
          pageSize={2}
          onAsyncPaginationModelChange={mockOnAsyncPaginationModelChange}
        />
      );

      // Click on "Go to page 2" button (which is page index 1)
      const page2Button = screen.getByRole('button', { name: /go to page 2/i });

      await user.click(page2Button);

      expect(mockOnAsyncPaginationModelChange).toHaveBeenCalledTimes(1);
      expect(mockOnAsyncPaginationModelChange).toHaveBeenCalledWith(1, 2); // (page: 1, pageSize: 2)
    });

    it('updates displayed rows when props change after a simulated fetch (server-side)', async () => {
      const { rerender } = render(
        <DataGridPremium
          rows={mockServerRowsPage1}
          columns={sampleColumns}
          asyncPagination
          rowCount={totalServerRows}
          pageNumber={0}
          pageSize={2}
          onAsyncPaginationModelChange={mockOnAsyncPaginationModelChange}
        />
      );

      // Initially, data from page 1 is shown, and loading is true
      expect(screen.getByRole('gridcell', { name: 'Zoe' })).toBeInTheDocument();

      // Simulate parent component fetching new data and re-rendering the grid
      // This would happen after onAsyncPaginationModelChange is called and data is fetched.
      act(() => {
        rerender(
          <DataGridPremium
            rows={mockServerRowsPage2} // New data for page 2
            columns={sampleColumns}
            asyncPagination
            rowCount={totalServerRows}
            pageNumber={1} // Updated page number
            pageSize={2}
            onAsyncPaginationModelChange={mockOnAsyncPaginationModelChange}
            loading={false} // Loading finished
          />
        );
      });

      // Dta from page 2 should be visible, and loading should be false
      await waitFor(() => {
        expect(
          screen.getByRole('gridcell', { name: 'Bob' })
        ).toBeInTheDocument();
        expect(
          screen.getByRole('gridcell', { name: 'Charlie' })
        ).toBeInTheDocument();
      });
      expect(
        screen.queryByRole('gridcell', { name: 'Zoe' })
      ).not.toBeInTheDocument();
      expect(screen.getByRole('grid')).not.toHaveClass(
        'MuiDataGrid-main--hasSkeletonLoadingOverlay'
      );

      // Custom pagination should reflect page 2
      expect(
        screen.getByRole('button', { name: /page 2/i, current: true })
      ).toBeInTheDocument();
    });

    it('allows changing page size via pageSizeOptions with custom pagination if it supports it (server-side)', async () => {
      const user = userEvent.setup();
      const pageSizeOptions = [2, 3];

      render(
        <DataGridPremium
          rows={mockServerRowsPage1} // 2 rows
          columns={sampleColumns}
          asyncPagination
          rowCount={totalServerRows} // 6 rows total
          pageNumber={0}
          pageSize={2}
          pageSizeOptions={pageSizeOptions}
          onAsyncPaginationModelChange={mockOnAsyncPaginationModelChange}
        />
      );

      const pageSizeSelectButton = screen.getByRole('button', {
        name: /rows per page: 2/i,
      });
      await user.click(pageSizeSelectButton);

      const option3 = await screen.findByRole('option', { name: '3' });

      await user.click(option3);

      expect(mockOnAsyncPaginationModelChange).toHaveBeenCalledTimes(1);

      expect(mockOnAsyncPaginationModelChange).toHaveBeenCalledWith(0, 3); // (page: 0, pageSize: 3)
    });
  });

  describe('Footer', () => {
    it('hides the footer when hideFooter is true', () => {
      render(
        <DataGridPremium hideFooter rows={sampleRows} columns={sampleColumns} />
      );

      // The footer contains pagination controls. A common element is "Rows per page" text or navigation buttons.
      expect(screen.queryByText(/rows per page/i)).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /go to next page/i })
      ).not.toBeInTheDocument();
    });

    it('shows selected row count in footer when rows are selected and hideFooterSelectedRowCount is false', async () => {
      const user = userEvent.setup();

      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          hideFooterSelectedRowCount={false}
          bulkActions={getSampleBulkActions()} // bulk actions make the selected count more relevant
        />
      );

      const rowCheckboxes = await screen.findAllByRole('checkbox');

      await user.click(rowCheckboxes[1]);

      // MUI typically shows "1 row selected"
      await waitFor(() => {
        expect(screen.getByText(/1 row selected/i)).toBeInTheDocument();
      });

      await user.click(rowCheckboxes[2]); // Select another row
      await waitFor(() => {
        expect(screen.getByText(/2 rows selected/i)).toBeInTheDocument();
      });
    });

    it('hides selected row count by default when bulk actions UI is active', async () => {
      const user = userEvent.setup();

      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          // hideFooterSelectedRowCount is not set (defaults to true when bulk UI is active)
          bulkActions={getSampleBulkActions()}
        />
      );

      const rowCheckboxes = await screen.findAllByRole('checkbox');

      await user.click(rowCheckboxes[1]);

      // Wait for bulk UI to appear
      await screen.findByRole('button', { name: 'Delete' });

      expect(screen.queryByText(/1 row selected/i)).not.toBeInTheDocument();
    });
  });

  describe('Passthrough Props', () => {
    it('applies initial state for sorting', () => {
      render(
        <DataGridPremium
          rows={sampleRows}
          columns={sampleColumns}
          initialState={{
            sorting: {
              sortModel: [{ field: 'age', sort: 'asc' }],
            },
          }}
        />
      );
      const nameCells = screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.querySelectorAll('[role="gridcell"]')[1])
        .map((cell) => cell.textContent);

      // Bob 22, Zoe 28, Alice 35
      expect(nameCells).toEqual([
        'Bob',
        'Eve',
        'Zoe',
        'Diana',
        'Alice',
        'Charlie',
      ]);

      const ageHeader = screen.getByRole('columnheader', { name: 'Age' });

      expect(ageHeader).toHaveAttribute('aria-sort', 'ascending');
    });
  });
});
