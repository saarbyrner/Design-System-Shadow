import { screen, waitFor, fireEvent } from '@testing-library/react';
import { axios } from '@kitman/common/src/utils/services';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MatchdayManagementFiltersTranslated as Filters } from '../index';

jest.mock('lodash/debounce', () => jest.fn((fn) => fn)); // Mocking debounce

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
      expect(
        screen.getByPlaceholderText('Search by match #')
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search by match day')
      ).toBeInTheDocument();
      expect(screen.getByTestId('date-filter')).toBeInTheDocument();
    });
  });

  it('calls the setFilters function with the correct params when typing in the search bar', async () => {
    renderWithRedux(<Filters {...defaultProps} />);
    const searchBar = screen.getByPlaceholderText('Search by match #');

    await fireEvent.change(searchBar, { target: { value: 'Test Search' } });

    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({
        search_expression: 'Test Search',
      });
    });
  });

  it('calls the setFilters function with the correct params when typing in the search match day', async () => {
    renderWithRedux(<Filters {...defaultProps} />);
    const searchBar = screen.getByPlaceholderText('Search by match day');

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
      expect(screen.getByText('Clubs')).toBeInTheDocument();
    });

    it('allows a club to be set', async () => {
      const user = userEvent.setup();
      renderWithRedux(<Filters {...defaultProps} isLeague />);
      await user.click(screen.getByText('Clubs'));
      await user.click(screen.getByText('club'));
      expect(screen.getByText('Clubs')).toBeInTheDocument();
      expect(mockSetFilters).toHaveBeenCalledWith({
        organisations: [1234],
      });
    });
  });

  describe('failed render', () => {
    it('renders an error if an api call fails', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue('wahooo');
      renderWithRedux(<Filters {...defaultProps} isLeague />);
      await waitFor(() =>
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
      );
    });
  });
});
