import ResizeObserverPolyfill from 'resize-observer-polyfill';
import useElementVisibilityTracker from '@kitman/common/src/hooks/useElementVisibilityTracker';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { screen, waitFor } from '@testing-library/react';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { data } from '@kitman/services/src/mocks/handlers/analysis/getData';
// eslint-disable-next-line jest/no-mocks-import
import {
  generateChartWidgetData,
  generateChartWidget,
  generateChartElement,
} from '../../../redux/__mocks__/chartBuilder';
import Chart from '..';

jest.mock('@kitman/common/src/hooks/useElementVisibilityTracker');

describe('analysis dashboard | <Chart />', () => {
  const { ResizeObserver } = window;

  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 1000,
      height: 600,
    }));

    useElementVisibilityTracker.mockReturnValue([
      { current: null },
      { hasBeenVisible: true },
    ]);
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  const props = {
    t: i18nextTranslateStub(),
    pivotData: {},
  };

  describe('for value config', () => {
    it('renders a value widget for a value config', () => {
      renderWithStore(
        <Chart
          {...props}
          widgetData={{
            widget: generateChartWidget({ chart_type: 'value' }),
          }}
        />
      );

      expect(screen.getByTestId('WidgetChart|Value')).toBeInTheDocument();
    });

    it('renders the value returned in a widget', async () => {
      const widgetData = generateChartWidgetData({ chart_type: 'value' });
      const chartElement = generateChartElement();

      renderWithStore(
        <Chart
          {...props}
          widgetData={{
            ...widgetData,
            widget: {
              ...widgetData.widget,
              chart_elements: [chartElement],
            },
          }}
        />
      );

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByText(data.value[0].value)).toBeInTheDocument();
    });

    it('renders an error state when the server errors', async () => {
      server.use(
        rest.post('/reporting/charts/preview', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      const widgetData = generateChartWidgetData({ chart_type: 'value' });
      const chartElement = generateChartElement();

      renderWithStore(
        <Chart
          {...props}
          widgetData={{
            ...widgetData,
            widget: {
              ...widgetData.widget,
              chart_elements: [chartElement],
            },
          }}
        />
      );

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Unable to load')).toBeInTheDocument();
    });
  });

  describe('for xy charts', () => {
    it('renders the XYChart empty state', () => {
      renderWithStore(
        <Chart
          {...props}
          widgetData={{
            widget: generateChartWidget({ chart_type: 'xy' }),
          }}
        />
      );

      expect(screen.getByText('Nothing to see yet')).toBeVisible();
      expect(
        screen.getByText('A data type and time period is required')
      ).toBeVisible();
    });
  });

  describe('for pie charts', () => {
    it('renders the PieChart empty state', () => {
      renderWithStore(
        <Chart
          {...props}
          widgetData={{
            widget: generateChartWidget({ chart_type: 'pie' }),
          }}
        />
      );

      expect(screen.getByText('Nothing to see yet')).toBeVisible();
      expect(screen.getByText('Add a data type')).toBeVisible();
    });
  });

  describe('when the rep-charts-v2-caching feature flag is on', () => {
    beforeEach(() => {
      window.setFlag('rep-charts-v2-caching', true);
    });

    it('does not render a chart when element has not been visible', () => {
      useElementVisibilityTracker.mockReturnValue([
        { current: null },
        { hasBeenVisible: false },
      ]);

      renderWithStore(
        <Chart
          {...props}
          widgetData={generateChartWidgetData({ chart_type: 'value' })}
        />
      );

      expect(screen.queryByTestId('WidgetChart|Value')).not.toBeInTheDocument();
    });
  });
});
