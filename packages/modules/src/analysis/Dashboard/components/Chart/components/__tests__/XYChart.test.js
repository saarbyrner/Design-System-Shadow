import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { colors } from '@kitman/common/src/variables';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { useUpdateChartWidgetMutation } from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import {
  AGGREGATE_METHOD,
  AGGREGATE_PERIOD,
} from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
// eslint-disable-next-line jest/no-mocks-import
import {
  MOCK_CHART_ELEMENTS,
  generateChartWidgetData,
} from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import XYChart from '../XYChart';

jest.mock('@visx/responsive', () => ({
  ...jest.requireActual('@visx/responsive'),
  ParentSize: (props) => props.children({ width: 1000, height: 1000 }),
}));

jest.mock('@kitman/common/src/contexts/OrganisationContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/OrganisationContext'),
  useOrganisation: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder'
    ),
    useUpdateChartWidgetMutation: jest.fn().mockReturnValue([
      jest.fn().mockImplementation(() => ({
        unwrap: () => Promise.resolve({}),
      })),
    ]),
  })
);

// Temporary: Mock BackgroundZone component to avoid visx DataContext issues when testing
jest.mock(
  '@kitman/modules/src/analysis/shared/components/XYChart/components/BackgroundZone',
  () => () => <rect data-testid="XY|background-zone-rect" />
);

// Mock ReferenceLine to assert conditional formatting rendering without relying on visx internals
jest.mock(
  '@kitman/modules/src/analysis/shared/components/XYChart/components/ReferenceLine',
  () => () => <g data-testid="XY|reference-line" />
);

