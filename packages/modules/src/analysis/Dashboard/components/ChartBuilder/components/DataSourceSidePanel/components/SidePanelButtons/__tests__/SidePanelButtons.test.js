import { screen } from '@testing-library/react';
import * as Redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  REDUCER_KEY,
  initialState,
  applyChartElement,
  updateChartElement,
  deleteChartElement,
  updatePreviewChartData,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
// eslint-disable-next-line jest/no-mocks-import
import {
  MOCK_CHART_ELEMENTS,
  generateChartWidgetData,
  MOCK_CHART_BUILDER,
  MOCK_GROUPINGS,
} from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import * as ChartBuilderApi from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import * as Utils from '@kitman/modules/src/analysis/Dashboard/utils';
import * as ChatBuilderUtils from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/utils';
import { formatDataSourceInputParams } from '@kitman/modules/src/analysis/Dashboard/utils';

import SidePanelButtons from '..';

describe('analysis dashboard | <SidePanelButtons />', () => {
  const chartElements = {
    ...MOCK_CHART_ELEMENTS[0],
    input_params: {
      source: 'kitman',
      variable: 'game_minutes',
    },
  };

  const mockDataSourceFormState = {
    ...chartElements,
    input_params: formatDataSourceInputParams(
      chartElements.input_params,
      chartElements.data_source_type,
      codingSystemKeys.OSICS_10
    ),
  };

  const mockProps = {
    t: i18nextTranslateStub(),
    chartType: 'value',
    widgetId: 1,
    dataSourceFormState: mockDataSourceFormState,
  };

  const chartElement = {
    ...MOCK_CHART_ELEMENTS[0],

    input_params: {
      source: 'kitman',
      variable: 'game_minutes',
    },
  };

  const mockDispatch = jest.fn();
  const saveChartElement = jest.fn();
  const saveUpdateChartElement = jest.fn();
  const removeChartElement = jest.fn();
  const updateChartWidget = jest.fn();

  const removeErrorStateSpy = jest.spyOn(ChatBuilderUtils, 'removeErrorState');
  const getNewChartTitleOnRemoveSpy = jest.spyOn(
    ChatBuilderUtils,
    'getNewChartTitleOnRemove'
  );
  const synchronizeChartGroupingSpy = jest.spyOn(
    ChatBuilderUtils,
    'synchronizeChartGrouping'
  );
  beforeEach(() => {
    jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('apply button', () => {
    beforeEach(() => {
      jest
        .spyOn(ChartBuilderApi, 'useSaveChartElementMutation')
        .mockReturnValue([saveChartElement]);

      jest
        .spyOn(ChartBuilderApi, 'useSaveUpdateChartElementMutation')
        .mockReturnValue([saveUpdateChartElement]);

      jest
        .spyOn(ChartBuilderApi, 'useUpdateChartWidgetMutation')
        .mockReturnValue([updateChartWidget]);

      jest
        .spyOn(Utils, 'formatDataSourceInputParams')
        .mockImplementation(() => ({
          coding_system: codingSystemKeys.OSICS_10,
          subtypes: ['Code'],
        }));

      saveChartElement.mockReturnValue({
        unwrap: () => Promise.resolve({ ...chartElement }),
      });

      saveUpdateChartElement.mockReturnValue({
        unwrap: () => Promise.resolve({}),
      });

      updateChartWidget.mockReturnValue({
        unwrap: () => Promise.resolve({}),
      });
    });

    it('renders the apply button', () => {
      renderWithStore(<SidePanelButtons {...mockProps} />);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeVisible();
    });

    it('does not renders the apply button', () => {
      renderWithStore(<SidePanelButtons {...mockProps} hideSubmitButton />);

      expect(
        screen.queryByRole('button', { name: 'Apply' })
      ).not.toBeInTheDocument();
    });

    it('is disabled when data has not been selected', () => {
      renderWithStore(
        <SidePanelButtons
          {...mockProps}
          dataSourceFormState={{ ...MOCK_CHART_ELEMENTS[0] }}
          isButtonDisabled
        />
      );

      expect(screen.getByRole('button', { name: 'Apply' })).toBeDisabled();
    });

    it('is enabled when data has been selected', () => {
      renderWithStore(
        <SidePanelButtons {...mockProps} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
            },
          },
        }
      );

      expect(screen.getByRole('button', { name: 'Apply' })).toBeEnabled();
    });

    it('should validate chart elements and sync groupings if no invalid chart element', async () => {
      const widget = generateChartWidgetData();

      const user = userEvent.setup();
      renderWithStore(
        <SidePanelButtons {...mockProps} widgetId={widget.id} chartType="xy" />,
        {},
        {
          [REDUCER_KEY]: {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              widgetId: widget.id,
              chartId: widget.widget.chart_id,
            },
            activeWidgets: {
              [`${widget.id}`]: {
                ...widget,
                widget: {
                  ...widget.widget,
                },
              },
            },
            [widget.widget.chart_id]: {
              config: {
                invalid_chart_elements: {
                  1: [],
                },
              },
            },
          },
        }
      );
      await user.click(screen.getByRole('button', { name: 'Apply' }));
      expect(synchronizeChartGroupingSpy).toHaveBeenCalled();
    });

    it('should validate chart elements and sync groupings if chart element is created with shared grouping', async () => {
      const widget = generateChartWidgetData();
      const mockGroupingElements = [
        MOCK_CHART_ELEMENTS[0],
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            groupings: MOCK_GROUPINGS[0].groupings,
            render_options: {
              name: 'New Chart Element 2',
            },
          },
        },
      ];

      const user = userEvent.setup();
      renderWithStore(
        <SidePanelButtons
          {...mockProps}
          dataSourceFormState={{
            ...chartElement,
            config: {
              ...MOCK_CHART_ELEMENTS[0].config,
              groupings: ['athlete_id'],
            },
          }}
          chartType="xy"
          widgetId={widget.id}
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              widgetId: widget.id,
              chartId: widget.widget.chart_id,
            },
            activeWidgets: {
              [`${widget.id}`]: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_elements: mockGroupingElements,
                },
              },
            },
            [widget.widget.chart_id]: {
              config: {
                invalid_chart_elements: {
                  2: [],
                },
              },
            },
          },
        }
      );
      await user.click(screen.getByRole('button', { name: 'Apply' }));
      expect(synchronizeChartGroupingSpy).toHaveBeenCalled();
    });

    it('calls updateChartWidget invalid chart element mapping', async () => {
      const widget = generateChartWidgetData();

      const user = userEvent.setup();
      renderWithStore(
        <SidePanelButtons {...mockProps} chartType="xy" widgetId={widget.id} />,
        {},
        {
          [REDUCER_KEY]: {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              widgetId: widget.id,
              chartId: widget.widget.chart_id,
            },
            activeWidgets: {
              [`${widget.id}`]: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_elements: [...MOCK_CHART_ELEMENTS],
                },
              },
            },
            [widget.widget.chart_id]: {
              config: {
                invalid_chart_elements: {
                  2: ['invalidGrouping'],
                },
              },
            },
          },
        }
      );
      await user.click(screen.getByRole('button', { name: 'Apply' }));

      expect(updateChartWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          widget: expect.objectContaining({
            config: expect.objectContaining({
              invalid_chart_elements: {
                2: ['invalidGrouping'],
              },
            }),
          }),
        })
      );
    });

    it('overrides with default chart options for new pie chart and calls updateChartWidget', async () => {
      const widget = generateChartWidgetData();

      const user = userEvent.setup();
      renderWithStore(
        <SidePanelButtons
          {...mockProps}
          chartType="pie"
          widgetId={widget.id}
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              widgetId: widget.id,
              chartId: widget.widget.chart_id,
            },
            activeWidgets: {
              [`${widget.id}`]: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_elements: [...MOCK_CHART_ELEMENTS],
                },
              },
            },
            [widget.widget.chart_id]: {
              config: {
                chartOptions: null,
              },
            },
          },
        }
      );
      await user.click(screen.getByRole('button', { name: 'Apply' }));

      expect(updateChartWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          widget: expect.objectContaining({
            config: expect.objectContaining({
              chartOptions: {
                show_label: true,
                show_legend: true,
              },
            }),
          }),
        })
      );
    });

    it('does not override chart options calling updateChartWidget with selected options for pie chart', async () => {
      const widget = generateChartWidgetData();

      const user = userEvent.setup();
      renderWithStore(
        <SidePanelButtons
          {...mockProps}
          chartType="pie"
          widgetId={widget.id}
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...MOCK_CHART_BUILDER,
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              widgetId: widget.id,
              chartId: widget.widget.chart_id,
            },
            activeWidgets: {
              [`${widget.id}`]: {
                ...widget,
                widget: {
                  ...widget.widget,
                  chart_elements: [...MOCK_CHART_ELEMENTS],
                },
              },
            },
            [widget.widget.chart_id]: {
              config: {
                chartOptions: {
                  show_percentage: true,
                },
              },
            },
          },
        }
      );
      await user.click(screen.getByRole('button', { name: 'Apply' }));

      expect(updateChartWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          widget: expect.objectContaining({
            config: expect.objectContaining({
              chartOptions: {
                show_percentage: true,
              },
            }),
          }),
        })
      );
    });

    describe('when mode === create', () => {
      beforeEach(async () => {
        renderWithStore(
          <SidePanelButtons
            {...mockProps}
            dataSourceFormState={{
              ...chartElement,
              config: {
                render_options: { name: 'Game Mins' },
                groupings: ['athlete_id'],
              },
            }}
            widgetId={123}
          />,
          {},
          {
            [REDUCER_KEY]: {
              ...initialState,
              activeWidgets: {
                123: {
                  id: 123,
                  widget: {
                    chart_elements: [],
                  },
                },
              },
              dataSourceSidePanel: {
                widgetId: '123',
                mode: 'create',
                isOpen: true,
              },
            },
          }
        );

        await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
      });

      it('calls saveChartElement when clicked', () => {
        expect(saveChartElement).toHaveBeenCalledTimes(1);
      });

      it('dispatches applyChartElement() on success', () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          applyChartElement({
            data: { ...chartElement },
          })
        );
      });

      it('calls updateChartWidget with the new chart title', () => {
        expect(updateChartWidget).toHaveBeenCalledWith(
          expect.objectContaining({
            widget: expect.objectContaining({
              name: 'Game Mins - Sum',
            }),
          })
        );
      });

      it('does not invoke remove mode specific methods', async () => {
        expect(getNewChartTitleOnRemoveSpy).not.toHaveBeenCalled();
        expect(removeErrorStateSpy).not.toHaveBeenCalled();
      });
    });

    describe('when mode === update', () => {
      const dataSourceFormState = {
        ...chartElement,
        calculation: 'mean',
        config: {
          render_options: { name: 'Game Mins' },
          groupings: ['athlete_id'],
        },
      };

      beforeEach(async () => {
        renderWithStore(
          <SidePanelButtons
            {...mockProps}
            dataSourceFormState={{
              ...dataSourceFormState,
            }}
            widgetId={123}
          />,
          {},
          {
            [REDUCER_KEY]: {
              ...initialState,
              activeWidgets: {
                123: {
                  id: 123,
                  widget: {
                    name: 'Game Mins - Sum',
                    chart_elements: [{ ...chartElement }],
                  },
                },
              },
              dataSourceSidePanel: {
                widgetId: '123',
                mode: 'update',
                isOpen: true,
              },
            },
          }
        );

        await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
      });

      it('calls saveUpdateChartElement when clicked', async () => {
        expect(saveUpdateChartElement).toHaveBeenCalled();
      });

      it('dispatches updateChartElement() on success', () => {
        expect(mockDispatch).toHaveBeenCalledWith(
          updateChartElement({
            widgetId: '123',
            formattedState: {
              ...dataSourceFormState,
            },
          })
        );
      });

      it('calls updateChartWidget with the new chart title', () => {
        expect(updateChartWidget).toHaveBeenCalledWith(
          expect.objectContaining({
            widget: expect.objectContaining({
              name: 'Game Mins - Mean',
            }),
          })
        );
      });

      it('does not invoke remove mode specific methods', async () => {
        expect(getNewChartTitleOnRemoveSpy).not.toHaveBeenCalled();
        expect(removeErrorStateSpy).not.toHaveBeenCalled();
      });
    });

    describe('handles santizing chart title', () => {
      it('uriEncodes % when updating the chart title', async () => {
        const user = userEvent.setup();
        renderWithStore(
          <SidePanelButtons
            {...mockProps}
            dataSourceFormState={{
              ...chartElement,
              config: {
                render_options: { name: '% Difference' },
                groupings: ['athlete_id'],
              },
            }}
            widgetId={123}
          />,
          {},
          {
            [REDUCER_KEY]: {
              ...initialState,
              activeWidgets: {
                123: {
                  id: 123,
                  widget: {
                    chart_elements: [],
                  },
                },
              },
              dataSourceSidePanel: {
                widgetId: '123',
                mode: 'create',
                isOpen: true,
              },
            },
          }
        );

        await user.click(screen.getByRole('button', { name: 'Apply' }));

        expect(updateChartWidget).toHaveBeenCalledWith(
          expect.objectContaining({
            widget: expect.objectContaining({
              name: '%25 Difference - Sum',
            }),
          })
        );
      });
    });
  });

  describe('remove button', () => {
    it('renders the remove button', () => {
      renderWithStore(<SidePanelButtons {...mockProps} />);

      expect(screen.getByRole('button', { name: 'Remove' })).toBeVisible();
    });

    it('is disabled when data has not been selected', () => {
      renderWithStore(<SidePanelButtons {...mockProps} />);

      expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
    });

    it('is disabled when the mode === create and all fields have been populated', () => {
      renderWithStore(
        <SidePanelButtons {...mockProps} widgetId={123} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              123: {
                id: 123,
                widget: {
                  name: 'Game Mins - Sum',
                  chart_elements: [{ ...chartElement }],
                },
              },
            },
            dataSourceSidePanel: {
              widgetId: '456',
              mode: 'create',
              isOpen: true,
              dataSourceFormState: {
                ...chartElement,
              },
            },
          },
        }
      );

      expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
    });

    describe('when it renders with state data', () => {
      beforeEach(async () => {
        jest
          .spyOn(ChartBuilderApi, 'useRemoveChartElementMutation')
          .mockReturnValue([removeChartElement, { data: {} }]);

        removeChartElement.mockReturnValue({
          unwrap: () => Promise.resolve({}),
        });

        renderWithStore(
          <SidePanelButtons {...mockProps} widgetId={123} />,
          {},
          {
            [REDUCER_KEY]: {
              ...initialState,
              activeWidgets: {
                123: {
                  id: 123,
                  widget: {
                    name: 'Game Mins - Sum',
                    chart_elements: [{ ...chartElement }],
                  },
                },
              },
              dataSourceSidePanel: {
                widgetId: '123',
                mode: 'update',
                isOpen: true,
                dataSourceFormState: {
                  ...chartElement,
                },
              },
            },
          }
        );

        await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
      });

      it('is enabled when data has been selected and mode === update', () => {
        expect(screen.getByRole('button', { name: 'Remove' })).toBeEnabled();
      });

      it('calls removeChartElement when clicked', async () => {
        expect(removeChartElement).toHaveBeenCalledTimes(1);
      });

      it('dispatches deleteChartElement() on success', async () => {
        expect(mockDispatch).toHaveBeenCalledWith(deleteChartElement());
      });

      it('calls updateChartWidget with the new chart title', () => {
        expect(updateChartWidget).toHaveBeenCalledWith(
          expect.objectContaining({
            widget: expect.objectContaining({
              name: 'Value',
            }),
          })
        );
      });

      it('calls serializeChartUpdate with isRemove = true when clicked', async () => {
        expect(getNewChartTitleOnRemoveSpy).toHaveBeenCalledTimes(1);
        expect(removeErrorStateSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('preview button', () => {
    it('renders the preview button', () => {
      renderWithStore(
        <SidePanelButtons {...mockProps} dataSourceFormState={chartElement} />
      );

      expect(screen.getByRole('button', { name: 'Preview' })).toBeVisible();
    });

    it('is disabled when data has not been selected', () => {
      renderWithStore(
        <SidePanelButtons
          {...mockProps}
          dataSourceFormState={{ ...MOCK_CHART_ELEMENTS[0] }}
          isButtonDisabled
        />
      );

      expect(screen.getByRole('button', { name: 'Preview' })).toBeDisabled();
    });

    it('is enabled when data has been selected', () => {
      renderWithStore(
        <SidePanelButtons {...mockProps} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              mode: 'update',
              isOpen: true,
              dataSourceFormState: {
                ...chartElement,
              },
            },
          },
        }
      );

      expect(screen.getByRole('button', { name: 'Preview' })).toBeEnabled();
    });
    it('dispatches updatePreviewChartData with right payload when Preview is clicked', async () => {
      const expectedFormattedState = {
        ...MOCK_CHART_ELEMENTS[0],
        input_params: {
          coding_system: 'osics_10',
          subtypes: ['Code'],
        },
      };

      const user = userEvent.setup();
      renderWithStore(
        <SidePanelButtons
          {...mockProps}
          dataSourceFormState={{
            ...chartElement,
            input_params: {
              coding_system: 'osics_10',
              subtypes: ['Code'],
            },
          }}
          chartType="value"
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              mode: 'update',
              isOpen: true,
              dataSourceFormState: {
                ...chartElement,
              },
            },
          },
        }
      );

      await user.click(screen.getByRole('button', { name: 'Preview' }));

      expect(mockDispatch).toHaveBeenCalledWith(
        updatePreviewChartData({ formattedState: expectedFormattedState })
      );
    });
  });
});
