import { VirtuosoMockContext } from 'react-virtuoso';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as services from '@kitman/modules/src/analysis/BenchmarkReport/redux/service';
import useFilter from '@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter';
import { render } from '@kitman/modules/src/analysis/BenchmarkReport/testUtils';

import Seasons from '..';

jest.mock('@kitman/modules/src/analysis/BenchmarkReport/hooks/useFilter');

const MOCK_SEASONS = [2020, 2021, 2022];

const props = {
  t: i18nextTranslateStub(),
};

describe('BenchmarkReport|Filters|Seasons', () => {
  beforeEach(() => {
    jest.spyOn(services, 'useGetSeasonsQuery').mockReturnValue({
      data: MOCK_SEASONS,
      isFetching: false,
    });
  });

  describe('when filter type is "seasons"', () => {
    const mockSetFilter = jest.fn();

    beforeEach(() => {
      useFilter.mockImplementation(() => {
        return {
          filter: [2020],
          setFilter: mockSetFilter,
        };
      });
    });

    it('renders the Seasons component', () => {
      render(<Seasons {...props} />);

      const seasons = screen.getByLabelText('Season(s)');

      expect(seasons).toBeInTheDocument();
    });

    it('renders the season options', async () => {
      const user = userEvent.setup();
      const { container } = render(<Seasons {...props} />, {
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

      expect(screen.getByText('2021/2022')).toBeInTheDocument();
      expect(screen.getByText('2022/2023')).toBeInTheDocument();
    });

    it('renders the filter prefilled from the useFilter hook', () => {
      render(<Seasons {...props} />);

      const year = screen.getByText('2020/2021');

      expect(year).toBeInTheDocument();
    });

    it('calls setFilter when option(s) are selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<Seasons {...props} />, {
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
      await user.click(screen.getByText('2022/2023'));

      expect(mockSetFilter).toHaveBeenCalledWith([2022]);
    });
  });

  describe('when filter type is "compare_to"', () => {
    // the Seasons component is used twice, but saved to state in different ways
    // when isComparison is true, setFilter saves the compare_to object to state.
    const mockSetFilter = jest.fn();

    beforeEach(() => {
      useFilter.mockImplementation(() => {
        return {
          filter: {
            athlete_ids: [],
            seasons: [2022],
            testing_window_ids: [],
          },
          setFilter: mockSetFilter,
        };
      });
    });

    it('renders the filter prefilled from the useFilter hook', () => {
      render(<Seasons {...props} isComparison />);

      const year = screen.getByText('2022/2023');

      expect(year).toBeInTheDocument();
    });

    it('calls setFilter when option(s) are selected', async () => {
      const user = userEvent.setup();
      const { container } = render(<Seasons {...props} isComparison />, {
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
      await user.click(screen.getByText('2021/2022'));

      expect(mockSetFilter).toHaveBeenCalledWith({
        athlete_ids: [],
        seasons: [2022, 2021],
        testing_window_ids: [],
      });
    });
  });

  describe('when ‘bm-testing-limit-season-and-age-filter’ feature flag is on', () => {
    beforeEach(() => {
      window.setFlag('bm-testing-limit-season-and-age-filter', true);

      useFilter.mockImplementation(() => {
        return {
          filter: [2020],
          setFilter: jest.fn(),
        };
      });
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    const label = 'Seasons (Max: 4)';
    it(`shows ‘${label}’ as the label`, () => {
      render(<Seasons {...props} />);

      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });

    it('doesn’t show ‘Select All’ and ‘Clear’', async () => {
      const user = userEvent.setup();
      const { container } = render(<Seasons {...props} />);

      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );

      expect(screen.queryByLabelText('Select All')).not.toBeInTheDocument();
    });
  });

  describe('when ‘bm-testing-fe-side-performance-optimization’ feature flag is on', () => {
    beforeEach(() => {
      window.setFlag('bm-testing-fe-side-performance-optimization', true);

      useFilter.mockImplementation(() => {
        return {
          filter: [2020],
          setFilter: jest.fn(),
        };
      });
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    const label = 'Seasons (Max: 4)';
    it(`shows ‘${label}’ as the label`, () => {
      render(<Seasons {...props} />);

      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });

    it('doesn’t show ‘Select All’ and ‘Clear’', async () => {
      const user = userEvent.setup();
      const { container } = render(<Seasons {...props} />);

      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );

      expect(screen.queryByLabelText('Select All')).not.toBeInTheDocument();
    });
  });
});