describe('analysis dashboard | <XYChart />', () => {
  const widget = generateChartWidgetData({
    widget: {
      id: '1',
      name: 'Widget Name',
      chart_id: '123',
      chart_type: 'xy',
      chart_elements: [MOCK_CHART_ELEMENTS[0]],
    },
  });
  const props = {
    t: i18nextTranslateStub(),
    isEmpty: false,
    isLoading: false,
    data: [],
    chartElements: [MOCK_CHART_ELEMENTS[0]],
    widgetData: widget,
  };

  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => {
      // Mocking this to suppress error thrown by HTMLCanvasElement not being supported
      // in browser
      return {}; // Return a mock context object
    });
  });

  beforeEach(() => {
    useOrganisation.mockReturnValue({
      organisation: {
        locale: 'en-GB',
      },
    });
  });

  afterAll(() => {
    window.featureFlags = {};
  });

  it('renders a loading state in level one by default when loading', () => {
    renderWithStore(
      <XYChart {...props} isLoading />,
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

  it('renders a loading state in level 2 when for longer loads', () => {
    renderWithStore(
      <XYChart {...props} isLoading />,
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

  it('renders empty state when isEmpty is true', () => {
    renderWithStore(<XYChart {...props} isEmpty />);

    expect(screen.getByText('Nothing to see yet')).toBeInTheDocument();
    expect(
      screen.getByText('A data type and time period is required')
    ).toBeInTheDocument();
  });

  it('renders data in category chart when available', () => {
    renderWithStore(
      <XYChart
        {...props}
        data={[
          {
            id: 123,
            chart: [
              { label: 'Data Label 1', value: '123' },
              { label: 'Data Label 2', value: '123' },
            ],
            metadata: {},
          },
        ]}
      />
    );

    expect(screen.getByText('Data Label 1')).toBeInTheDocument();
    expect(screen.getByText('Data Label 2')).toBeInTheDocument();
  });

  it('renders data in longitudinal chart when available', () => {
    renderWithStore(
      <XYChart
        {...props}
        data={[
          {
            id: 123,
            chart: [{ label: '2024-05-22', value: '20' }],
            config: {
              aggregation_period: AGGREGATE_PERIOD.daily,
            },
            metadata: {
              aggregation_method: AGGREGATE_METHOD.sum,
            },
          },
        ]}
        chartElements={[
          {
            ...MOCK_CHART_ELEMENTS,
            config: {
              groupings: ['timestamp'],
              render_options: {
                type: 'line',
              },
            },
          },
        ]}
      />
    );

    expect(screen.getByText('Wed 22 May')).toBeInTheDocument();
  });

  it('renders data in longitudinal chart when available, correctly formatted for org locale', () => {
    useOrganisation.mockReturnValue({
      organisation: {
        locale: 'en-US',
      },
    });

    renderWithStore(
      <XYChart
        {...props}
        data={[
          {
            id: 123,
            chart: [{ label: '2024-05-22', value: '20' }],
            config: {
              aggregation_period: AGGREGATE_PERIOD.daily,
            },
            metadata: {
              aggregation_method: AGGREGATE_METHOD.sum,
            },
          },
        ]}
        chartElements={[
          {
            ...MOCK_CHART_ELEMENTS,
            config: {
              groupings: ['timestamp'],
              render_options: {
                type: 'line',
              },
            },
          },
        ]}
      />
    );

    expect(screen.getByText('Wed, May 22')).toBeInTheDocument();
  });

  it('does not render data in longitudinal chart when available but loading new data', () => {
    renderWithStore(
      <XYChart
        {...props}
        isLoading
        data={[
          {
            id: 123,
            chart: [
              { label: '2024-05-21', value: '12' },
              { label: '2024-05-22', value: '20' },
            ],
            metadata: {
              aggregation_method: AGGREGATE_METHOD.sum,
            },
          },
        ]}
        chartElements={[
          {
            ...MOCK_CHART_ELEMENTS,
            config: {
              groupings: ['timestamp'],
              render_options: {
                type: 'line',
              },
            },
          },
        ]}
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
    expect(screen.queryByText('Tue 21 May')).not.toBeInTheDocument();
    expect(screen.queryByText('Wed 22 May')).not.toBeInTheDocument();
  });

  it('renders no data state when there is no data in the chart for one data source', () => {
    renderWithStore(
      <XYChart
        {...props}
        data={[
          {
            id: 123,
            chart: [],
            metadata: {},
          },
        ]}
      />
    );

    expect(
      screen.getByText('No data for selected parameters')
    ).toBeInTheDocument();
  });

  it('renders no data state when there is no data in the chart for more than one data source', () => {
    renderWithStore(
      <XYChart
        {...props}
        data={[
          { id: '123', chart: [], metadata: {} },
          { id: '123', chart: [], metadata: {} },
        ]}
      />
    );

    expect(
      screen.getByText('No data for selected parameters')
    ).toBeInTheDocument();
  });

  it('does not render the no data message when at least one data source returns chart data', () => {
    renderWithStore(
      <XYChart
        {...props}
        data={[
          { id: '123', chart: [] },
          { id: '123', chart: [{ label: 'label', value: '55' }] },
        ]}
      />
    );
    expect(
      screen.queryByText('No data for selected parameters')
    ).not.toBeInTheDocument();
  });

  describe('when widget is in edit mode', () => {
    const renderComponent = () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 1,
              chart: [
                { label: '2024-05-02', value: '20' },
                { label: '2024-05-22', value: '20' },
              ],
              config: {
                aggregation_period: AGGREGATE_PERIOD.daily,
              },
              metadata: {
                aggregation_method: AGGREGATE_METHOD.sum,
              },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  type: 'line',
                },
              },
            },
          ]}
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
              },
            },
          },
        }
      );
    };

    it('renders the aggregator selector with the correct options', async () => {
      const user = userEvent.setup();
      renderComponent();

      expect(screen.getByText('View Daily')).toBeInTheDocument();
      // click on aggregator selector
      await user.click(screen.getByText('View Daily'));

      expect(screen.getByText('Weekly')).toBeInTheDocument();
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });

    it('aggregates the data by the users selection instead of the backend response', async () => {
      // backend response is defined in data[0].config in the renderComponent - daily
      // user  response is defined in the chartBuilderSlice - monthly

      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 1,
              chart: [
                { label: '2024-05-02', value: '20' },
                { label: '2024-05-22', value: '20' },
              ],
              config: {
                aggregation_period: AGGREGATE_PERIOD.daily,
              },
              metadata: {
                aggregation_method: AGGREGATE_METHOD.sum,
              },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  type: 'line',
                },
              },
            },
          ]}
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
              },
            },
            123: {
              config: {
                aggregation_period: 'monthly',
              },
            },
          },
        }
      );

      expect(screen.getByText('View Monthly')).toBeInTheDocument();
      // data aggregated by month
      expect(screen.getByText('May')).toBeInTheDocument();
    });

    it('defaults to daily when there is no user selection or backend response for aggregation_period', async () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 1,
              chart: [
                { label: '2024-05-21', value: '20' },
                { label: '2024-05-22', value: '20' },
              ],
              config: {},
              metadata: {
                aggregation_method: AGGREGATE_METHOD.sum,
              },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  type: 'line',
                },
              },
            },
          ]}
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
              },
            },
          },
        }
      );

      expect(screen.getByText('View Daily')).toBeInTheDocument();
      expect(screen.getByText('Tue 21 May')).toBeInTheDocument();
      expect(screen.getByText('Wed 22 May')).toBeInTheDocument();
    });

    it('calls updateChartWidget endpoint to change the aggregation_period', async () => {
      const user = userEvent.setup();
      const [updateChartWidget] = useUpdateChartWidgetMutation();

      renderComponent();
      // click aggregator selector
      await user.click(screen.getByText('View Daily'));
      // change aggregation period
      await user.click(screen.getByText('Monthly'));

      expect(updateChartWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          widget: expect.objectContaining({
            config: { aggregation_period: AGGREGATE_PERIOD.monthly },
          }),
        })
      );
    });

    it('calls updateChartWidget with the expected chart_id', async () => {
      const user = userEvent.setup();
      const [updateChartWidget] = useUpdateChartWidgetMutation();

      renderComponent();
      await user.click(screen.getByText('View Daily'));
      await user.click(screen.getByText('Weekly'));

      expect(updateChartWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          widget: expect.objectContaining({
            config: { aggregation_period: AGGREGATE_PERIOD.weekly },
            chart_id: '123',
          }),
        })
      );
    });
  });

  describe('when widget is not in edit mode', () => {
    it('does not render the aggregator selector', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 123,
              chart: [
                { label: '2024-05-02', value: '20' },
                { label: '2024-05-22', value: '20' },
              ],
              config: {
                aggregation_period: AGGREGATE_PERIOD.daily,
              },
              metadata: {
                aggregation_method: AGGREGATE_METHOD.sum,
              },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  type: 'line',
                },
              },
            },
          ]}
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            // no active widgets are in edit mode
          },
        }
      );

      expect(screen.queryByText('View Daily')).not.toBeInTheDocument();
    });
  });

  describe('stacked bar chart', () => {
    it('renders a summary stack bar chart when chartElements groupings.length > 1', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 123,
              chart: [
                {
                  label: 'label 1',
                  values: [
                    {
                      label: 'Series 1',
                      value: 123,
                    },
                    {
                      label: 'Series 2',
                      value: 456,
                    },
                  ],
                },
                {
                  label: 'label 2',
                  values: [
                    {
                      label: 'Series 1',
                      value: 123,
                    },
                    {
                      label: 'Series 2',
                      value: 456,
                    },
                  ],
                },
              ],
              metadata: {},
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                ...MOCK_CHART_ELEMENTS[0].config,
                groupings: ['athlete_id', 'squad'],
              },
            },
          ]}
        />
      );

      expect(screen.getByText('label 1')).toBeInTheDocument();
      expect(screen.getByText('label 2')).toBeInTheDocument();
    });
  });

  describe('legends', () => {
    it('renders the legends', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 123,
              chart: [
                {
                  label: 'label 1',
                  values: [
                    {
                      label: 'Series 1',
                      value: 123,
                    },
                    {
                      label: 'Series 2',
                      value: 456,
                    },
                  ],
                },
                {
                  label: 'label 2',
                  values: [
                    {
                      label: 'Series 1',
                      value: 123,
                    },
                    {
                      label: 'Series 2',
                      value: 456,
                    },
                    {
                      label: 'Series 3',
                      value: 789,
                    },
                  ],
                },
              ],
              metadata: {},
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                ...MOCK_CHART_ELEMENTS[0].config,
                groupings: ['athlete_id', 'squad'],
              },
            },
          ]}
        />
      );
      // id follows the structure: Chart|Legend-{chart_id}_{chartElement_index}-{groupedDataName}
      expect(screen.getByTestId('Chart|Legend-123_0-Series 1')).toBeVisible();
      expect(screen.getByTestId('Chart|Legend-123_0-Series 2')).toBeVisible();
      expect(screen.getByTestId('Chart|Legend-123_0-Series 3')).toBeVisible();
    });

    it('handles the legend onClick', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 123,
              chart: [
                {
                  label: 'label 1',
                  values: [
                    {
                      label: 'Series 1',
                      value: 123,
                    },
                    {
                      label: 'Series 2',
                      value: 456,
                    },
                  ],
                },
                {
                  label: 'label 2',
                  values: [
                    {
                      label: 'Series 1',
                      value: 123,
                    },
                    {
                      label: 'Series 2',
                      value: 456,
                    },
                    {
                      label: 'Series 3',
                      value: 789,
                    },
                  ],
                },
              ],
              metadata: {},
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                ...MOCK_CHART_ELEMENTS[0].config,
                groupings: ['athlete_id', 'squad'],
              },
            },
          ]}
        />
      );

      const legend1 = screen.getByTestId('Chart|Legend-123_0-Series 1');

      await user.click(legend1);

      expect(screen.getByTestId('Chart|Legend-123_0-Series 1')).toHaveStyle({
        opacity: '0.5',
      });
      expect(screen.getByTestId('Chart|Legend-123_0-Series 2')).not.toHaveStyle(
        {
          opacity: '0.5',
        }
      );
      expect(screen.getByTestId('Chart|Legend-123_0-Series 3')).not.toHaveStyle(
        {
          opacity: '0.5',
        }
      );
    });
  });

  describe('multi series chart', () => {
    it('renders two series on an XY chart', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 123,
              chart: [
                {
                  label: 'Label A',
                  value: 123,
                },
                {
                  label: 'Label B',
                  value: 456,
                },
              ],
              metadata: {},
            },
            {
              id: 123,
              chart: [
                {
                  label: 'Label B',
                  value: 789,
                },
                {
                  label: 'Label C',
                  value: 456,
                },
              ],
              metadata: {},
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                ...MOCK_CHART_ELEMENTS[0].config,
                groupings: ['athlete_id'],
              },
            },
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                ...MOCK_CHART_ELEMENTS[0].config,
                groupings: ['athlete_id'],
              },
            },
          ]}
        />
      );

      expect(screen.getByText('Label A')).toBeInTheDocument(); // Series 1
      expect(screen.getByText('Label B')).toBeInTheDocument(); // Series 1 & 2
      expect(screen.getByText('Label C')).toBeInTheDocument(); // Series 2
    });
  });

  describe('grouped line chart', () => {
    it('renders a grouped line chart when chartElements groupings.length > 1', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 123,
              chart: [
                {
                  label: 'athlete 1',
                  values: [
                    {
                      label: 'squad 1',
                      value: 123,
                    },
                    {
                      label: 'squad 2',
                      value: 456,
                    },
                  ],
                },
                {
                  label: 'athlete 2',
                  values: [
                    {
                      label: 'squad 1',
                      value: 123,
                    },
                    {
                      label: 'squad 2',
                      value: 456,
                    },
                  ],
                },
                {
                  label: 'athlete 3',
                  values: [
                    {
                      label: 'squad 2',
                      value: 456,
                    },
                  ],
                },
              ],
              metadata: {},
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                ...MOCK_CHART_ELEMENTS[0].config,
                groupings: ['athlete_id', 'squad'],
                render_options: {
                  name: 'New Chart Element',
                  type: 'line',
                },
              },
            },
          ]}
        />
      );
      // labels on the axis
      expect(screen.getByText('athlete 1')).toBeInTheDocument();
      expect(screen.getByText('athlete 2')).toBeInTheDocument();
      expect(screen.getByText('athlete 3')).toBeInTheDocument();
      // legends
      expect(screen.getByTestId('Chart|Legend-123_0-squad 1')).toBeVisible();
      expect(screen.getByTestId('Chart|Legend-123_0-squad 2')).toBeVisible();
    });
  });

  describe('Sort Selector', () => {
    const renderComponent = (grouping, activeWidgetId) => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 1,
              chart: [
                { label: '2024-05-02', value: '20' },
                { label: '2024-05-22', value: '20' },
              ],
              config: {
                aggregation_period: AGGREGATE_PERIOD.daily,
              },
              metadata: {
                aggregation_method: AGGREGATE_METHOD.sum,
              },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: [grouping],
                render_options: {
                  type: 'line',
                },
              },
            },
          ]}
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              [activeWidgetId]: {
                ...widget,
              },
            },
          },
        }
      );
    };

    it('should not be rendered if chart is longitudinal', () => {
      renderComponent('timestamp', 1);
      expect(
        screen.queryByTestId('XYChart|SortSelector')
      ).not.toBeInTheDocument();
    });

    it('should not be rendered if chart is not in edit mode', () => {
      renderComponent('athlete_id', 2);
      expect(
        screen.queryByTestId('XYChart|SortSelector')
      ).not.toBeInTheDocument();
    });
  });

  describe('Conditional formatting - background zones', () => {
    it('does not render a background zone when there are no zones in the chart element config', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 1,
              chart: [
                { label: '2024-05-02', value: '20' },
                { label: '2024-05-22', value: '20' },
              ],
              config: {
                aggregation_period: AGGREGATE_PERIOD.daily,
              },
              metadata: {
                aggregation_method: AGGREGATE_METHOD.sum,
              },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
            },
          ]}
        />,
        {},
        {}
      );

      expect(
        screen.queryByTestId('XY|background-zone-rect')
      ).not.toBeInTheDocument();
    });

    it('renders a background zone when a zone is configured in the chart element config', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 123,
              chart: [{ label: '2024-05-22', value: '20' }],
              config: {
                aggregation_period: AGGREGATE_PERIOD.daily,
              },
              metadata: {
                aggregation_method: AGGREGATE_METHOD.sum,
              },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS,
              config: {
                groupings: ['timestamp'],
                render_options: {
                  type: 'bar',
                  name: 'Minutes (Training Session) (mins)',
                  conditional_formatting: [
                    {
                      type: 'zone',
                      condition: 'less_than',
                      value: '60',
                      color: colors.red_100,
                      label: 'Low performance',
                    },
                  ],
                },
              },
            },
          ]}
        />
      );

      expect(screen.getByTestId('XY|background-zone-rect')).toBeInTheDocument();
    });
  });

  describe('Conditional formatting - reference lines', () => {
    it('does not render a reference line when there are none configured', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 1,
              chart: [
                { label: '2024-05-02', value: '20' },
                { label: '2024-05-22', value: '30' },
              ],
              config: { aggregation_period: AGGREGATE_PERIOD.daily },
              metadata: { aggregation_method: AGGREGATE_METHOD.sum },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  type: 'line',
                  // no conditional_formatting
                },
              },
            },
          ]}
        />
      );
      expect(screen.queryByTestId('XY|reference-line')).not.toBeInTheDocument();
    });

    it('renders a reference line when a reference_line rule is configured', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 1,
              chart: [
                { label: '2024-05-02', value: '20' },
                { label: '2024-05-22', value: '30' },
              ],
              config: { aggregation_period: AGGREGATE_PERIOD.daily },
              metadata: { aggregation_method: AGGREGATE_METHOD.sum },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  type: 'line',
                  conditional_formatting: [
                    {
                      type: 'reference_line',
                      condition: 'equal_to',
                      value: '25',
                      color: colors.blue_100,
                      textDisplay: 'Target',
                    },
                  ],
                },
              },
            },
          ]}
        />
      );
      expect(screen.getByTestId('XY|reference-line')).toBeInTheDocument();
    });

    it('renders multiple reference lines when multiple rules are configured', () => {
      renderWithStore(
        <XYChart
          {...props}
          data={[
            {
              id: 1,
              chart: [
                { label: '2024-05-02', value: '20' },
                { label: '2024-05-22', value: '80' },
              ],
              config: { aggregation_period: AGGREGATE_PERIOD.daily },
              metadata: { aggregation_method: AGGREGATE_METHOD.sum },
            },
          ]}
          chartElements={[
            {
              ...MOCK_CHART_ELEMENTS[0],
              config: {
                groupings: ['timestamp'],
                render_options: {
                  type: 'line',
                  conditional_formatting: [
                    {
                      type: 'reference_line',
                      condition: 'equal_to',
                      value: '25',
                      color: colors.blue_100,
                      textDisplay: 'Lower Target',
                    },
                    {
                      type: 'reference_line',
                      condition: 'equal_to',
                      value: '70',
                      color: colors.green_100,
                      textDisplay: 'Upper Target',
                    },
                  ],
                },
              },
            },
          ]}
        />
      );
      const refs = screen.getAllByTestId('XY|reference-line');
      expect(refs).toHaveLength(2);
    });
  });
});
