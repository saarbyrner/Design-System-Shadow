import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DataGrid from '../index';

describe('<DataGrid /> component', () => {
  const mockedColumns = [
    { id: 23, content: 'metric column-1' },
    { id: 24, content: 'metric column-2' },
    { id: 25, content: 'metric column-3' },
  ];

  const mockedRows = [
    {
      id: 12,
      cells: [
        { id: 0, content: 'cell-1 row-1' },
        { id: 1, content: 'cell-2 row-1' },
        { id: 2, content: 'cell-3 row-1' },
      ],
    },
    {
      id: 13,
      cells: [
        { id: 42, content: 'cell-1 row-2' },
        { id: 43, content: 'cell-2 row-2' },
        { id: 44, content: 'cell-3 row-2' },
      ],
    },
  ];

  const mockedRowsWithRowActions = [
    {
      id: 14,
      cells: [
        { id: 0, content: 'cell-1 row-1' },
        { id: 1, content: 'cell-2 row-1' },
        { id: 2, content: 'cell-3 row-1' },
      ],
      rowActions: [
        {
          id: 'row_1_action_1',
          text: 'action 1',
          onCallAction: jest.fn(),
        },
        {
          id: 'row_1_action_2',
          text: 'action 2',
          onCallAction: jest.fn(),
        },
      ],
    },
    {
      id: 15,
      cells: [
        { id: 42, content: 'cell-1 row-2' },
        { id: 43, content: 'cell-2 row-2' },
        { id: 44, content: 'cell-3 row-2' },
      ],
      rowActions: [
        {
          id: 'row_2_action_1',
          text: 'action 3',
          onCallAction: jest.fn(),
        },
        {
          id: 'row_2_action_2',
          text: 'action 4',
          onCallAction: jest.fn(),
        },
      ],
    },
  ];

  const defaultProps = {
    columns: mockedColumns,
    rows: mockedRows,
    onClickColumnSorting: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const renderComponent = (props = defaultProps) =>
    render(<DataGrid {...props} />);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the table content correctly', () => {
    renderComponent();

    // HEADER
    expect(screen.getByText('metric column-1')).toBeInTheDocument();
    expect(screen.getByText('metric column-2')).toBeInTheDocument();
    expect(screen.getByText('metric column-3')).toBeInTheDocument();

    // FIRST ROW
    expect(screen.getByText('cell-1 row-1')).toBeInTheDocument();
    expect(screen.getByText('cell-2 row-1')).toBeInTheDocument();
    expect(screen.getByText('cell-3 row-1')).toBeInTheDocument();

    // SECOND ROW
    expect(screen.getByText('cell-1 row-2')).toBeInTheDocument();
    expect(screen.getByText('cell-2 row-2')).toBeInTheDocument();
    expect(screen.getByText('cell-3 row-2')).toBeInTheDocument();
  });

  it('displays a loading message when the data is not fully loaded', () => {
    renderComponent({ ...defaultProps, isFullyLoaded: false });

    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('displays the empty table text when the table is empty', () => {
    renderComponent({
      ...defaultProps,
      isFullyLoaded: true,
      rows: [],
      emptyTableText: 'The table is empty',
    });

    expect(screen.getByText('The table is empty')).toBeInTheDocument();
  });

  it('displays the empty table text when isTableEmpty is true', () => {
    renderComponent({
      ...defaultProps,
      isFullyLoaded: true,
      isTableEmpty: true,
      emptyTableText: 'The table is empty',
    });

    expect(screen.getByText('The table is empty')).toBeInTheDocument();
  });

  it('sets the correct row class when passed', () => {
    const { container } = renderComponent({
      ...defaultProps,
      rows: [{ ...mockedRows[0], classnames: { customClassName: true } }],
    });

    expect(container.querySelector('.customClassName')).toBeInTheDocument();
  });

  describe('when a cell is bolder', () => {
    it('displays its text bolder', () => {
      const { container } = renderComponent({
        ...defaultProps,
        columns: [{ ...mockedColumns[0], isBolder: true }],
      });

      const bolderCell = container.querySelector('.dataGrid__cell--bolder');
      expect(bolderCell).toBeInTheDocument();
    });
  });

  it('sets the correct maxHeight when the property is set', () => {
    const { container } = renderComponent({
      ...defaultProps,
      maxHeight: '500px',
    });

    const dataGrid = container.querySelector('.dataGrid');
    expect(dataGrid).toHaveStyle({ maxHeight: '500px' });
    expect(dataGrid).toHaveStyle({ minHeight: 'auto' });
  });

  it('sets the correct minHeight when the property is set', () => {
    const { container } = renderComponent({
      ...defaultProps,
      minHeight: '500px',
    });

    const dataGrid = container.querySelector('.dataGrid');
    expect(dataGrid).toHaveStyle({ maxHeight: 'auto' });
    expect(dataGrid).toHaveStyle({ minHeight: '500px' });
  });

  describe('when has rowActions', () => {
    const rowActions = [
      {
        id: 'row_action_1',
        text: 'action 1',
        onCallAction: jest.fn(),
      },
      {
        id: 'row_action_2',
        text: 'action 2',
        onCallAction: jest.fn(),
      },
    ];

    it('does not display the filler cell apart from the column header', () => {
      const { container } = renderComponent({
        ...defaultProps,
        rowActions,
      });

      const fillerCells = container.querySelectorAll('.dataGrid__fillerCell');
      expect(fillerCells.length).toEqual(1);
    });

    it('displays the row actions cell', () => {
      const { container } = renderComponent({
        ...defaultProps,
        rowActions,
      });

      const rowActionsCells = container.querySelectorAll(
        '.dataGrid__rowActionsCell'
      );
      expect(rowActionsCells.length).toEqual(2);
    });

    describe('when clicking on tooltip menu option', () => {
      it('calls onCallAction callback with the row id', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          rowActions,
        });

        // Find and click tooltip menu buttons
        const tooltipButtons = screen.getAllByRole('button');

        await user.click(tooltipButtons[0]);

        // Find and click first action
        const firstAction = screen.getByText('action 1');
        await user.click(firstAction);

        expect(rowActions[0].onCallAction).toHaveBeenCalledWith(12);
      });
    });
  });

  it('should display a divider row like normal rows without any content', () => {
    const dividerRow = {
      id: 900,
      cells: [
        { id: 0, content: '' },
        { id: 1, content: '' },
        { id: 2, content: '' },
      ],
    };

    const { container } = renderComponent({
      ...defaultProps,
      rows: mockedRows.concat([dividerRow]),
    });

    const rows = container.querySelectorAll('.dataGrid__body .dataGrid__row');
    expect(rows.length).toEqual(mockedRows.length + 1);
  });

  it('renders sort indicators on sortable columns', () => {
    const { container } = renderComponent({
      ...defaultProps,
      columns: [
        { id: 'column-1', content: '' },
        { id: 'column-2', content: '' },
        { id: 'column-3', content: '' },
      ],
      sortableColumns: ['column-1', 'column-2'],
    });

    const sortIndicators = container.querySelectorAll(
      '.dataGrid__sortIndicators'
    );
    expect(sortIndicators.length).toEqual(2);
  });

  it('calls onClickColumnSorting when clicking the header of a column header', async () => {
    const user = userEvent.setup();
    const { container } = renderComponent({
      ...defaultProps,
      columns: [
        { id: 'column-1', content: '' },
        { id: 'column-2', content: '' },
        { id: 'column-3', content: '' },
      ],
      sortableColumns: ['column-1', 'column-2'],
    });

    const firstColumnHeader = container.querySelector(
      '.dataGrid__head .dataGrid__cell'
    );
    await user.click(firstColumnHeader);

    expect(defaultProps.onClickColumnSorting).toHaveBeenCalledWith({
      column: 'column-1',
      order: 'DESCENDING',
    });
  });

  it('renders an active up arrow when a column sorting is ASCENDING', () => {
    const { container } = renderComponent({
      ...defaultProps,
      columns: [
        { id: 'column-1', content: '' },
        { id: 'column-2', content: '' },
        { id: 'column-3', content: '' },
      ],
      sortableColumns: ['column-1', 'column-2'],
      gridSorting: {
        column: 'column-1',
        order: 'ASCENDING',
      },
    });

    const activeUpArrow = container.querySelector(
      '.icon-up.dataGrid__sortIndicator--active'
    );
    expect(activeUpArrow).toBeInTheDocument();
  });

  it('renders an active down arrow when a column sorting is DESCENDING', () => {
    const { container } = renderComponent({
      ...defaultProps,
      columns: [
        { id: 'column-1', content: '' },
        { id: 'column-2', content: '' },
        { id: 'column-3', content: '' },
      ],
      sortableColumns: ['column-1', 'column-2'],
      gridSorting: {
        column: 'column-1',
        order: 'DESCENDING',
      },
    });

    const activeDownArrow = container.querySelector(
      '.icon-down.dataGrid__sortIndicator--active'
    );
    expect(activeDownArrow).toBeInTheDocument();
  });

  describe('when row has rowActions', () => {
    it('does not display the filler cell in the rows only the header', () => {
      const { container } = renderComponent({
        ...defaultProps,
        rows: mockedRowsWithRowActions,
      });

      const fillerCells = container.querySelectorAll('.dataGrid__fillerCell');
      expect(fillerCells.length).toEqual(1);
    });

    it('displays the row actions cell', () => {
      const { container } = renderComponent({
        ...defaultProps,
        rows: mockedRowsWithRowActions,
      });

      const rowActionsCells = container.querySelectorAll(
        '.dataGrid__rowActionsCell'
      );
      expect(rowActionsCells.length).toEqual(2);
    });

    describe('when clicking on tooltip menu option', () => {
      it('calls onCallAction callback with the row id', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          rows: mockedRowsWithRowActions,
        });

        await user.click(screen.getAllByRole('button')[0]);
        await user.click(screen.getByText('action 1'));
        expect(
          mockedRowsWithRowActions[0].rowActions[0].onCallAction
        ).toHaveBeenCalledWith(14);

        await user.click(screen.getAllByRole('button')[1]);
        await user.click(screen.getByText('action 4'));
        expect(
          mockedRowsWithRowActions[1].rowActions[1].onCallAction
        ).toHaveBeenCalledWith(15);
      });
    });
  });
});
