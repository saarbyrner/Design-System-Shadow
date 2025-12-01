import { screen, render } from '@testing-library/react';
import { DataGrid } from '@kitman/playbook/components';
import userEvent from '@testing-library/user-event';
import {
  rows,
  columns,
} from '@kitman/playbook/components/wrappers/DataGrid/__tests__/DataGridTestData';
import moment from 'moment-timezone';

const props = {
  rows: rows.slice(0, 6),
  columns,
};

describe('<DataGrid />', () => {
  let locale = null;
  // TODO: playwright test for infinite loading
  beforeEach(() => {
    // MUI displays date format based off browser language i.e English America en-US MM/DD/YYY or England en-GB DD/MM/YYYY
    locale = moment.locale();
    moment.locale('en-gb');
    moment.tz.setDefault('UTC');
  });
  afterEach(() => {
    moment.locale(locale);
    moment.tz.setDefault();
  });

  it('renders DataGrid component and value', () => {
    render(<DataGrid {...props} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(8);
    expect(screen.getAllByRole('row')).toHaveLength(7);
    expect(
      screen.getByRole('row', {
        name: 'Name Injury Status Position Date of Birth Team Goals Assists Previous winner',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', {
        name: 'Erling Haaland Available Striker 21/07/2000 Manchester City 9 1 yes',
      })
    ).toBeInTheDocument();
  });

  it('renders the default message for empty rows', () => {
    render(<DataGrid {...props} rows={[]} />);
    expect(screen.getByText('No rows')).toBeInTheDocument();
  });

  it('renders the custom message for empty rows', () => {
    render(<DataGrid {...props} rows={[]} noRowsMessage="NO ROWS!!" />);
    expect(screen.getByText('NO ROWS!!')).toBeInTheDocument();
  });

  it('render the checkbox for selection', () => {
    render(<DataGrid {...props} checkboxSelection />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(7);
  });

  it('renders the grid toolbar', () => {
    render(
      <DataGrid
        {...props}
        gridToolBar={['showQuickFilter', 'enableCSV', 'enablePrint']}
      />
    );
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('renders the export button when CSV is enable', async () => {
    render(<DataGrid {...props} gridToolBar={['enableCSV']} />);
    const exportBtn = screen.getByRole('button', { name: 'Export' });
    expect(exportBtn).toBeInTheDocument();
    await userEvent.click(exportBtn);
    expect(
      screen.getByRole('menuitem', {
        name: 'Download as CSV',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', {
        name: 'Print',
      })
    ).not.toBeInTheDocument();
  });
  it('renders the export button when print is enable', async () => {
    render(<DataGrid {...props} gridToolBar={['enablePrint']} />);
    const exportBtn = screen.getByRole('button', { name: 'Export' });
    expect(exportBtn).toBeInTheDocument();
    await userEvent.click(exportBtn);
    expect(
      screen.getByRole('menuitem', {
        name: 'Print',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('menuitem', {
        name: 'Download as CSV',
      })
    ).not.toBeInTheDocument();
  });

  it('renders the pagination', async () => {
    render(<DataGrid {...props} pagination />);

    const rowsButton = screen.getByRole('button', {
      name: 'Rows: 25',
    });

    expect(rowsButton).toBeInTheDocument();
    await userEvent.click(rowsButton);

    expect(screen.getByRole('option', { name: /10/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /25/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /50/i })).toBeInTheDocument();
  });

  it('renders the pagination different page number', async () => {
    render(
      <DataGrid
        {...props}
        pagination
        pageSize={5}
        pageSizeOptions={[5, 60, 100]}
      />
    );

    const rowsButton = screen.getByRole('button', {
      name: 'Rows: 5',
    });
    expect(rowsButton).toBeInTheDocument();
    await userEvent.click(rowsButton);
    expect(screen.getByRole('option', { name: /5/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /60/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /100/i })).toBeInTheDocument();
  });

  it('renders with selectionOnClick', async () => {
    render(<DataGrid {...props} rowSelection />);

    await userEvent.click(
      screen.getByRole('row', {
        name: 'Erling Haaland Available Striker 21/07/2000 Manchester City 9 1 yes',
      })
    );
    expect(screen.getByText('1 row selected')).toBeInTheDocument();
  });

  it('renders with selectionOnClick selects checkbox', async () => {
    render(<DataGrid {...props} rowSelection checkboxSelection />);

    expect(() => screen.getByTestId('CheckBoxIcon')).toThrow();
    await userEvent.click(
      screen.getByRole('row', {
        name: 'Select row Erling Haaland Available Striker 21/07/2000 Manchester City 9 1 yes',
      })
    );
    expect(screen.getByText('1 row selected')).toBeInTheDocument();
    expect(screen.getByTestId('CheckBoxIcon')).toBeInTheDocument();
  });

  it('renders pinned columns', () => {
    render(
      <DataGrid
        {...props}
        leftPinnedColumns={['name']}
        rightPinnedColumns={['assists']}
      />
    );

    expect(screen.getByRole('row', { name: 'Name' }).parentElement).toHaveClass(
      'MuiDataGrid-pinnedColumnHeaders--left'
    );

    expect(
      screen.getByRole('row', { name: 'Assists' }).parentElement
    ).toHaveClass('MuiDataGrid-pinnedColumnHeaders--right');
  });

  it('shows the loading screen', () => {
    render(<DataGrid {...props} loading />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  describe('Async pagination', () => {
    let onPaginationModelChange = jest.fn();
    const renderComponent = (additionalProps) => {
      render(
        <DataGrid
          {...props}
          pagination
          asyncPagination
          rowCount={6}
          pageSize={2}
          pageSizeOptions={[2, 4]}
          onPaginationModelChange={onPaginationModelChange}
          {...additionalProps}
        />
      );
    };
    afterEach(() => {
      onPaginationModelChange = jest.fn();
    });
    it('renders correctly', () => {
      renderComponent();
      const goPreviousPage = screen.getByRole('button', {
        name: /go to previous page/i,
      });
      const page1 = screen.getByRole('button', { name: /page 1/i });
      const page2 = screen.getByRole('button', { name: /go to page 2/i });
      const page3 = screen.getByRole('button', { name: /go to page 3/i });
      const goNextPage = screen.getByRole('button', {
        name: /go to next page/i,
      });

      expect(goPreviousPage).toBeInTheDocument();

      expect(page1).toBeInTheDocument();
      expect(page2).toBeInTheDocument();
      expect(page3).toBeInTheDocument();
      expect(goNextPage).toBeInTheDocument();
    });

    it('calls onPaginationModelChange correctly', async () => {
      renderComponent();
      const page3 = screen.getByRole('button', { name: /go to page 3/i });
      await userEvent.click(page3);
      expect(onPaginationModelChange).toHaveBeenCalledWith(2, 2); // page number 2 and page size 2
      const rowsButton = screen.getByRole('button', {
        name: 'Rows: 2',
      });
      expect(rowsButton).toBeInTheDocument();
      await userEvent.click(rowsButton);
      await userEvent.click(screen.getByRole('option', { name: /4/i }));
      expect(onPaginationModelChange).toHaveBeenCalledWith(0, 4); // page number 0 and page size 4
    });

    it('calls onRowsPerPageChange correctly', async () => {
      const mockOnRowsPerPageChange = jest.fn();
      renderComponent({
        rowsPerPage: 2,
        onRowsPerPageChange: mockOnRowsPerPageChange,
      });
      const rowsButton = screen.getByRole('button', {
        name: 'Rows: 2',
      });
      expect(rowsButton).toBeInTheDocument();
      await userEvent.click(rowsButton);
      await userEvent.click(screen.getByRole('option', { name: /4/i }));
      expect(mockOnRowsPerPageChange).toHaveBeenCalledWith(4);
    });

    it('disables the previous button correctly when user is on the first page', async () => {
      renderComponent();
      const goPreviousPage = screen.getByRole('button', {
        name: /go to previous page/i,
      });
      const goNextPage = screen.getByRole('button', {
        name: /go to next page/i,
      });
      expect(goPreviousPage).toBeDisabled();
      expect(goNextPage).toBeEnabled();
    });

    it('disables the next button correctly when user is on the last page', async () => {
      renderComponent({ pageNumber: 3 });
      const goPreviousPage = screen.getByRole('button', {
        name: /go to previous page/i,
      });
      const goNextPage = screen.getByRole('button', {
        name: /go to next page/i,
      });
      expect(goPreviousPage).toBeEnabled();
      expect(goNextPage).toBeDisabled();
    });
  });
});

describe('<DataGrid - ability to override custom default behaviour added to the wrapper />', () => {
  it('initialState && paginationModel', () => {
    render(
      <DataGrid
        {...props}
        initialState={{ paginationModel: { pageSize: 50 } }}
        paginationModel={{ page: 0, pageSize: 50 }}
        pagination
        pageSize={25}
      />
    );

    // initialState && paginationModel prop overrides pageSize default (25)
    expect(
      screen.queryByRole('button', {
        name: 'Rows: 25',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Rows: 50',
      })
    ).toBeInTheDocument();
  });

  it('slotProps', () => {
    render(
      <DataGrid
        {...props}
        slotProps={{
          toolbar: {
            csvOptions: {
              disableToolbarButton: true,
            },
            printOptions: {
              disableToolbarButton: true,
            },
            showQuickFilter: false,
          },
        }}
        gridToolBar={['showQuickFilter', 'enablePrint', 'enableCSV']}
      />
    );

    // slotProps overrides gridToolBar
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Export' })
    ).not.toBeInTheDocument();
  });
});
