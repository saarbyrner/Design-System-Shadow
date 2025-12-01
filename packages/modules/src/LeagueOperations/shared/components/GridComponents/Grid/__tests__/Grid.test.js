import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Grid from '..';

const mockColumns = [
  { field: 'id', headerName: 'ID', flex: 1, sortable: true, minWidth: 100 },
  { field: 'name', headerName: 'Name', flex: 2, sortable: true, minWidth: 150 },
];

const mockRows = [
  { id: 1, name: 'Player One' },
  { id: 2, name: 'Player Two' },
];

describe('Grid component', () => {
  const setPageMock = jest.fn();

  const renderGrid = (props = {}) =>
    render(
      <Grid
        columns={mockColumns}
        rows={mockRows}
        totalPages={3}
        page={1}
        isLoading={false}
        isFetching={false}
        setPage={setPageMock}
        {...props}
      />
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the data grid with rows', () => {
    renderGrid();

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Player One')).toBeInTheDocument();
    expect(screen.getByText('Player Two')).toBeInTheDocument();
  });

  it('shows loading indicator when isLoading is true', () => {
    renderGrid({ isLoading: true });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders correct number of pagination items', () => {
    renderGrid({ totalPages: 3 });

    expect(screen.getByRole('button', { name: 'page 1' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to page 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to page 3' })
    ).toBeInTheDocument();
  });

  it('calls setPage when a new page is clicked', () => {
    renderGrid();

    const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(page2Button);
    expect(setPageMock).toHaveBeenCalledWith(2);
  });

  describe('Grid is bulk select', () => {
    it('calls onRowSelectionModelChange when a row checkbox is clicked', async () => {
      const user = userEvent.setup();
      const onRowSelectionModelChange = jest.fn();
      renderGrid({
        checkboxSelection: true,
        selectedRows: [],
        onRowSelectionModelChange,
      });

      const checkboxes = screen.getAllByRole('checkbox');
      const firstRowCheckbox = checkboxes[1];
      await user.click(firstRowCheckbox);
      expect(onRowSelectionModelChange).toHaveBeenCalled();
    });
  });
});
