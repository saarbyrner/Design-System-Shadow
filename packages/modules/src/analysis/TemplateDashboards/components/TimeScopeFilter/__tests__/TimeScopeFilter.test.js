import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';
import { screen, within } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';
import useFilter from '@kitman/modules/src/analysis/TemplateDashboards/hooks/useFilter';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import { render } from '../../../testUtils';
import TimeScopeFilter from '..';

jest.mock('../../../hooks/useFilter');
const mockSetFilter = jest.fn();

const props = {
  t: i18nextTranslateStub(),
};

describe('TemplateDashboards|FilterPanel', () => {
  beforeEach(() => {
    useFilter.mockReturnValue({
      filter: {
        start_time: null,
        end_time: null,
        time_period: null,
      },
      setFilter: mockSetFilter,
    });
  });

  it('renders the correct time period options', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <TimeScopeFilter {...props} dashboardKey="coaching_summary" />,
      {
        wrapper: ({ children }) => (
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 2000, itemHeight: 50 }}
          >
            {children}
          </VirtuosoMockContext.Provider>
        ),
      }
    );

    await user.click(container.querySelectorAll('.kitmanReactSelect input')[0]);

    const virtuosoList = within(
      container.querySelector(`[data-test-id="virtuoso-item-list"]`)
    );

    expect(screen.queryByText('Date')).toBeInTheDocument();
    expect(virtuosoList.getByText('Today')).toBeValid();
    expect(virtuosoList.getByText('Yesterday')).toBeValid();
    expect(virtuosoList.getByText('This Week')).toBeValid();
    expect(virtuosoList.getByText('Last Week')).toBeValid();
    expect(virtuosoList.getByText('This Season So Far')).toBeValid();
    expect(virtuosoList.getByText('This Season')).toBeValid();
    expect(virtuosoList.getByText('This Pre Season')).toBeValid();
    expect(virtuosoList.getByText('This In Season')).toBeValid();
    expect(virtuosoList.getByText('Last (x) Days')).toBeValid();
    expect(virtuosoList.getByText('All Time')).toBeValid();
    expect(virtuosoList.getByText('Custom Date Range')).toBeValid();
  });

  describe('when on the development journey', () => {
    it('should render the correct time period options', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <TimeScopeFilter {...props} dashboardKey="development_journey" />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        }
      );

      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );

      const virtuosoList = within(
        container.querySelector(`[data-test-id="virtuoso-item-list"]`)
      );

      expect(screen.queryByText('Date')).toBeInTheDocument();
      expect(virtuosoList.getByText('Today')).toBeValid();
      expect(virtuosoList.getByText('Yesterday')).toBeValid();
      expect(virtuosoList.getByText('This Week')).toBeValid();
      expect(virtuosoList.getByText('Last Week')).toBeValid();
      expect(virtuosoList.getByText('This Season So Far')).toBeValid();
      expect(virtuosoList.getByText('Last (x) Days')).toBeValid();
      expect(virtuosoList.getByText('All Time')).toBeValid();
      expect(virtuosoList.getByText('Custom Date Range')).toBeValid();
    });
  });

  describe('when Custom Date Range is selected', () => {
    beforeEach(() => {
      moment.tz.setDefault('UTC');
      const fakeNowDate = new Date('2024-07-10T15:30:10Z');
      jest.useFakeTimers();
      jest.setSystemTime(fakeNowDate);
    });

    afterEach(() => {
      moment.tz.setDefault();
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    it('sets the filter to the correct time period date range', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      const { container } = render(
        <TimeScopeFilter {...props} dashboardKey="coaching_summary" />,
        {
          wrapper: ({ children }) => (
            <VirtuosoMockContext.Provider
              value={{ viewportHeight: 2000, itemHeight: 50 }}
            >
              {children}
            </VirtuosoMockContext.Provider>
          ),
        }
      );

      await user.click(
        container.querySelectorAll('.kitmanReactSelect input')[0]
      );
      await user.click(screen.getByText('Custom Date Range'));

      expect(mockSetFilter).toHaveBeenCalledWith({
        time_period: TIME_PERIODS.customDateRange,
        end_time: '2024-07-10T23:59:59+00:00',
        start_time: '2024-07-10T00:00:00+00:00',
      });
    });
  });
});
