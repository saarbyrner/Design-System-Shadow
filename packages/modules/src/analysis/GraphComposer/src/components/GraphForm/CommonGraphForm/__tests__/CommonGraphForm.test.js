import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { blankStatus } from '@kitman/common/src/utils/status_utils';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import CommonGraphForm from '..';

describe('<CommonGraphForm />', () => {
  const defaultMetric = {
    type: 'metric',
    status: blankStatus(),
    overlays: [],
    squad_selection: {
      applies_to_squad: false,
      selected_athletes: [],
      selected_position_groups: [],
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
  };

  const defaultProps = {
    graphGroup: 'longitudinal',
    graphType: 'line',
    metrics: [defaultMetric],
    timePeriod: '',
    squadAthletes: { position_groups: [] },
    permittedSquads: [],
    turnaroundList: [],
    dateRange: { from: null, to: null },
    availableVariables: [],
    athleteGroupsDropdown: [],
    categorySelections: [],
    sessionsTypes: [],
    eventTypes: [],
    trainingSessionTypes: [],
    timeLossTypes: [],
    competitions: [],
    canAccessMedicalGraph: true,
    deleteMetric: jest.fn(),
    updateStatus: jest.fn(),
    updateTimePeriod: jest.fn(),
    updateDateRange: jest.fn(),
    updateSquadSelection: jest.fn(),
    populateDrills: jest.fn(),
    updateEventBreakdown: jest.fn(),
    updateSelectedGames: jest.fn(),
    updateSelectedTrainingSessions: jest.fn(),
    addMetric: jest.fn(),
    addOverlay: jest.fn(),
    deleteOverlay: jest.fn(),
    addFilter: jest.fn(),
    removeFilter: jest.fn(),
    updateTimeLossFilters: jest.fn(),
    updateSessionTypeFilters: jest.fn(),
    updateCompetitionFilters: jest.fn(),
    loadPathologyOptions: jest.fn(),
    updateMetricStyle: jest.fn(),
    updateOverlaySummary: jest.fn(),
    updateOverlayPopulation: jest.fn(),
    updateOverlayTimePeriod: jest.fn(),
    updateOverlayDateRange: jest.fn(),
    populateDrillsForm: jest.fn(),
    populateTrainingSessions: jest.fn(),
    populateGames: jest.fn(),
    updateMeasurementType: jest.fn(),
    createGraph: jest.fn(),
    updateTimePeriodLength: jest.fn(),
    updateLastXTimePeriod: jest.fn(),
    updateTimePeriodLengthOffset: jest.fn(),
    updateLastXTimePeriodOffset: jest.fn(),
    updateCategory: jest.fn(),
    updateCategoryDivision: jest.fn(),
    updateCategorySelection: jest.fn(),
    updateDataType: jest.fn(),
    updateEventTypeFilters: jest.fn(),
    updateTrainingSessionTypeFilters: jest.fn(),
    t: (key) => key,
  };

  it('renders the CommonGraphForm component', () => {
    renderWithStore(<CommonGraphForm {...defaultProps} />);

    expect(screen.getByText('Build Graph')).toBeInTheDocument();
  });

  it('renders a form section for each metric', () => {
    renderWithStore(<CommonGraphForm {...defaultProps} />);

    // Element in MetricSection
    expect(screen.getByText('Sessions / Periods')).toBeInTheDocument();
  });

  it('renders a placeholder dropdown for each metric', () => {
    const { container } = renderWithStore(
      <CommonGraphForm {...defaultProps} canAccessMedicalGraph={false} />
    );

    // Check for placeholder dropdown classname as element names are not unique to this test case
    expect(
      container.getElementsByClassName('graphComposerDropdownPlaceholder')
        .length
    ).toBe(1);
  });

  it("doesn't contain an add and remove data type button if the graph group can only have one metric", () => {
    const { container } = renderWithStore(
      <CommonGraphForm {...defaultProps} graphGroup="summary_donut" />
    );

    expect(screen.queryByText('Data Type')).not.toBeInTheDocument();

    // add button
    expect(container.querySelector('.graphComposerAddMetricButton')).toBeNull();
    // delete button
    expect(container.querySelector('icon-close')).toBeNull();
  });

  it('contains an add data type button', () => {
    renderWithStore(
      <CommonGraphForm {...defaultProps} graphGroup="longitudinal" />
    );

    const addButton = screen.getByText('Data Type').closest('button');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();
  });

  it('calls addMetric() when the user clicks the add metric button', async () => {
    const user = userEvent.setup();

    renderWithStore(
      <CommonGraphForm {...defaultProps} graphGroup="longitudinal" />
    );

    const addButton = screen.getByText('Data Type').closest('button');
    await user.click(addButton);

    expect(defaultProps.addMetric).toHaveBeenCalledTimes(1);
  });

  it('contains a submit button', () => {
    renderWithStore(<CommonGraphForm {...defaultProps} />);

    const submitButtonElement = screen
      .getByText('Build Graph')
      .closest('button[type="submit"]');

    expect(submitButtonElement).toBeInTheDocument();
  });

  it('contains a form validator', () => {
    renderWithStore(<CommonGraphForm {...defaultProps} />);

    expect(screen.getByText('Build Graph')).toBeInTheDocument();
  });

  it('contains one metric section by default', () => {
    renderWithStore(<CommonGraphForm {...defaultProps} />);

    // Element in MetricSection
    expect(screen.getByText('Sessions / Periods')).toBeInTheDocument();
  });

  it('disables the delete button by default', () => {
    renderWithStore(
      <CommonGraphForm {...defaultProps} graphGroup="longitudinal" />
    );

    const deleteButton = screen
      .getAllByRole('button')
      .filter((button) => button.className.includes('icon-close'));

    expect(deleteButton).toHaveLength(1);
    expect(deleteButton[0]).toBeDisabled();
  });

  describe('When there are two metric sections', () => {
    const firstMetric = {
      type: 'metric',
      status: blankStatus(),
      overlays: [],
      squad_selection: {
        applies_to_squad: false,
        selected_athletes: [],
        selected_position_groups: [],
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
    };
    const secondMetric = {
      type: 'metric',
      status: blankStatus(),
      overlays: [],
      squad_selection: {
        applies_to_squad: false,
        selected_athletes: [],
        selected_position_groups: [],
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
    };

    it('contains two metric sections', () => {
      renderWithStore(
        <CommonGraphForm
          {...defaultProps}
          metrics={[firstMetric, secondMetric]}
        />
      );

      // Element in MetricSection
      expect(screen.getAllByText('Sessions / Periods')).toHaveLength(2);
    });

    it('renders an overlay section per metric', () => {
      renderWithStore(
        <CommonGraphForm
          {...defaultProps}
          metrics={[firstMetric, secondMetric]}
        />
      );

      expect(screen.getAllByText('Overlay')).toHaveLength(2);
    });
  });

  describe('when there are three metric sections', () => {
    const firstMetric = {
      type: 'metric',
      status: blankStatus(),
      overlays: [],
      squad_selection: {
        applies_to_squad: false,
        selected_athletes: [],
        selected_position_groups: [],
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
    };
    const secondMetric = {
      type: 'metric',
      status: blankStatus(),
      overlays: [],
      squad_selection: {
        applies_to_squad: false,
        selected_athletes: [],
        selected_position_groups: [],
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
    };
    const thirdMetric = {
      type: 'metric',
      status: blankStatus(),
      overlays: [],
      squad_selection: {
        applies_to_squad: false,
        selected_athletes: [],
        selected_position_groups: [],
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
    };

    it('contains three metric sections', () => {
      renderWithStore(
        <CommonGraphForm
          {...defaultProps}
          metrics={[firstMetric, secondMetric, thirdMetric]}
        />
      );

      expect(screen.getAllByText('Sessions / Periods')).toHaveLength(3);
    });

    it('renders an overlay section per metric', () => {
      renderWithStore(
        <CommonGraphForm
          {...defaultProps}
          metrics={[firstMetric, secondMetric, thirdMetric]}
        />
      );

      expect(screen.getAllByText('Overlay')).toHaveLength(3);
    });
  });

  describe('when the graph is event type', () => {
    const eventMetric = {
      type: 'metric',
      status: {
        ...blankStatus(),
        event_type_time_period: 'training_session',
      },
      overlays: [],
      squad_selection: {
        applies_to_squad: false,
        selected_athletes: [],
        selected_position_groups: [],
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
    };

    it('does not render an overlay section', () => {
      renderWithStore(
        <CommonGraphForm {...defaultProps} metrics={[eventMetric]} />
      );

      expect(screen.queryByText('Overlay')).not.toBeInTheDocument();
    });
  });

  it("doesn't render an update type dropdown if the graph group supports only one data type", () => {
    const { container } = renderWithStore(
      <CommonGraphForm
        {...defaultProps}
        graphGroup="summary_donut"
        canAccessMedicalGraph={false}
      />
    );

    expect(
      container.getElementsByClassName('graphComposerDropdownPlaceholder')
        .length
    ).toBe(1);
  });

  it('renders an update type dropdown', () => {
    renderWithStore(<CommonGraphForm {...defaultProps} />);

    expect(screen.getByText('Data type')).toBeInTheDocument();
    expect(screen.getAllByText('Metric Data')[0]).toBeInTheDocument();
  });

  describe('When the user changes a data type', () => {
    it('calls the correct callback', async () => {
      const user = userEvent.setup();
      renderWithStore(<CommonGraphForm {...defaultProps} />);

      // click dropdown
      await user.click(screen.getAllByText('Metric Data')[0]);
      // select new data type
      await user.click(screen.getByText('Medical Data'));

      expect(defaultProps.updateDataType).toHaveBeenCalledWith('medical', 0);
      expect(screen.getByText('Medical Data')).toBeInTheDocument();
    });
  });

  describe("When the user doesn't have the Medical Graph permission", () => {
    it('renders a placeholder dropdown', () => {
      const { container } = renderWithStore(
        <CommonGraphForm {...defaultProps} canAccessMedicalGraph={false} />
      );

      expect(
        container.getElementsByClassName('graphComposerDropdownPlaceholder')
          .length
      ).toBe(1);
    });
  });

  describe('When the metric is medical', () => {
    const medicalMetric = {
      type: 'medical',
      status: blankStatus(),
      overlays: [],
      squad_selection: {
        applies_to_squad: false,
        selected_athletes: [],
        selected_position_groups: [],
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
    };

    it('renders a MedicalSection and no OverlaySection', () => {
      renderWithStore(
        <CommonGraphForm {...defaultProps} metrics={[medicalMetric]} />
      );

      expect(screen.getByTestId('MedicalSection')).toBeInTheDocument();
      expect(screen.queryByText('Overlay')).not.toBeInTheDocument();
    });
  });

  it('shows metric style radio buttons when the graph type is combination', () => {
    renderWithStore(
      <CommonGraphForm {...defaultProps} graphType="combination" />
    );

    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Column')).toBeInTheDocument();
    expect(screen.getByText('Line')).toBeInTheDocument();
  });

  it('calls updateMetricStyle() when the user selects a metric style', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <CommonGraphForm {...defaultProps} graphType="combination" />
    );

    const lineOption = screen.getByDisplayValue('line');
    expect(lineOption).toBeInTheDocument();

    await user.click(screen.getByText('Column'));

    expect(defaultProps.updateMetricStyle).toHaveBeenCalledWith(0, 'column');
  });
});
