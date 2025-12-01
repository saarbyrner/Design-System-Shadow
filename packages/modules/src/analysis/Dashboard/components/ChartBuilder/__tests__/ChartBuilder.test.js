/* eslint-disable jest/valid-expect */
import { screen } from '@testing-library/react';
import * as Redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import useElementVisibilityTracker from '@kitman/common/src/hooks/useElementVisibilityTracker';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { data as MOCK_GROUPINGS } from '@kitman/services/src/mocks/handlers/analysis/getGroupings';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import * as ChartBuilderApi from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import * as ChartBuilderSlice from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import * as FormulaPanelSlice from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
import * as OpenColumnFormulaPanel from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
// eslint-disable-next-line jest/no-mocks-import
import {
  MOCK_CHART_ELEMENTS,
  generateChartWidgetData,
  generateChartElement,
} from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import ChartBuilder from '..';
import * as ChartUtils from '../utils';

const { REDUCER_KEY, initialState, setAllGroupings } = ChartBuilderSlice;

jest.mock('@kitman/common/src/hooks/useEventTracking');
jest.mock('@kitman/common/src/hooks/useElementVisibilityTracker');

describe('analysis dashboard | <ChartBuilder />', () => {
  const props = {
    t: i18nextTranslateStub(),
    widgetId: 1,
  };

  const widget = generateChartWidgetData();

  const { ResizeObserver } = window;
  const trackEventMock = jest.fn();

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
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    // enable activity in drop down for to test multiple items in SourceSelector list
    window.setFlag('table-widget-activity-source', true);
    // enable games in the dropdown
    window.setFlag('planning-game-events-field-view', true);
    // enable availability dropdown
    window.setFlag('table-widget-availability-data-type', true);

    window.setFlag('table-widget-participation-data-type', true);

    window.setFlag('table-widget-medical-data-type', true);

    window.setFlag('rep-charts-formula', true);

    window.setFlag('rep-xy-charts-formula', true);
  });

  describe('Adding a data type', () => {
    it('renders the "Add data" text', async () => {
      renderWithStore(
        <ChartBuilder {...props} />,
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

      expect(screen.getByText('Add data')).toBeVisible();
    });

    it('renders the menu items for "Add data"', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <ChartBuilder {...props} />,
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

      await user.click(screen.getByText('Add data'));

      expect(screen.getByText('Metric')).toBeVisible();
      expect(screen.getByText('Session activity')).toBeVisible();
      expect(screen.getByText('Games')).toBeVisible();
      expect(screen.getByText('Availability')).toBeVisible();
      expect(screen.getByText('Participation')).toBeVisible();
      expect(screen.getByText('Medical')).toBeVisible();
    });

    it('opens the side panel when data type is selected', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <ChartBuilder {...props} />,
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

      await user.click(screen.getByText('Add data'));

      await user.click(screen.getByText('Metric'));

      expect(screen.getByText('Add Metric')).toBeVisible();
    });

    describe('when add data text is disabled', () => {
      it('hides add data for value chart when chart_elements.length = 1', () => {
        const newWidget = {
          ...widget,
          widget: {
            ...widget,
            chart_elements: [MOCK_CHART_ELEMENTS[0]],
          },
        };

        renderWithStore(
          <ChartBuilder {...props} />,
          {},
          {
            [REDUCER_KEY]: {
              ...initialState,
              activeWidgets: {
                1: {
                  ...newWidget,
                },
              },
            },
          }
        );

        expect(screen.queryByText('Add data')).not.toBeInTheDocument();
      });

      it('hides add data for xy chart when chart_elements.length > 0', () => {
        const chartElements = [generateChartElement()];

        const newWidget = {
          ...widget,
          widget: {
            ...widget,
            chart_elements: [...chartElements],
          },
        };

        renderWithStore(
          <ChartBuilder {...props} />,
          {},
          {
            [REDUCER_KEY]: {
              ...initialState,
              activeWidgets: {
                1: {
                  ...newWidget,
                },
              },
            },
          }
        );

        expect(screen.queryByText('Add data')).not.toBeInTheDocument();
      });
    });
  });

  describe('Active data types', () => {
    it('renders a Chip for every existing data type with the chart element name', () => {
      renderWithStore(
        <ChartBuilder {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_elements: [...MOCK_CHART_ELEMENTS],
                },
              },
            },
          },
        }
      );

      MOCK_CHART_ELEMENTS.forEach((element) => {
        expect(screen.getByText(element.config.render_options.name));
      });
    });

    it('opens side panel when clicking on an exisiting data type', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <ChartBuilder {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_elements: [...MOCK_CHART_ELEMENTS],
                },
              },
            },
          },
        }
      );

      await user.click(
        screen.getByText(MOCK_CHART_ELEMENTS[0].config.render_options.name)
      );

      expect(screen.getByText('Add Metric')).toBeVisible();
    });
  });

  it('renders a chart when there is activeWidgetData', () => {
    renderWithStore(
      <ChartBuilder {...props} />,
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

    // will be an empty state so testing if that is there
    expect(screen.getByText('Nothing to see yet')).toBeVisible();
  });

  describe('fetch groupings', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
      jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);

      jest
        .spyOn(ChartBuilderApi, 'useGetAllGroupingsQuery')
        .mockReturnValue({ data: MOCK_GROUPINGS });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches setAllGroupings', () => {
      renderWithStore(
        <ChartBuilder {...props} />,
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

      expect(mockDispatch).toHaveBeenCalledWith(
        setAllGroupings(MOCK_GROUPINGS)
      );
    });
  });

  describe('adding default chart type', () => {
    const spyAddRenderOptions = jest.spyOn(
      ChartBuilderSlice,
      'addRenderOptions'
    );

    beforeEach(() => {
      spyAddRenderOptions.mockClear();
    });

    it('dispatches addRenderOptions with the correct default series type when saving an "xy" chart type', async () => {
      const user = userEvent.setup();
      const mockChartElements = [];
      const expectedDefaultSeriesType =
        ChartUtils.getDefaultSeriesType(mockChartElements);

      renderWithStore(
        <ChartBuilder {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_type: 'xy',
                },
                chart_elements: mockChartElements,
              },
            },
          },
        }
      );

      await user.click(screen.getByText('Add data'));
      await user.click(screen.getByText('Metric'));

      expect(spyAddRenderOptions).toHaveBeenCalledWith({
        key: 'type',
        value: expectedDefaultSeriesType,
      });

      expect(spyAddRenderOptions).toHaveBeenCalledWith({
        key: 'axis_config',
        value: 'left',
      });
    });

    it('dispatches addRenderOptions with the correct default series type when saving a "pie" chart type', async () => {
      const user = userEvent.setup();
      const expectedDefaultSeriesType = ChartUtils.getPieDefaultSeriesType();

      renderWithStore(
        <ChartBuilder {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_type: CHART_TYPE.pie,
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByText('Add data'));
      await user.click(screen.getByText('Metric'));

      expect(spyAddRenderOptions).toHaveBeenCalledWith({
        key: 'type',
        value: expectedDefaultSeriesType,
      });
    });

    it('does not dispatch addRenderOptions when saving a "value" chart type', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <ChartBuilder {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_type: 'value',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByText('Add data'));
      await user.click(screen.getByText('Metric'));

      expect(spyAddRenderOptions).not.toHaveBeenCalled();
    });
  });

  describe('Chart grouping synchronization', () => {
    const mockSynchronizeChartGrouping = jest.fn();

    beforeEach(() => {
      jest
        .spyOn(ChartUtils, 'synchronizeChartGrouping')
        .mockImplementation(mockSynchronizeChartGrouping);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('does not call "synchronizeChartGrouping" when chart_type is "value"', async () => {
      renderWithStore(
        <ChartBuilder {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_type: 'value',
                },
              },
            },
          },
        }
      );
      expect(mockSynchronizeChartGrouping).not.toHaveBeenCalled();
    });

    it('does not call "synchronizeChartGrouping" when groupings do not match', async () => {
      renderWithStore(
        <ChartBuilder {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              ...initialState.dataSourceSidePanel,
              widgetId: 1,
              dataSourceFormState: {
                ...initialState.dataSourceSidePanel.dataSourceFormState,
                config: {
                  groupings: ['Time'],
                },
              },
              previewData: null,
            },
            activeWidgets: {
              1: {
                ...widget,
                chart_type: 'xy',
              },
            },
          },
        }
      );

      expect(mockSynchronizeChartGrouping).not.toHaveBeenCalled();
    });
  });

  describe('adding chart type "value"', () => {
    const mockDispatch = jest.fn();
    const setupFormulaPanel = jest.spyOn(
      FormulaPanelSlice,
      'setupFormulaPanel'
    );
    const openFormulaPanel = jest.spyOn(
      OpenColumnFormulaPanel,
      'openTableColumnFormulaPanel'
    );

    beforeEach(() => {
      jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);
    });

    it('renders "Formula" source when selecting a "value" chart type', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <ChartBuilder {...props} widgetId={1} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_type: 'value',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByText('Add data'));

      const formulaOption = screen.getByRole('button', { name: 'Formula' });
      await userEvent.hover(formulaOption);

      expect(screen.getByText('% baseline change')).toBeVisible();

      const percentageFormula = screen.getByText('Percentage').parentNode;
      await user.click(percentageFormula);

      expect(setupFormulaPanel).toHaveBeenCalledWith({
        formulaId: 1,
        widgetId: 1,
        widgetType: 'value',
      });
      expect(openFormulaPanel).toHaveBeenCalled();
    });

    it('does render "Formula" source when selecting a "xy" chart type', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <ChartBuilder {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_type: 'xy',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByText('Add data'));

      expect(screen.queryByText('Formula')).toBeInTheDocument();
    });
  });
});
