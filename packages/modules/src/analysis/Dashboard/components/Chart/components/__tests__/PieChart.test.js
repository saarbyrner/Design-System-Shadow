import { screen } from '@testing-library/react';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { getOtherSegementLabel } from '@kitman/modules/src/analysis/shared/components/PieChart/constants';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
// eslint-disable-next-line jest/no-mocks-import
import {
  generateChartWidgetData,
  MOCK_PIE_CHART_ELEMENTS,
  MOCK_LARGE_PIE_DATA_SET,
} from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import PieChart from '../PieChart';

// This mocks the ParentSize used in PieCharts to get widget/height
jest.mock('@visx/responsive', () => ({
  ParentSize: jest.fn(({ children }) => {
    const mockWidth = 800;
    const mockHeight = 500;
    return children({
      width: mockWidth,
      height: mockHeight,
    });
  }),
}));

describe('analysis dashboard | <PieChart />', () => {
  // need to mock ResizeObserve which listens to changes in
  const { ResizeObserver } = window;

  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 600,
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
  });

  const widget = generateChartWidgetData({
    widget: {
      id: '1',
      name: 'Widget Name',
      chart_id: '1',
      chart_type: 'pie',
      chart_elements: MOCK_PIE_CHART_ELEMENTS,
    },
  });

  const mockPieData = [
    { label: 'International Squad', value: '1500' },
    { label: 'Academy Squad', value: '2400' },
    { label: 'U16 Squad', value: '900' },
  ];

  const mockData = [{ id: 1, chart: mockPieData, metaData: {}, config: {} }];

  const props = {
    t: i18nextTranslateStub(),
    isEmpty: false,
    isLoading: false,
    data: mockData,
    chartElements: widget.widget.chart_elements,
    widgetData: widget,
  };

  it('renders the empty state when no data has been selected', () => {
    renderWithStore(
      <PieChart {...props} data={[]} chartElements={[]} isEmpty />
    );

    expect(screen.getByText('Nothing to see yet')).toBeVisible();
    expect(screen.getByText('Add a data type')).toBeVisible();
  });

  it('renders the no data state when no data has been returned', () => {
    renderWithStore(
      <PieChart {...props} data={[]} chartElements={MOCK_PIE_CHART_ELEMENTS} />
    );

    expect(screen.getByText('No data for parameters')).toBeVisible();
  });

  it('renders the initial loading state level one when loading', () => {
    renderWithStore(
      <PieChart
        {...props}
        isLoading
        data={[]}
        chartElements={MOCK_PIE_CHART_ELEMENTS}
      />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          loaderLevelMap: {
            [props.widgetData.id]: 1,
          },
        },
      }
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(
      screen.queryByTestId('AnimatedCalculateLoader')
    ).not.toBeInTheDocument();
  });

  it('renders a loading state in level 2 for longer loads', () => {
    renderWithStore(
      <PieChart
        {...props}
        isLoading
        data={[]}
        chartElements={MOCK_PIE_CHART_ELEMENTS}
      />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          loaderLevelMap: {
            [props.widgetData.id]: 2,
          },
        },
      }
    );

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByTestId('AnimatedCalculateLoader')).toBeInTheDocument();
  });

  it('renders the pie chart with labels and legends when data has loaded', () => {
    renderWithStore(<PieChart {...props} />);

    mockPieData.forEach(({ label }) => {
      const labels = screen.getAllByText(label);
      labels.forEach((item) => {
        expect(item).toBeVisible();
      });
    });
  });

  it('does not render data in the pie chart when available but loading new data', () => {
    renderWithStore(
      <PieChart {...props} isLoading />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          loaderLevelMap: {
            [props.widgetData.id]: 1,
          },
        },
      }
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    mockPieData.forEach(({ label }) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
  });

  it('renders the pie chart data with Other Categories segment', () => {
    renderWithStore(
      <PieChart {...props} data={[{ id: 1, chart: MOCK_LARGE_PIE_DATA_SET }]} />
    );

    expect(screen.getByText('Openside Flanker')).toBeVisible();
    expect(screen.getByText('Blindside Flanker')).toBeVisible();
    expect(screen.getByText('Wing')).toBeVisible();
    expect(screen.getByText('Loose-head Prop')).toBeVisible();
    expect(screen.getByText('Tight-head Prop')).toBeVisible();
    expect(screen.getByText('Hooker')).toBeVisible();
    expect(screen.getByText('Inside Center')).toBeVisible();
    expect(screen.getByText('No 8')).toBeVisible();
    expect(screen.getByText('Other')).toBeVisible();
    // data is grouped into Other categories segment
    expect(screen.queryByText('Out Half')).not.toBeInTheDocument();
    expect(screen.queryByText('Fullback')).not.toBeInTheDocument();
    // other categories
    expect(screen.getByText(getOtherSegementLabel())).toBeVisible();
  });

  describe('chart options', () => {
    const getChartOptions = (chartOptionKey, value) => {
      return {
        chartOptions: {
          [chartOptionKey]: value,
        },
      };
    };

    it('renders labels by default', () => {
      renderWithStore(<PieChart {...props} />);
      mockPieData.forEach(({ label }) => {
        expect(screen.queryByText(label)).toBeInTheDocument();
      });
    });

    it('does not render labels when show_label = false', () => {
      const chartOptionKey = 'show_label';
      renderWithStore(
        <PieChart
          {...props}
          data={[
            {
              ...mockData[0],
              config: getChartOptions(chartOptionKey, false),
            },
          ]}
        />
      );
      mockPieData.forEach(({ label }) => {
        expect(screen.queryByText(label)).not.toBeInTheDocument();
      });
    });

    it('renders values only when show_values = true', () => {
      const chartOptionKey = 'show_values';
      renderWithStore(
        <PieChart
          {...props}
          data={[
            { ...mockData[0], config: getChartOptions(chartOptionKey, true) },
          ]}
        />
      );
      mockPieData.forEach(({ value }) => {
        expect(screen.queryByText(value)).toBeInTheDocument();
      });
    });

    it('does not render values when show_values = false', () => {
      const chartOptionKey = 'show_values';
      renderWithStore(
        <PieChart
          {...props}
          data={[
            { ...mockData[0], config: getChartOptions(chartOptionKey, false) },
          ]}
        />
      );
      mockPieData.forEach(({ value }) => {
        expect(screen.queryByText(value)).not.toBeInTheDocument();
      });
    });

    it('renders percentages only when show_percentage = true', () => {
      const chartOptionKey = 'show_percentage';
      renderWithStore(
        <PieChart
          {...props}
          data={[
            { ...mockData[0], config: getChartOptions(chartOptionKey, true) },
          ]}
        />
      );
      expect(screen.queryByText('31%')).toBeInTheDocument();
      expect(screen.queryByText('50%')).toBeInTheDocument();
      expect(screen.queryByText('19%')).toBeInTheDocument();
    });

    it('does not render percentages when show_percentage = false', () => {
      const chartOptionKey = 'show_percentage';
      renderWithStore(
        <PieChart
          {...props}
          data={[
            { ...mockData[0], config: getChartOptions(chartOptionKey, false) },
          ]}
        />
      );
      expect(screen.queryByText('31%')).not.toBeInTheDocument();
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
      expect(screen.queryByText('19%')).not.toBeInTheDocument();
    });

    it('renders chart options based on user selection', () => {
      renderWithStore(
        <PieChart {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            [widget.widget.chart_id]: {
              config: {
                chartOptions: {
                  ...getChartOptions('show_values', true).chartOptions,
                  ...getChartOptions('show_label', false).chartOptions,
                },
              },
            },
          },
        }
      );
      mockPieData.forEach(({ label, value }) => {
        expect(screen.queryByText(value)).toBeInTheDocument();
        expect(screen.queryByText(label)).not.toBeInTheDocument();
      });
    });
  });
});
