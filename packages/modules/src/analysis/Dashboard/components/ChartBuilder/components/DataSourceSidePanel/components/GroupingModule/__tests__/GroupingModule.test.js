import { screen } from '@testing-library/react';
import * as Redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { SERIES_TYPES } from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import {
  REDUCER_KEY,
  initialState,
  addRenderOptions,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
// eslint-disable-next-line jest/no-mocks-import
import {
  MOCK_CATEGORIZED_GROUPINGS,
  MOCK_CHART_ELEMENTS,
  MOCK_CHART_BUILDER,
} from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import GroupingModule from '..';

const mockDataSourceFormState = {
  ...MOCK_CHART_ELEMENTS[0],
  input_params: {
    source: 'kitman',
    variable: 'game_minutes',
  },
};

const mockDispatch = jest.fn();
const mockAddDataSourceGrouping = jest.fn();
const mockDeleteDataSourceGrouping = jest.fn();

const mockProps = {
  t: i18nextTranslateStub(),
  withSecondaryGrouping: true,
  seriesType: SERIES_TYPES.bar,
  label: 'on the axis',
  widgetId: 123,
  dataSourceFormState: mockDataSourceFormState,
  dataSourceType: 'TableMetric',
  addDataSourceGrouping: mockAddDataSourceGrouping,
  deleteDataSourceGrouping: mockDeleteDataSourceGrouping,
};

describe('analysis dashboard | <GroupingModule />', () => {
  beforeEach(() => {
    jest.spyOn(Redux, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders the  Group by selector', () => {
    renderWithStore(<GroupingModule {...mockProps} />);

    expect(screen.getByLabelText('Group by')).toBeInTheDocument();
  });

  it('renders the "on the axis" text', () => {
    renderWithStore(<GroupingModule {...mockProps} />);

    expect(screen.getByText('on the axis')).toBeInTheDocument();
  });

  describe('when selecting the primaryGrouping', () => {
    let user;

    beforeEach(() => {
      user = userEvent.setup();

      renderWithStore(
        <GroupingModule {...mockProps} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              dataSourceFormState: {
                data_source_type: 'TableMetric',
              },
            },
            groupings: MOCK_CATEGORIZED_GROUPINGS,
          },
        }
      );
    });

    it('renders the available groupings on screen', async () => {
      await user.click(screen.getByLabelText('Group by'));

      expect(screen.getByText('Athlete')).toBeInTheDocument();
    });

    it('dispatches addDataSourceGrouping with the correct params', async () => {
      await user.click(screen.getByLabelText('Group by'));

      await user.click(screen.getByText('Athlete'));

      expect(mockAddDataSourceGrouping).toHaveBeenCalledWith({
        index: 0,
        grouping: 'grouping_a',
      });
    });
  });

  it('renders the "Add" button', () => {
    renderWithStore(<GroupingModule {...mockProps} />);

    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  describe('when primary grouping is not selected', () => {
    it('disables the "Add" button', () => {
      renderWithStore(<GroupingModule {...mockProps} />);

      expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
    });
  });

  describe('when primary grouping is selected', () => {
    it('enables the "Add" button', () => {
      renderWithStore(
        <GroupingModule {...mockProps} primaryGrouping="squad" />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              dataSourceFormState: {
                config: {
                  groupings: ['squad'],
                },
              },
            },
          },
        }
      );

      expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
    });
  });

  describe('when clicking the add button and rendering the second grouping selector', () => {
    const renderGroupingComponent = () => {
      renderWithStore(
        <GroupingModule {...mockProps} primaryGrouping="squad_id" />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              dataSourceFormState: {
                data_source_type: 'TableMetric',
                config: {
                  groupings: ['squad_id'],
                },
              },
            },
            groupings: [
              {
                name: 'TableMetric',
                groupings: [
                  {
                    key: 'timestamp',
                    name: 'Time',
                  },
                  {
                    key: 'athlete_id',
                    name: 'Athlete',
                  },
                  {
                    key: 'squad_id',
                    name: 'Squad',
                  },
                  {
                    key: 'drill',
                    name: 'Drill',
                  },
                ],
              },
            ],
          },
        }
      );
    };

    it('hides the add button', async () => {
      const user = userEvent.setup();

      renderGroupingComponent();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      expect(
        screen.queryByRole('button', { name: 'Add' })
      ).not.toBeInTheDocument();
    });

    it('renders the second grouping selector', async () => {
      const user = userEvent.setup();

      renderGroupingComponent();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      expect(screen.getByLabelText('and then')).toBeInTheDocument();
    });

    it('renders the list of available groupings minus the primaryGrouping selected', async () => {
      const user = userEvent.setup();

      renderGroupingComponent();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      await user.click(screen.getByLabelText('and then'));

      expect(screen.getByText('Athlete')).toBeVisible();
      // Squad is rendered once in primary grouping, but not a second time in the drop down
      expect(screen.getAllByText('Squad').length).toBe(1);
    });

    it('renders the list of available groupings minus "timestamp"', async () => {
      const user = userEvent.setup();

      renderGroupingComponent();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      await user.click(screen.getByLabelText('and then'));

      expect(screen.queryByText('Time')).not.toBeInTheDocument();
    });

    it('renders the list of available groupings minus "drill"', async () => {
      const user = userEvent.setup();

      renderGroupingComponent();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      await user.click(screen.getByLabelText('and then'));

      expect(screen.queryByText('Drill')).not.toBeInTheDocument();
    });

    it('dispatches addDataSourceGroupingByIndex() when selecting a secondary grouping', async () => {
      const user = userEvent.setup();

      renderGroupingComponent();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      await user.click(screen.getByLabelText('and then'));

      await user.click(screen.getByText('Athlete'));

      expect(mockAddDataSourceGrouping).toHaveBeenCalledWith({
        index: 1,
        grouping: 'athlete_id',
      });
    });

    describe('when series type is bar it shows the stacked options', () => {
      it('renders the "stacked" text', async () => {
        const user = userEvent.setup();

        renderGroupingComponent();

        await user.click(screen.getByRole('button', { name: 'Add' }));

        expect(screen.getByText('stacked')).toBeVisible();
      });

      it('renders the switch element', async () => {
        const user = userEvent.setup();

        renderGroupingComponent();

        await user.click(screen.getByRole('button', { name: 'Add' }));

        expect(screen.getByRole('checkbox')).toBeInTheDocument();
      });
    });

    it('calls addRenderOptions when clicking the stacked Switch element', async () => {
      const user = userEvent.setup();

      renderGroupingComponent();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      await user.click(screen.getByRole('checkbox'));

      expect(mockDispatch).toHaveBeenCalledWith(
        addRenderOptions({ key: 'stack_group_elements', value: true })
      );
    });

    it('does not render the bin icon when no secondary grouping is selected', async () => {
      const user = userEvent.setup();

      renderGroupingComponent();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      expect(screen.queryByTestId('DeleteOutlineIcon')).not.toBeInTheDocument();
    });
  });

  describe('when series type is line it does not show the stacked options', () => {
    const renderGroupingForLineSeries = () => {
      return renderWithStore(
        <GroupingModule
          {...mockProps}
          seriesType={SERIES_TYPES.line}
          primaryGrouping="squad_id"
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              dataSourceFormState: {
                data_source_type: 'TableMetric',
                config: {
                  groupings: ['squad_id'],
                  render_options: {
                    type: SERIES_TYPES.line,
                  },
                },
              },
            },
            groupings: [
              {
                name: 'TableMetric',
                groupings: ['timestamp', 'athlete_id', 'squad_id'],
              },
            ],
          },
        }
      );
    };

    it('hides the "stacked" text', async () => {
      const user = userEvent.setup();

      renderGroupingForLineSeries();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      expect(screen.queryByText('stacked')).not.toBeInTheDocument();
    });

    it('hides the switch element', async () => {
      const user = userEvent.setup();

      renderGroupingForLineSeries();

      await user.click(screen.getByRole('button', { name: 'Add' }));

      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  describe('when a secondary grouping is selected', () => {
    let user;
    beforeEach(async () => {
      user = userEvent.setup();

      renderWithStore(
        <GroupingModule
          {...mockProps}
          primaryGrouping="timestamp"
          secondaryGrouping="athlete_id"
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              dataSourceFormState: {
                data_source_type: 'TableMetric',
                config: {
                  groupings: ['timestamp', 'athlete_id'],
                },
              },
            },
            groupings: [
              {
                name: 'TableMetric',
                groupings: [
                  {
                    key: 'timestamp',
                    name: 'Time',
                  },
                  {
                    key: 'athlete_id',
                    name: 'Athlete',
                  },
                ],
              },
            ],
          },
        }
      );
    });

    it('renders the bin icon', () => {
      expect(screen.getByTestId('DeleteOutlineIcon')).toBeInTheDocument();
    });

    it('dispatches deleteDataSourceGrouping() when clicking the bin icon', async () => {
      await user.click(screen.getByTestId('DeleteOutlineIcon'));

      expect(mockDeleteDataSourceGrouping).toHaveBeenCalled();
    });
  });

  describe('when editing a data source', () => {
    it('pre-populates the groupings saved in state for the data source', () => {
      renderWithStore(
        <GroupingModule
          {...mockProps}
          primaryGrouping="squad"
          secondaryGrouping={undefined}
          withSecondaryGrouping
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              dataSourceFormState: {
                data_source_type: 'TableMetric',
                config: {
                  groupings: ['athlete_id', 'athlete_id'],
                },
              },
            },
            groupings: [
              {
                name: 'TableMetric',
                groupings: [
                  {
                    key: 'timestamp',
                    name: 'Time',
                  },
                  {
                    key: 'athlete_id',
                    name: 'Athlete',
                  },
                  {
                    key: 'squad',
                    name: 'Squad',
                  },
                ],
              },
            ],
          },
        }
      );

      expect(screen.getByText('Squad')).toBeInTheDocument();
    });
  });

  describe('when withSecondaryGrouping is false', () => {
    it('doesnt render Add button', () => {
      renderWithStore(
        <GroupingModule {...mockProps} withSecondaryGrouping={false} />
      );

      expect(
        screen.queryByRole('button', { name: 'Add' })
      ).not.toBeInTheDocument();
    });

    it('dispatches deleteDataSourceGrouping when secondaryGrouping is present', () => {
      renderWithStore(
        <GroupingModule
          {...mockProps}
          withSecondaryGrouping={false}
          primaryGrouping="squad_id"
          secondaryGrouping="athlete_id"
        />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              mode: 'create',
              isOpen: true,
              dataSourceFormState: {
                data_source_type: 'TableMetric',
                config: {
                  groupings: ['squad_id', 'athlete_id'],
                },
              },
            },
            groupings: [
              {
                name: 'TableMetric',
                groupings: [
                  {
                    key: 'timestamp',
                  },
                  {
                    key: 'athlete_id',
                  },
                  {
                    key: 'squad',
                  },
                ],
              },
            ],
          },
        }
      );

      expect(mockDeleteDataSourceGrouping).toHaveBeenCalled();
    });
  });

  it('should display categorized groupings with two chart elements', async () => {
    const user = userEvent.setup();

    const dataSourceFormState = {
      ...MOCK_CHART_ELEMENTS[1],
      input_params: { subtypes: ['Code'] },
    };

    renderWithStore(
      <GroupingModule
        {...mockProps}
        dataSourceFormState={dataSourceFormState}
      />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            widgetId: 123,
            isOpen: true,
            dataSourceFormState,
          },
          activeWidgets: {
            123: {
              widget: {
                chart_elements: [MOCK_CHART_ELEMENTS[0]],
              },
            },
          },
          groupings: [
            {
              name: 'TableMetric',
              groupings: [{ key: 'athlete_id' }, { key: 'side' }],
            },
            {
              name: 'activity',
              groupings: [{ key: 'athlete_id' }],
            },
          ],
        },
      }
    );
    await user.click(screen.getByLabelText('Group by'));
    expect(screen.getByText('Shared data groupings')).toBeInTheDocument();
    expect(screen.getByText('Unique data groupings')).toBeInTheDocument();
  });

  it('should display categorized groupings where both chart elements have unique groupings', async () => {
    const user = userEvent.setup();

    const dataSourceFormState = {
      ...MOCK_CHART_ELEMENTS[1],
      input_params: { subtypes: ['Code'] },
    };

    renderWithStore(
      <GroupingModule
        {...mockProps}
        dataSourceFormState={dataSourceFormState}
      />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            widgetId: 123,
            isOpen: true,
            dataSourceFormState,
          },
          activeWidgets: {
            123: {
              widget: {
                chart_elements: [MOCK_CHART_ELEMENTS[0]],
              },
            },
          },
          groupings: [
            // Side is unique
            {
              name: 'TableMetric',
              groupings: [
                {
                  key: 'side',
                },
                {
                  key: 'athlete_id',
                },
              ],
            },
            // Squad is unique
            {
              name: 'activity',
              groupings: [
                {
                  key: 'athlete_id',
                },
                {
                  key: 'squad',
                },
              ],
            },
          ],
        },
      }
    );
    await user.click(screen.getByLabelText('Group by'));
    expect(screen.getByText('Shared data groupings')).toBeInTheDocument();
    expect(screen.getByText('Unique data groupings')).toBeInTheDocument();
  });

  it('should not categorize groupings with one chart element', async () => {
    const user = userEvent.setup();

    const dataSourceFormState = {
      ...MOCK_CHART_ELEMENTS[0],
      input_params: { subtypes: ['Code'] },
    };
    renderWithStore(
      <GroupingModule {...mockProps} />,
      {},
      {
        [REDUCER_KEY]: {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            widgetId: 123,
            isOpen: true,
            dataSourceFormState,
          },
          activeWidgets: {
            123: {
              widget: {
                chart_elements: [MOCK_CHART_ELEMENTS[0]],
              },
            },
          },
          groupings: [
            {
              name: 'TableMetric',
              groupings: [
                {
                  key: 'squad',
                },
                {
                  key: 'athlete_id',
                },
              ],
            },
            {
              name: 'activity',
              groupings: [
                {
                  key: 'athlete_id',
                },
              ],
            },
          ],
        },
      }
    );
    await user.click(screen.getByLabelText('Group by'));
    expect(screen.queryByText('Shared data groupings')).not.toBeInTheDocument();
    expect(screen.queryByText('Unique data groupings')).not.toBeInTheDocument();
  });

  it('should not categorize groupings in a combo chart with same datasource type', async () => {
    const user = userEvent.setup();
    // The chart has two `TableMetric` datasources added

    const dataSourceFormState = {
      id: 2,
      data_source_type: 'TableMetric',
      input_params: { subtypes: ['Code'] },
    };
    renderWithStore(
      <GroupingModule {...mockProps} />,
      {},
      {
        [REDUCER_KEY]: {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            widgetId: 123,
            isOpen: true,
            dataSourceFormState,
          },
          activeWidgets: {
            123: {
              widget: {
                chart_elements: [MOCK_CHART_ELEMENTS[0]],
              },
            },
          },
          groupings: [
            {
              name: 'TableMetric',
              groupings: [
                {
                  key: 'athlete_id',
                },
                {
                  key: 'squad',
                },
              ],
            },
          ],
        },
      }
    );
    await user.click(screen.getByLabelText('Group by'));
    expect(screen.queryByText('Shared data groupings')).not.toBeInTheDocument();
    expect(screen.queryByText('Unique data groupings')).not.toBeInTheDocument();
  });

  it('should preselect the common grouping when a second chart element is added', async () => {
    const dataSourceFormState = {
      id: 23,
      data_source_type: 'activity',
      input_params: { subtypes: ['Code'] },
    };
    renderWithStore(
      <GroupingModule
        {...mockProps}
        dataSourceFormState={dataSourceFormState}
      />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            isOpen: true,
            dataSourceFormState,
            widgetId: 123,
          },
          activeWidgets: {
            123: {
              widget: {
                chart_elements: [MOCK_CHART_ELEMENTS[0]],
              },
            },
          },
          groupings: [
            {
              name: 'TableMetric',
              groupings: [
                { key: 'grouping_a', name: 'grouping_a' },
                {
                  key: 'squad',
                  name: 'Squad',
                },
              ],
            },
            {
              name: 'activity',
              groupings: [
                { key: 'grouping_a', name: 'grouping_a' },
                {
                  key: 'athlete_id',
                  name: 'Athlete',
                },
              ],
            },
          ],
        },
      }
    );
    expect(screen.getByText('grouping_a')).toBeInTheDocument();
  });

  it('should preselect the common grouping when a second chart element is added to Formula data source', async () => {
    const dataSourceFormState = {
      id: 23,
      data_source_type: 'Formula',
      input_params: { A: { data_source_type: 'activity' } },
    };
    renderWithStore(
      <GroupingModule
        {...mockProps}
        dataSourceFormState={dataSourceFormState}
      />,
      {},
      {
        [REDUCER_KEY]: {
          ...initialState,
          dataSourceSidePanel: {
            isOpen: true,
            dataSourceFormState,
            widgetId: 123,
          },
          activeWidgets: {
            123: {
              widget: {
                chart_elements: [MOCK_CHART_ELEMENTS[0]],
              },
            },
          },
          groupings: [
            {
              name: 'TableMetric',
              groupings: [
                { key: 'grouping_a', name: 'grouping_a' },
                {
                  key: 'squad',
                  name: 'Squad',
                },
              ],
            },
            {
              name: 'activity',
              groupings: [
                { key: 'grouping_a', name: 'grouping_a' },
                {
                  key: 'athlete_id',
                  name: 'Athlete',
                },
              ],
            },
          ],
        },
      }
    );
    expect(screen.getByText('grouping_a')).toBeInTheDocument();
  });

  it('should display an initial warning when a chart element has unique grouping saved', async () => {
    const dataSourceFormState = {
      ...MOCK_CHART_ELEMENTS[1],
      input_params: { subtypes: ['Code'] },
    };

    renderWithStore(
      <GroupingModule
        {...mockProps}
        dataSourceFormState={dataSourceFormState}
      />,
      {},
      {
        [REDUCER_KEY]: {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            isOpen: true,
            widgetId: 123,
            dataSourceFormState,
          },
          activeWidgets: {
            123: {
              widget: {
                chart_elements: [MOCK_CHART_ELEMENTS[0]],
              },
            },
          },
          groupings: [
            {
              name: 'TableMetric',
              groupings: [
                {
                  key: 'athlete_id',
                },
                {
                  key: 'squad',
                },
              ],
            },
            {
              name: 'activity',
              groupings: [
                {
                  key: 'athlete_id',
                },
              ],
            },
          ],
        },
      }
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Warning Choose a grouping to view Chart'
    );
  });

  it('should display warning when one of the elements has unique grouping', async () => {
    const widget = {
      chart_elements: [
        {
          ...MOCK_CHART_ELEMENTS[0],
          config: {
            ...MOCK_CHART_ELEMENTS[0].config,
            groupings: ['squad_id'],
          },
        },
        {
          ...MOCK_CHART_ELEMENTS[1],
          config: {
            ...MOCK_CHART_ELEMENTS[1].config,
            groupings: ['athlete_id'],
          },
        },
      ],
    };

    const dataSourceFormState = {
      ...widget.chart_elements[0],
    };
    renderWithStore(
      <GroupingModule
        {...mockProps}
        primaryGrouping="squad_id"
        secondaryGrouping="athlete_id"
      />,
      {},
      {
        [REDUCER_KEY]: {
          ...MOCK_CHART_BUILDER,
          dataSourceSidePanel: {
            widgetId: 123,
            isOpen: true,
            dataSourceFormState,
          },
          activeWidgets: {
            123: {
              widget,
            },
          },
          groupings: [
            {
              name: 'TableMetric',
              groupings: [
                {
                  key: 'athlete_id',
                },
                {
                  key: 'squad_id',
                },
              ],
            },
            {
              name: 'activity',
              groupings: [
                {
                  key: 'athlete_id',
                },
              ],
            },
          ],
        },
      }
    );
    const deactivatedChartElement =
      widget.chart_elements[1].config.render_options.name;
    expect(screen.getByRole('alert')).toHaveTextContent(
      `Selecting a grouping that is not common to all data sources will hide ${deactivatedChartElement} from the chart.`
    );
  });

  describe('Week of Training grouping', () => {
    it('shows micro_cycle grouping displayed as "Week of Training" when "rep-defense-bmt-mvp" is true', async () => {
      window.featureFlags = { 'rep-defense-bmt-mvp': true };
      const user = userEvent.setup();

      renderWithStore(
        <GroupingModule {...mockProps} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              dataSourceFormState: {
                data_source_type: 'TableMetric',
              },
            },
            groupings: MOCK_CATEGORIZED_GROUPINGS,
          },
        }
      );

      await user.click(screen.getByLabelText('Group by'));

      expect(screen.getByText('Week of Training')).toBeInTheDocument();
    });

    it('hides micro_cycle grouping displayed as "Week of Training" when "rep-defense-bmt-mvp" is false', async () => {
      window.featureFlags = {};
      const user = userEvent.setup();

      renderWithStore(
        <GroupingModule {...mockProps} />,
        {},
        {
          [REDUCER_KEY]: {
            ...initialState,
            activeWidgets: {},
            dataSourceSidePanel: {
              dataSourceFormState: {
                data_source_type: 'TableMetric',
              },
            },
            groupings: MOCK_CATEGORIZED_GROUPINGS,
          },
        }
      );

      await user.click(screen.getByLabelText('Group by'));

      expect(screen.queryByText('Week of Training')).not.toBeInTheDocument();
    });
  });
});
