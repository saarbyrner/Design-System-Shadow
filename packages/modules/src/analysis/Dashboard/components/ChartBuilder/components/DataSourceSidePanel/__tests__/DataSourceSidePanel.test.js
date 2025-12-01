import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import { colors } from '@kitman/common/src/variables';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  REDUCER_KEY,
  initialState,
  emptyDataSourceFormState,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { unsupportedMetrics } from '@kitman/modules/src/analysis/Dashboard/components/ChartBuilder/constants';
import { CHART_TYPE } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import * as Utils from '@kitman/modules/src/analysis/Dashboard/utils';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import DataSourceSidePanel from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('ChartBuilder|SidePanel', () => {
  const props = {
    t: i18nextTranslateStub(),
    isOpen: true,
    togglePanel: jest.fn(),
  };
  const trackEventMock = jest.fn();

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: trackEventMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the the MetricModule when sidePanelSource === metric', () => {
    renderWithStore(
      <DataSourceSidePanel {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            sidePanelSource: 'metric',
            dataSourceFormState: {
              ...emptyDataSourceFormState,
            },
          },
        },
      }
    );
    expect(screen.getByLabelText('Metric Source')).toBeInTheDocument();
  });

  describe('when evaluating hideComplexCalcs', () => {
    beforeEach(() => {
      window.setFlag('table-widget-complex-calculations', true);
    });

    afterEach(() => {
      window.setFlag('table-widget-complex-calculations', false);
    });

    it('shows complex calculations for the MetricModule when chart type is value', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 40 }}
        >
          <DataSourceSidePanel {...props} />,
        </VirtuosoMockContext.Provider>,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              widgetId: 1,
              chart_type: 'value',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                id: 1,
                widget: {
                  chart_type: 'value',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Calculation'));

      expect(screen.getByText('Complex Z-Score')).toBeInTheDocument();
    });

    it('shows complex calculations for the MetricModule when chart type is xy', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 40 }}
        >
          <DataSourceSidePanel {...props} />,
        </VirtuosoMockContext.Provider>,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              widgetId: 1,
              chart_type: 'xy',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                id: 1,
                widget: {
                  chart_type: 'xy',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Calculation'));

      expect(screen.getByText('Complex Z-Score')).toBeInTheDocument();
    });

    it('hides complex calculations for the MetricModule when chart type is pie', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 2000, itemHeight: 40 }}
        >
          <DataSourceSidePanel {...props} />,
        </VirtuosoMockContext.Provider>,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              widgetId: 1,
              chart_type: 'pie',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                id: 1,
                widget: {
                  chart_type: 'pie',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Calculation'));

      expect(screen.queryByText('Complex Z-Score')).not.toBeInTheDocument();
    });
  });

  it('renders the the ActivityModule when sidePanelSource === activity', () => {
    renderWithStore(
      <DataSourceSidePanel {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            sidePanelSource: 'activity',
            dataSourceFormState: {
              ...emptyDataSourceFormState,
            },
          },
        },
      }
    );
    expect(screen.getByLabelText('Activity Source')).toBeInTheDocument();
  });

  it('renders the SquadModule', () => {
    renderWithStore(
      <DataSourceSidePanel {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            dataSourceFormState: {
              ...emptyDataSourceFormState,
              data_source_type: 'metric',
            },
          },
        },
      }
    );

    expect(screen.getByLabelText('Athletes')).toBeInTheDocument();
  });

  describe('<DataRangeModule />', () => {
    it('renders the DateRangeModule', () => {
      renderWithStore(<DataSourceSidePanel {...props} />);

      expect(screen.getByLabelText('Date')).toBeInTheDocument();
    });

    it('shows Last X Games and Sessions for supported metric data sources', async () => {
      window.setFlag('rep-last-x-games-and-sessions', true);

      const user = userEvent.setup();

      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                data_source_type: 'metric',
                input_params: {
                  source: 'supported_metric',
                  variable: 'variable',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Date'));

      const lastXGamesAndSessions = screen.getByText('Last (x) Games/Sessions');

      expect(lastXGamesAndSessions).toBeInTheDocument();
    });

    it('shows Last X Games and Sessions for supported metric combination data sources', async () => {
      window.setFlag('rep-last-x-games-and-sessions', true);

      const user = userEvent.setup();

      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                data_source_type: 'metric',
                input_params: {
                  source: 'combination',
                  variable: 'variable',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Date'));

      const lastXGamesAndSessions = screen.getByText('Last (x) Games/Sessions');

      expect(lastXGamesAndSessions).toBeInTheDocument();
    });

    it('hides Last X Games/Sessions for unsupported metric data sources', async () => {
      window.setFlag('rep-last-x-games-and-sessions', true);

      const user = userEvent.setup();

      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                data_source_type: 'metric',
                input_params: {
                  source: unsupportedMetrics[0],
                  variable: 'variable',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Date'));

      const lastXGamesAndSessions = screen.queryByText(
        'Last (x) Games/Sessions'
      );

      expect(lastXGamesAndSessions).not.toBeInTheDocument();
    });

    it('hides Last X Games/Sessions for non-metric data sources', async () => {
      window.setFlag('rep-last-x-games-and-sessions', true);

      const user = userEvent.setup();

      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'activity',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Date'));

      const lastXGamesAndSessions = screen.queryByText(
        'Last (x) Games/Sessions'
      );

      expect(lastXGamesAndSessions).not.toBeInTheDocument();
    });
  });

  it('renders the TypeSelector when sidePanelSource === medical', () => {
    renderWithStore(
      <DataSourceSidePanel {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            sidePanelSource: 'medical',
            dataSourceFormState: {
              ...emptyDataSourceFormState,
            },
          },
        },
      }
    );

    expect(screen.getByRole('button', { name: 'Illnesses' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Injuries' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Rehab exercises' })
    ).not.toBeInTheDocument();
  });

  describe('[feature-flag] rep-medical-rehabs-source ON', () => {
    beforeEach(() => {
      window.featureFlags['rep-medical-rehabs-source'] = true;
    });

    afterEach(() => {
      window.featureFlags['rep-medical-rehabs-source'] = false;
    });

    it('renders the TypeSelector when sidePanelSource === medical', async () => {
      const user = userEvent.setup();

      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'medical',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
        }
      );

      const selectComponent = screen.getByLabelText('Source');
      await user.click(selectComponent);

      expect(
        screen.getByRole('option', {
          name: 'Injuries',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', {
          name: 'Rehab exercises',
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('option', {
          name: 'Illnesses',
        })
      ).toBeInTheDocument();
    });
  });

  describe('chart element name', () => {
    it('renders the name selector', () => {
      renderWithStore(<DataSourceSidePanel {...props} />);

      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    it('updates the value when changed', () => {
      renderWithStore(<DataSourceSidePanel {...props} />);

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'Chart' },
      });

      expect(screen.getByLabelText('Name')).toHaveValue('Chart');
    });

    it('renders the preset chart element name', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                data_source_type: 'TableMetric',
                config: {
                  render_options: {
                    name: 'New Chart',
                  },
                },
              },
            },
          },
        }
      );

      expect(screen.getByLabelText('Name')).toHaveValue('New Chart');
    });
  });

  it('renders the Filters selector', () => {
    renderWithStore(<DataSourceSidePanel {...props} />);

    expect(screen.getByLabelText('Session Type')).toBeInTheDocument();
  });

  it('renders the SidePanelButtons component', () => {
    renderWithStore(<DataSourceSidePanel {...props} />);

    expect(screen.getByRole('button', { name: 'Apply' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Preview' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeVisible();
  });

  describe('when chart type is "Value"', () => {
    it('hides the GroupingModule & SeriesVisualisationModule', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                id: 1,
                widget: {
                  chart_type: 'value',
                },
              },
            },
            dataSourceSidePanel: {
              widgetId: 1,
              chart_type: 'value',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
        }
      );

      expect(screen.queryByLabelText('Group by')).not.toBeInTheDocument();
      expect(screen.queryByText('Visualisation')).not.toBeInTheDocument();
    });

    it('renders the proportion calculation for AvailabilityModule', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'availability',
              widgetId: '1',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                widget: {
                  chart_type: 'value',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Calculation'));

      expect(screen.getByText('Count')).toBeInTheDocument();
      expect(screen.queryByText('Percentage')).toBeInTheDocument();
      expect(screen.queryByText('Proportion')).toBeInTheDocument();
    });

    it('hides the proportion calculation for ParticipationModule', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'participation',
              widgetId: '1',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                widget: {
                  chart_type: 'value',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Calculation'));

      expect(screen.getByText('Count')).toBeInTheDocument();
      expect(screen.queryByText('Percentage')).toBeInTheDocument();
      expect(screen.queryByText('Proportion')).not.toBeInTheDocument();
    });
  });

  describe('when chart type is not "Value"', () => {
    it('shows the GroupingModule & SeriesVisualisationModule', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                id: 1,
                widget: {
                  chart_type: 'xy',
                },
              },
            },
            dataSourceSidePanel: {
              widgetId: 1,
              chart_type: 'xy',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
        }
      );

      expect(screen.getByText('Groupings')).toBeInTheDocument();
      expect(screen.getByText('Visualisation')).toBeInTheDocument();
    });

    it('hides the proportion calculation for AvailabilityModule', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'availability',
              widgetId: '1',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                widget: {
                  chart_type: 'xy',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Calculation'));

      expect(screen.getByText('Count')).toBeInTheDocument();
      expect(screen.queryByText('Percentage')).toBeInTheDocument();
      expect(screen.queryByText('Proportion')).not.toBeInTheDocument();
    });

    it('hides the proportion calculation for ParticipationModule', async () => {
      const user = userEvent.setup();
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'participation',
              widgetId: '1',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                widget: {
                  chart_type: 'pie',
                },
              },
            },
          },
        }
      );

      await user.click(screen.getByLabelText('Calculation'));

      expect(screen.getByText('Count')).toBeInTheDocument();
      expect(screen.queryByText('Percentage')).toBeInTheDocument();
      expect(screen.queryByText('Proportion')).not.toBeInTheDocument();
    });
  });

  it('renders the the GameActivityModule when sidePanelSource === games', () => {
    renderWithStore(
      <DataSourceSidePanel {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            sidePanelSource: 'games',
            dataSourceFormState: {
              ...emptyDataSourceFormState,
            },
          },
        },
      }
    );
    expect(screen.getByLabelText('Game Event')).toBeInTheDocument();
  });

  it('renders the the AvailabilityModule when sidePanelSource === availability', () => {
    renderWithStore(
      <DataSourceSidePanel {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            sidePanelSource: 'availability',
            dataSourceFormState: {
              ...emptyDataSourceFormState,
            },
          },
        },
      }
    );
    expect(screen.getByLabelText('Availability Source')).toBeInTheDocument();
  });

  it('renders the the Participation when sidePanelSource === participation', () => {
    renderWithStore(
      <DataSourceSidePanel {...props} />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            sidePanelSource: 'participation',
            dataSourceFormState: {
              ...emptyDataSourceFormState,
            },
          },
        },
      }
    );
    expect(screen.getByText('Participation')).toBeInTheDocument();
  });

  describe('Data source format', () => {
    beforeEach(() => {
      jest
        .spyOn(Utils, 'formatDataSourceInputParams')
        .mockImplementation(() => ({
          coding_system: codingSystemKeys.OSICS_10,
          subtypes: ['Code'],
        }));
    });

    it('calls formatDataSourceInputParams with empty arguments', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'participation',
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
        }
      );

      expect(Utils.formatDataSourceInputParams).toHaveBeenCalledWith(
        emptyDataSourceFormState.input_params,
        emptyDataSourceFormState.data_source_type,
        codingSystemKeys.OSICS_10
      );
    });

    it('calls formatDataSourceInputParams with correct arguments', () => {
      const mockDataSourceFormState = {
        ...emptyDataSourceFormState,
        data_source_type: 'TableMetric',
        input_params: {},
      };

      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'participation',
              dataSourceFormState: {
                ...mockDataSourceFormState,
              },
            },
          },
        }
      );

      expect(Utils.formatDataSourceInputParams).toHaveBeenCalledWith(
        mockDataSourceFormState.input_params,
        mockDataSourceFormState.data_source_type,
        codingSystemKeys.OSICS_10
      );
    });
  });

  describe('Multiple groupings', () => {
    it('renders the add button for multiple groupings when chart type is xy', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                id: 1,
                widget: {
                  chart_type: CHART_TYPE.xy,
                },
              },
            },
            dataSourceSidePanel: {
              widgetId: 1,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
        }
      );

      expect(screen.queryByRole('button', { name: 'Add' })).toBeInTheDocument();
    });

    it('does not render the add button for multiple groupings when chart type is pie', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {
              1: {
                id: 1,
                widget: {
                  chart_type: CHART_TYPE.pie,
                },
              },
            },
            dataSourceSidePanel: {
              widgetId: 1,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
          },
        }
      );

      expect(
        screen.queryByRole('button', { name: 'Add' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Conditional formatting panel', () => {
    beforeEach(() => {
      window.setFlag('rep-charts-conditional-formatting', true);
    });

    it('does not render conditional formatting for value charts', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              widgetId: 1,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                widget: {
                  chart_type: 'value',
                },
              },
            },
          },
        }
      );

      expect(
        screen.queryByText('Conditional formatting')
      ).not.toBeInTheDocument();
    });

    it('does not render conditional formatting for pie charts', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              widgetId: 1,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                widget: {
                  chart_type: 'pie',
                },
              },
            },
          },
        }
      );

      expect(
        screen.queryByText('Conditional formatting')
      ).not.toBeInTheDocument();
    });

    it('does not render conditional formatting for xy charts and FF off', () => {
      window.setFlag('rep-charts-conditional-formatting', false);

      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              widgetId: 1,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                widget: {
                  chart_type: 'xy',
                },
              },
            },
          },
        }
      );

      expect(
        screen.queryByText('Conditional formatting')
      ).not.toBeInTheDocument();
    });

    it('renders conditional formatting title and button for xy charts', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              widgetId: 1,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
              },
            },
            activeWidgets: {
              1: {
                widget: {
                  chart_type: 'xy',
                },
              },
            },
          },
        }
      );

      expect(screen.getByText('Conditional formatting')).toBeVisible();
      expect(
        screen.getByRole('button', { name: 'Add formatting rule' })
      ).toBeVisible();
    });

    it('renders the correct button text when formatting already exists on the data source', () => {
      renderWithStore(
        <DataSourceSidePanel {...props} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            dataSourceSidePanel: {
              sidePanelSource: 'metric',
              widgetId: 1,
              dataSourceFormState: {
                ...emptyDataSourceFormState,
                config: {
                  ...emptyDataSourceFormState.config,
                  render_options: {
                    conditional_formatting: [
                      {
                        type: 'zone',
                        condition: 'less_than',
                        value: '60',
                        color: colors.red_100,
                        label: 'Low performance',
                      },
                      {
                        type: 'zone',
                        condition: 'greater_than',
                        value: '200',
                        color: colors.green_100,
                        label: 'High performance',
                      },
                    ],
                  },
                },
              },
            },
            activeWidgets: {
              1: {
                widget: {
                  chart_type: 'xy',
                },
              },
            },
          },
        }
      );

      expect(screen.getByText('Conditional formatting')).toBeVisible();
      expect(
        screen.getByRole('button', { name: 'Edit formatting rules (2)' })
      ).toBeVisible();
    });
  });
});
