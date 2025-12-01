import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import useElementVisibilityTracker from '@kitman/common/src/hooks/useElementVisibilityTracker';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  REDUCER_KEY,
  initialState,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { editWidgetSuccess } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import * as ChartBuilderApi from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import ChartWidget from '..';

jest.mock('@kitman/common/src/hooks/useElementVisibilityTracker');

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder'
    ),
    useUpdateChartWidgetMutation: jest.fn().mockReturnValue([jest.fn()]),
  })
);

describe('ChartWidget', () => {
  const props = {
    t: i18nextTranslateStub(),
    widgetData: {
      id: 123,
      widget: {
        name: 'New Chart',
        chart_type: 'xy',
        chart_elements: [],
      },
      widget_type: 'chart',
    },
    pivotData: {},
  };

  const { ResizeObserver } = window;
  const mockDispatch = jest.fn();
  const updateChartWidget = jest.fn();

  beforeEach(() => {
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 600,
    }));

    jest
      .spyOn(ChartBuilderApi, 'useUpdateChartWidgetMutation')
      .mockReturnValue([updateChartWidget]);

    jest
      .spyOn(jest.requireActual('react-redux'), 'useDispatch')
      .mockReturnValue(mockDispatch);

    updateChartWidget.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          container_widget: {
            id: 123,
          },
        }),
    });

    useElementVisibilityTracker.mockReturnValue([
      { current: null },
      { hasBeenVisible: true },
    ]);
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.clearAllMocks();
  });

  it('displays an input when clicking the title and calls the onChangeWidgetName callback when changed', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <ChartWidget {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          activeWidgets: {
            123: {
              ...props.widgetData,
            },
          },
        },
      }
    );

    await user.click(screen.getByText(props.widgetData.widget.name));

    const input = screen.queryByDisplayValue(props.widgetData.widget.name);

    expect(input).toBeInTheDocument();

    await user.type(input, ' with change{enter}');

    expect(updateChartWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        widget: expect.objectContaining({
          name: `${props.widgetData.widget.name} with change`,
        }),
      })
    );
  });

  describe('when in edit mode', () => {
    it('renders <ChartBuilder />', () => {
      renderWithStore(
        <ChartWidget {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              123: {
                ...props.widgetData,
              },
            },
          },
        }
      );

      const addDataButton = screen.getByText('Add data');

      expect(addDataButton).toBeVisible();
    });

    it('calls editWidgetSuccess after updating widget config', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <ChartWidget {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              123: {
                ...props.widgetData,
                widget: {
                  ...props.widgetData.widget,
                  config: { show_labels: true },
                },
              },
            },
          },
        }
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(updateChartWidget).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(editWidgetSuccess({ id: 123 }));
    });
  });

  describe('when not in edit mode', () => {
    it('renders <Chart />', () => {
      renderWithStore(
        <ChartWidget {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
          },
        }
      );

      const chartTitle = screen.getByText('New Chart');

      expect(chartTitle).toBeVisible();
    });
  });

  describe('when the user is not Dashboard Manager', () => {
    it('renders <Chart /> and hide Menu Icon', () => {
      renderWithStore(
        <ChartWidget {...props} isDashboardManager={false} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
          },
        }
      );

      const widgetMenu = screen.queryByLabelText('New Chart Menu Icon');

      expect(widgetMenu).not.toBeInTheDocument();
    });
  });

  describe('when the user is Dashboard Manager', () => {
    it('renders <Chart /> and show Menu Icon', () => {
      renderWithStore(
        <ChartWidget {...props} isDashboardManager />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
          },
        }
      );

      const widgetMenu = screen.getByLabelText('New Chart Menu Icon');

      expect(widgetMenu).toBeInTheDocument();
    });
  });

  describe('chart name', () => {
    it('renders the chart name correctly when it includes %', () => {
      renderWithStore(
        <ChartWidget
          {...props}
          widgetData={{
            id: 123,
            widget: {
              name: '%25 Difference - Sum',
              chart_type: 'value',
              chart_elements: [],
            },
            widget_type: 'chart',
          }}
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
          },
        }
      );

      expect(screen.getByText('% Difference - Sum')).toBeVisible();
      expect(
        screen.queryByText('%25 Difference - Sum')
      ).not.toBeInTheDocument();
    });
  });

  describe('data labels', () => {
    it('renders data labels when widget is an xy chart', () => {
      renderWithStore(
        <ChartWidget {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              123: {
                ...props.widgetData,
              },
            },
          },
        }
      );

      expect(screen.getByText('Data labels')).toBeVisible();
    });

    it('does not render data labels when widget is a value vis', () => {
      const valueWidgetData = {
        id: 123,
        widget: {
          name: 'New Chart',
          chart_type: 'value',
          chart_elements: [],
        },
        widget_type: 'chart',
      };
      renderWithStore(
        <ChartWidget {...props} widgetData={valueWidgetData} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              123: {
                ...valueWidgetData,
              },
            },
          },
        }
      );

      expect(screen.queryByText('Data labels')).not.toBeInTheDocument();
    });
  });

  describe('chart options', () => {
    it('renders the chart options when widget is an xy chart', () => {
      renderWithStore(
        <ChartWidget {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              123: {
                ...props.widgetData,
              },
            },
          },
        }
      );

      expect(screen.getByText('Chart Options')).toBeVisible();
    });

    it('renders the chart options when widget is an pie chart', () => {
      const pieProps = {
        t: i18nextTranslateStub(),
        widgetData: {
          id: 123,
          widget: {
            name: 'New Chart',
            chart_type: 'pie',
            chart_elements: [],
          },
          widget_type: 'chart',
        },
        pivotData: {},
      };

      renderWithStore(
        <ChartWidget {...pieProps} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              123: {
                ...props.widgetData,
              },
            },
          },
        }
      );

      expect(screen.getByText('Chart Options')).toBeVisible();
    });

    it('does not render chart options when widget is a value vis', () => {
      const valueWidgetData = {
        id: 123,
        widget: {
          name: 'New Chart',
          chart_type: 'value',
          chart_elements: [],
        },
        widget_type: 'chart',
      };
      renderWithStore(
        <ChartWidget {...props} widgetData={valueWidgetData} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              123: {
                ...valueWidgetData,
              },
            },
          },
        }
      );

      expect(screen.queryByText('Chart Options')).not.toBeInTheDocument();
    });
  });
});
