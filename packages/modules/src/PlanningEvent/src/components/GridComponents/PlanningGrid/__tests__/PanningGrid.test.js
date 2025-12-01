import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PlanningGrid from '..';

describe('PlanningGrid component', () => {
  const mockFetchMoreData = jest.fn();
  const mockAllowOverflow = jest.fn();
  const mockOnClickDeleteColumn = jest.fn();

  const props = {
    grid: {
      columns: [
        {
          row_key: 'athlete',
          name: 'Athlete',
          readonly: true,
          id: 1,
          default: true,
        },
        { row_key: 'rpe', name: 'Rpe', readonly: false, id: 2, default: true },
        {
          row_key: 'minutes',
          name: 'Minutes',
          readonly: false,
          default: true,
          id: 3,
        },
        { row_key: 'load', name: 'Load', readonly: true, id: 4, default: true },
        {
          row_key: '%_difference',
          name: '% Difference',
          readonly: true,
          id: 5,
          default: false,
        },
        {
          row_key: 'null_thing',
          name: 'Null Thing',
          readonly: true,
          id: 6,
          default: false,
        },
      ],
      rows: [
        {
          id: 1,
          athlete: {
            avatar_url: 'john_do_avatar.jpg',
            fullname: 'John Doh',
          },
          rpe: 1,
          minutes: 90,
          load: 90,
          '%_difference': { value: 1, comment: null },
          null_thing: null,
        },
      ],
      next_id: null,
    },
    emptyText: 'Test empty text',
    fetchMoreData: mockFetchMoreData,
    getHeaderCell: (column) => ({
      id: column.row_key,
      content: <div>{column.name}</div>,
      isHeader: true,
    }),
    allowOverflow: mockAllowOverflow,
    getCellContent: (column, row) => {
      switch (column.row_key) {
        case 'athlete':
          return (
            <div>
              <img src={row.athlete.avatar_url} alt="AN ALT" />
              {row.athlete.fullname}
            </div>
          );
        default:
          return row[column.row_key];
      }
    },
    onClickDeleteColumn: mockOnClickDeleteColumn,
    hasRequestFailed: false,
    isFullyLoaded: true,
    isLoading: false,
    canDeleteColumn: true,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct content', () => {
    render(<PlanningGrid {...props} />);

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('John Doh');
    expect(cells[1]).toHaveTextContent('1');
    expect(cells[2]).toHaveTextContent('90');
    expect(cells[3]).toHaveTextContent('90');
    expect(cells[4]).toHaveTextContent('1');
  });

  describe('when the requests succeed', () => {
    it('does not show an error message', async () => {
      render(<PlanningGrid {...props} />);

      expect(
        screen.queryByText('Something went wrong!')
      ).not.toBeInTheDocument();
    });
  });

  describe('when the requests fail', () => {
    it('shows an error message', async () => {
      render(<PlanningGrid {...props} hasRequestFailed />);

      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });
});
