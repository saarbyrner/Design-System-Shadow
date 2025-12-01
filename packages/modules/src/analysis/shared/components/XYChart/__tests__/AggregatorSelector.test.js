import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/AthleteProfile/redux/slices/athleteProfileSlice';
import useChartContext from '../hooks/useChartContext';
import { SERIES_TYPES, AGGREGATE_PERIOD, AGGREGATE_METHOD } from '../constants';
import AggregatorSelector from '../components/AggregatorSelector';

jest.mock('../hooks/useChartContext');

describe('analysis shared|AggregatorSelector', () => {
  const props = {
    t: i18nextTranslateStub(),
  };

  const renderComponent = () => {
    const { mockedStore } = renderWithRedux(<AggregatorSelector {...props} />, {
      useGlobalStore: false,
      preloadedState: {
        [REDUCER_KEY]: initialState,
      },
    });

    return mockedStore;
  };

  describe('when series attributes are undefined', () => {
    it('returns null when a series is not defined', () => {
      useChartContext.mockReturnValueOnce({ series: {} });

      renderComponent();

      expect(
        screen.queryByTestId('XYChart|AggregatorSelector')
      ).not.toBeInTheDocument();
    });

    it('returns null when showAggregatorSelector is not defined', () => {
      useChartContext.mockReturnValueOnce({
        series: {
          '123_0': {
            valueAccessor: jest.fn(),
            valueFormatter: jest.fn(),
            categoryAccessor: jest.fn(),
            data: [],
            type: SERIES_TYPES.line,
            aggregateValues: {
              aggregatePeriod: AGGREGATE_PERIOD.daily,
              aggregateMethod: AGGREGATE_METHOD.sum,
            },
            onChangeAggregatePeriod: jest.fn(),
          },
        },
      });
      renderComponent();

      expect(
        screen.queryByTestId('XYChart|AggregatorSelector')
      ).not.toBeInTheDocument();
    });

    it('returns null when aggregateValues is not defined', () => {
      useChartContext.mockReturnValueOnce({
        series: {
          '123_0': {
            valueAccessor: jest.fn(),
            valueFormatter: jest.fn(),
            categoryAccessor: jest.fn(),
            data: [],
            type: SERIES_TYPES.line,
            onChangeAggregatePeriod: jest.fn(),
            showAggregatorSelector: true,
          },
        },
      });

      renderComponent();

      expect(
        screen.queryByTestId('XYChart|AggregatorSelector')
      ).not.toBeInTheDocument();
    });

    it('returns null when onChangeAggregatePeriod is not defined', () => {
      useChartContext.mockReturnValueOnce({
        series: {
          '123_0': {
            valueAccessor: jest.fn(),
            valueFormatter: jest.fn(),
            categoryAccessor: jest.fn(),
            data: [],
            type: SERIES_TYPES.line,
            aggregateValues: {
              aggregatePeriod: AGGREGATE_PERIOD.daily,
              aggregateMethod: AGGREGATE_METHOD.sum,
            },
            showAggregatorSelector: true,
          },
        },
      });

      renderComponent();

      expect(
        screen.queryByTestId('XYChart|AggregatorSelector')
      ).not.toBeInTheDocument();
    });
  });

  describe('when series attributes are defined', () => {
    const mockOnChangeAggregationPeriod = jest.fn();

    beforeEach(() => {
      useChartContext.mockReturnValue({
        series: {
          '123_0': {
            valueAccessor: () => {},
            valueFormatter: () => {},
            categoryAccessor: () => {},
            data: [],
            type: SERIES_TYPES.line,
            aggregateValues: {
              aggregatePeriod: AGGREGATE_PERIOD.daily,
              aggregateMethod: AGGREGATE_METHOD.sum,
            },
            showAggregatorSelector: true,
            onChangeAggregatePeriod: mockOnChangeAggregationPeriod,
          },
        },
      });
    });

    it('renders the AggregateSelector', () => {
      renderComponent();

      expect(
        screen.getByTestId('XYChart|AggregatorSelector')
      ).toBeInTheDocument();
    });

    it('renders the correct label for the aggregatePeriod', () => {
      renderComponent();

      expect(screen.getByText('View Daily')).toBeInTheDocument();
    });

    it('renders the correct aggregate periods options', async () => {
      const user = userEvent.setup();

      renderComponent();

      await user.click(screen.getByText('View Daily'));

      expect(screen.getByText('Weekly')).toBeInTheDocument();
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    it('calls onChangeAggregatePeriod when user selects a new period', async () => {
      const user = userEvent.setup();

      renderComponent();

      await user.click(screen.getByText('View Daily'));

      await user.click(screen.getByText('Weekly'));

      expect(mockOnChangeAggregationPeriod).toHaveBeenCalledWith({
        aggregation_period: AGGREGATE_PERIOD.weekly,
      });
    });
  });
});
