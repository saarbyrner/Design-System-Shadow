import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { VirtuosoMockContext } from 'react-virtuoso';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';
import * as services from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import TestingWindows from '..';

jest.mock('@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter');

const MOCK_TESTING_WINDOWS = [
  {
    id: 1,
    name: 'Test Window 1',
  },
  {
    id: 2,
    name: 'Test Window 2',
  },
  {
    id: 3,
    name: 'Test Window 3',
  },
];

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|TestingWindows', () => {
  beforeEach(() => {
    jest.spyOn(services, 'useGetTestingWindowsQuery').mockReturnValue({
      data: MOCK_TESTING_WINDOWS,
      isFetching: false,
    });
  });

  describe('when filter type is "testing_window_ids"', () => {
    const mockSetFilter = jest.fn();

    beforeEach(() => {
      useFilter.mockImplementation(() => {
        return {
          filter: [1],
          setFilter: mockSetFilter,
        };
      });
    });

    it('renders the TestingWindows component', () => {
      render(<TestingWindows {...props} />);

      const testingWindows = screen.getByLabelText('Testing window(s)');

      expect(testingWindows).toBeInTheDocument();
    });

    it('renders the filter prefilled from the useFilter hook', () => {
      render(<TestingWindows {...props} />);
      expect(screen.getByText('Test Window 1')).toBeInTheDocument();
    });

    it('renders the testing window options', async () => {
      const user = userEvent.setup();
      const { container } = render(<TestingWindows {...props} />, {
        wrapper: ({ children }) => (
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            {children}
          </VirtuosoMockContext.Provider>
        ),
      });

      // click on select dropdown
      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );

      expect(screen.getByText('Test Window 3')).toBeInTheDocument();
      expect(screen.getByText('Test Window 2')).toBeInTheDocument();
    });

    it('calls setFilter when option(s) are selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<TestingWindows {...props} />, {
        wrapper: ({ children }) => (
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            {children}
          </VirtuosoMockContext.Provider>
        ),
      });
      // click on select dropdown
      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );
      // click on an option
      await user.click(screen.getByText('Test Window 3'));

      expect(mockSetFilter).toHaveBeenCalledWith([1, 3]);
    });
  });

  describe('when filter type is "compare_to"', () => {
    // the TestingWindows component is used twice, but saved to state in different ways
    // when isComparison is true, setFilter saves the compare_to object to state.
    const mockSetFilter = jest.fn();
    beforeEach(() => {
      useFilter.mockImplementation(() => {
        return {
          filter: {
            athlete_ids: [],
            seasons: [],
            testing_window_ids: [2],
          },
          setFilter: mockSetFilter,
        };
      });
    });

    it('renders the testing window options', async () => {
      const user = userEvent.setup();
      const { container } = render(<TestingWindows {...props} isComparison />, {
        wrapper: ({ children }) => (
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            {children}
          </VirtuosoMockContext.Provider>
        ),
      });

      // click on select dropdown
      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );

      expect(screen.getByText('Test Window 3')).toBeInTheDocument();
      expect(screen.getByText('Test Window 1')).toBeInTheDocument();
    });

    it('calls setFilter when option(s) are selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<TestingWindows {...props} isComparison />, {
        wrapper: ({ children }) => (
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            {children}
          </VirtuosoMockContext.Provider>
        ),
      });
      // click on select dropdown
      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );
      // click on an option
      await user.click(screen.getByText('Test Window 3'));

      expect(mockSetFilter).toHaveBeenCalledWith({
        athlete_ids: [],
        seasons: [],
        testing_window_ids: [2, 3],
      });
    });
  });
});
