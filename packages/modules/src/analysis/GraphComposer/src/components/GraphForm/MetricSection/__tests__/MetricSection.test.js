import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { blankStatus } from '@kitman/common/src/utils/status_utils';
import MetricSection from '..';

describe('MetricSection', () => {
  const availableVariables = [
    {
      id: 1,
      key: 'msk',
      localised_unit: '1-10',
      name: 'Abdominal',
      source_key: 'kitman:stiffness_indication|abdominal',
      source_name: 'Stiffness',
      type: 'scale',
    },
  ];

  const squadAthletes = {
    position_groups: [
      {
        id: '1',
        name: 'Position Group',
        positions: [
          {
            id: '1',
            name: 'Position',
            athletes: [
              {
                id: '1',
                fullname: 'Athlete',
              },
            ],
          },
        ],
      },
    ],
  };

  const squadSelection = {
    athletes: [],
    positions: [],
    position_groups: [],
    applies_to_squad: false,
  };

  const metric = {
    status: blankStatus(),
    squad_selection: squadSelection,
  };

  const defaultProps = {
    graphGroup: 'longitudinal',
    squadAthletes,
    metric,
    index: 0,
    availableVariables,
    t: (key) => key,
    updateStatus: jest.fn(),
    updateSquadSelection: jest.fn(),
    updateDateRange: jest.fn(),
    populateDrills: jest.fn(),
    updateSelectedGames: jest.fn(),
    updateSelectedTrainingSessions: jest.fn(),
    updateEventBreakdown: jest.fn(),
    populateTrainingSessions: jest.fn(),
    populateGames: jest.fn(),
    populateDrillsForm: jest.fn(),
    updateTimePeriodLength: jest.fn(),
    updateLastXTimePeriod: jest.fn(),
    updateTimePeriodLengthOffset: jest.fn(),
    updateLastXTimePeriodOffset: jest.fn(),
    updateEventTypeFilters: jest.fn(),
    updateTrainingSessionTypeFilters: jest.fn(),
    addFilter: jest.fn(),
    removeFilter: jest.fn(),
    eventTypes: [],
    trainingSessionTypes: [],
    dateRange: {},
    turnaroundList: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders core form elements', () => {
    render(<MetricSection {...defaultProps} />);

    expect(screen.getByText('Sessions / Periods')).toBeInTheDocument();
    expect(screen.getByText('Data Source')).toBeInTheDocument();
    expect(screen.getByText('Calculation')).toBeInTheDocument();
    expect(screen.getByText('#sport_specific__Athletes')).toBeInTheDocument();
  });

  it('displays data source dropdown with search functionality', () => {
    render(<MetricSection {...defaultProps} />);

    expect(screen.getByText('Data Source')).toBeInTheDocument();

    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toBeInTheDocument();

    expect(screen.getByText('Stiffness')).toBeInTheDocument();
  });

  it('shows calculation options in dropdown', () => {
    render(<MetricSection {...defaultProps} />);

    expect(screen.getByText('Last Value')).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Mean')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
    expect(screen.getByText('Sum')).toBeInTheDocument();
  });

  it('renders sessions/periods dropdown with grouped options', () => {
    render(<MetricSection {...defaultProps} />);

    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Rolling Period')).toBeInTheDocument();
    expect(screen.getByText('Season')).toBeInTheDocument();
    expect(screen.getByText('Set Period')).toBeInTheDocument();
  });

  it('shows extended calculation options when feature flags are enabled', () => {
    window.setFlag('graph-pipeline-migration-value_visualisation', true);

    render(
      <MetricSection {...defaultProps} graphGroup="value_visualisation" />
    );

    // basic calculation options
    expect(screen.getByText('Last Value')).toBeInTheDocument();
    expect(screen.getByText('Sum')).toBeInTheDocument();
    expect(screen.getByText('Mean')).toBeInTheDocument();
    // extended calculation options
    expect(screen.getByText('Sum (Absolute)')).toBeInTheDocument();
    expect(screen.getByText('Count (Absolute)')).toBeInTheDocument();
    expect(screen.getByText('Min (Absolute)')).toBeInTheDocument();
    expect(screen.getByText('Max (Absolute)')).toBeInTheDocument();
  });

  it('displays athlete selector with proper structure', () => {
    render(<MetricSection {...defaultProps} />);

    const athleteSelector = screen.getByTestId('DropdownWrapper');
    expect(athleteSelector).toBeInTheDocument();
    expect(screen.getByText('#sport_specific__Athletes')).toBeInTheDocument();
  });
});
