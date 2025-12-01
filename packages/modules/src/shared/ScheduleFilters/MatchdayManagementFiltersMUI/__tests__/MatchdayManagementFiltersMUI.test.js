import { screen, waitFor, fireEvent } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MatchdayManagementFiltersMUITranslated as Filters } from '../index';

describe('DMR Filters Component', () => {
  const mockSetFilters = jest.fn();
  const defaultProps = {
    filters: {
      search_expression: '',
      dateRange: { start_date: '', end_date: '' },
      eventTypes: [],
      competitions: [],
      gameDays: [],
      oppositions: [],
      round_number: '',
    },
    initialFilters: {
      search_expression: '',
      dateRange: { start_date: '', end_date: '' },
      eventTypes: [],
      competitions: [],
      gameDays: [],
      oppositions: [],
      round_number: '',
    },
    setFilters: mockSetFilters,
    isLeague: false,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    renderWithRedux(<Filters {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Search by match #')).toBeInTheDocument();
      expect(screen.getByLabelText('Search by match day')).toBeInTheDocument();
      expect(screen.getByLabelText('Date range')).toBeInTheDocument();
    });
  });

  it('calls the setFilters function with the correct params when typing in the search bar', async () => {
    renderWithRedux(<Filters {...defaultProps} />);
    const searchBar = screen.getByLabelText('Search by match #');

    await fireEvent.change(searchBar, { target: { value: 'Test Search' } });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({
        search_expression: 'Test Search',
      });
    });
  });

  it('calls the setFilters function with the correct params when typing in the search match day', async () => {
    renderWithRedux(<Filters {...defaultProps} />);
    const searchBar = screen.getByLabelText('Search by match day');

    await fireEvent.change(searchBar, { target: { value: '1' } });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({
        round_number: '1',
      });
    });
  });

  describe('League render', () => {
    it('renders the club dropdown', () => {
      renderWithRedux(<Filters {...defaultProps} isLeague />);
      expect(screen.getByLabelText('Clubs')).toBeInTheDocument();
    });

    it('allows a club to be set', async () => {
      renderWithRedux(<Filters {...defaultProps} isLeague />);
      fireEvent.change(screen.getByLabelText('Clubs'), {
        target: { value: 'club' },
      });
      await waitFor(() => {
        expect(screen.getByText('club')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('club'));
      expect(mockSetFilters).toHaveBeenCalledWith({
        organisations: [1234],
      });
    });
  });
});
