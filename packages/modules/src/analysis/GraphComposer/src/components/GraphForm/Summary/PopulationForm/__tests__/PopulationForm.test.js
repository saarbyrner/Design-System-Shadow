import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DummyAthletes } from '@kitman/modules/src/analysis/GraphComposer/resources/DummyData';
import PopulationForm from '..';

jest.mock(
  '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/SessionDateRangeSection',
  () => {
    return {
      SessionDateRangeTranslated: function MockSessionDateRange(props) {
        return (
          <div data-testid="session-date-range">
            <button
              type="button"
              onClick={() => props.populateDrillsForm?.(0, 'training_session')}
            >
              Populate Drills
            </button>
            <button
              type="button"
              onClick={() =>
                props.updateDateRange?.({
                  start_date: 'today',
                  end_date: 'tomorrow',
                })
              }
            >
              Update Date Range
            </button>
          </div>
        );
      },
    };
  }
);

jest.mock('@kitman/components', () => ({
  Dropdown: function MockDropdown(props) {
    return (
      <div data-testid="dropdown">
        <label>{props.label}</label>
        <select
          value={props.value || ''}
          onChange={(e) => props.onChange?.(e.target.value)}
        >
          {props.items?.map((item) => (
            <option key={item.id || item.title || item} value={item.id || item}>
              {item.name || item.title || item}
            </option>
          ))}
        </select>
      </div>
    );
  },
  IconButton: function MockIconButton(props) {
    return (
      <button
        type="button"
        data-testid="icon-button"
        disabled={props.isDisabled}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    );
  },
  InputRadio: function MockInputRadio(props) {
    return (
      <input
        data-testid="input-radio"
        type="radio"
        name={props.inputName}
        disabled={props.disabled}
        checked={props.value === props.option?.value}
        onChange={props.change}
      />
    );
  },
  LastXPeriodOffset: function MockLastXPeriodOffset() {
    return <div data-testid="last-x-period-offset" />;
  },
}));

jest.mock(
  '@kitman/modules/src/analysis/GraphComposer/src/components/GraphForm/FilterSection',
  () => {
    return {
      FilterSectionTranslated: function MockFilterSection() {
        return <div data-testid="filter-section" />;
      },
    };
  }
);

describe('Graph Composer <PopulationForm /> component', () => {
  const defaultProps = {
    athletes: DummyAthletes,
    population: {
      athletes: null,
      calculation: null,
      timePeriod: 'last_x_day',
      event_type_time_period: 'last_x_day',
      dateRange: { start_date: 'today', end_date: 'tomorrow' },
    },
    comparisonGroupIndex: 0,
    deletePopulation: jest.fn(),
    updateAthletes: jest.fn(),
    updateCalculation: jest.fn(),
    updateDateRange: jest.fn(),
    updateTimePeriod: jest.fn(),
    updateComparisonGroup: jest.fn(),
    populateDrillsForm: jest.fn(),
    turnaroundList: ['turnaroud1', 'turnaroud2'],
    isDeleteDisabled: false,
    scaleType: 'normalized',
    t: (key) => key,
  };

  beforeEach(() => {
    window.featureFlags = {};
    jest.clearAllMocks();
  });

  it('renders', () => {
    render(<PopulationForm {...defaultProps} />);
    expect(screen.getByTestId('session-date-range')).toBeInTheDocument();
  });

  it('contains an athletes dropdown', () => {
    const population = {
      athletes: 'applies_to_squad',
      calculation: null,
      timePeriod: null,
    };
    render(<PopulationForm {...defaultProps} population={population} />);

    const athleteDropdowns = screen.getAllByTestId('dropdown');
    const athleteDropdown = athleteDropdowns[0];

    expect(athleteDropdown).toBeInTheDocument();
    expect(athleteDropdown).toHaveTextContent('#sport_specific__Athletes');
  });

  it('calls updateAthletes() when interacting with the athletes dropdown', async () => {
    const user = userEvent.setup();
    render(<PopulationForm {...defaultProps} index={4} />);

    const athleteDropdowns = screen.getAllByTestId('dropdown');
    const athleteSelect = athleteDropdowns[0].querySelector('select');

    await user.selectOptions(athleteSelect, 'applies_to_squad');
    expect(defaultProps.updateAthletes).toHaveBeenCalledWith(
      4,
      'applies_to_squad'
    );
  });

  it('contains an calculation dropdown', () => {
    const population = {
      athletes: null,
      calculation: 'sum',
      timePeriod: null,
    };
    render(<PopulationForm {...defaultProps} population={population} />);

    const dropdowns = screen.getAllByTestId('dropdown');
    const calculationDropdown = dropdowns[1];

    expect(calculationDropdown).toBeInTheDocument();
    expect(calculationDropdown).toHaveTextContent('Calculation');
  });

  it('contains the calculation type last when the scale type is denormilized', () => {
    render(<PopulationForm {...defaultProps} scaleType="denormalized" />);

    const dropdowns = screen.getAllByTestId('dropdown');
    const calculationSelect = dropdowns[1].querySelector('select');
    const firstOption = calculationSelect.querySelector('option');

    expect(firstOption).toHaveValue('last');
  });

  it('calls updateCalculation() when interacting with the calculation dropdown', async () => {
    const user = userEvent.setup();
    render(<PopulationForm {...defaultProps} index={4} />);

    const dropdowns = screen.getAllByTestId('dropdown');
    const calculationSelect = dropdowns[1].querySelector('select');

    await user.selectOptions(calculationSelect, 'max');
    expect(defaultProps.updateCalculation).toHaveBeenCalledWith(4, 'max');
  });

  it('displays a session date range component', () => {
    render(<PopulationForm {...defaultProps} />);

    const sessionDateRange = screen.getByTestId('session-date-range');
    expect(sessionDateRange).toBeInTheDocument();
  });

  describe('when the graphing-offset-calc feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag('graphing-offset-calc', true);
    });

    it('renders an last x days offset component when the time period is last_x_days', () => {
      render(
        <PopulationForm
          {...defaultProps}
          population={{
            ...defaultProps.population,
            event_type_time_period: 'last_x_days',
          }}
        />
      );

      expect(screen.getByTestId('last-x-period-offset')).toBeInTheDocument();
    });
  });

  it('calls updateTimePeriod() when interacting with the session/time period dropdown', async () => {
    const user = userEvent.setup();
    render(<PopulationForm {...defaultProps} index={4} />);

    const populateDrillsButton = screen.getByText('Populate Drills');
    await user.click(populateDrillsButton);

    expect(defaultProps.populateDrillsForm).toHaveBeenCalledWith(
      0,
      'training_session'
    );
  });

  it('calls updateDateRange() when interacting with the date range dropdown', async () => {
    const user = userEvent.setup();
    render(<PopulationForm {...defaultProps} index={4} />);

    const updateDateRangeButton = screen.getByText('Update Date Range');
    await user.click(updateDateRangeButton);

    expect(defaultProps.updateDateRange).toHaveBeenCalledWith({
      start_date: 'today',
      end_date: 'tomorrow',
    });
  });

  it('contains a delete button', () => {
    render(<PopulationForm {...defaultProps} />);

    const deleteButton = screen.getByTestId('icon-button');
    expect(deleteButton).toBeInTheDocument();
  });

  it('deletes the population when clicking the delete button', async () => {
    const user = userEvent.setup();
    render(<PopulationForm {...defaultProps} />);

    const deleteButton = screen.getByTestId('icon-button');
    await user.click(deleteButton);

    expect(defaultProps.deletePopulation).toHaveBeenCalledTimes(1);
  });

  it('enables the delete button if isDeleteDisabled is false', () => {
    render(<PopulationForm {...defaultProps} isDeleteDisabled={false} />);

    const deleteButton = screen.getByTestId('icon-button');
    expect(deleteButton).toBeEnabled();
  });

  it('disables the delete button if isDeleteDisabled is true', () => {
    render(<PopulationForm {...defaultProps} isDeleteDisabled />);

    const deleteButton = screen.getByTestId('icon-button');
    expect(deleteButton).toBeDisabled();
  });

  it('contains a comparison group input', () => {
    render(
      <PopulationForm {...defaultProps} index={4} comparisonGroupIndex={3} />
    );

    const comparisonGroupInput = screen.getByTestId('input-radio');
    expect(comparisonGroupInput).toBeInTheDocument();
    expect(comparisonGroupInput).toHaveAttribute('name', 'comparison_group');
  });

  it('enables comparison group if isComparisonGroupDisabled is false', () => {
    render(
      <PopulationForm {...defaultProps} isComparisonGroupDisabled={false} />
    );

    const comparisonGroupInput = screen.getByTestId('input-radio');
    expect(comparisonGroupInput).toBeEnabled();
  });

  it('disables comparison group if isComparisonGroupDisabled is true', () => {
    render(<PopulationForm {...defaultProps} isComparisonGroupDisabled />);

    const comparisonGroupInput = screen.getByTestId('input-radio');
    expect(comparisonGroupInput).toBeDisabled();
  });

  it('selects the current population when clicking the comparison group input', async () => {
    const user = userEvent.setup();
    render(<PopulationForm {...defaultProps} index={4} />);

    const comparisonGroupInput = screen.getByTestId('input-radio');
    await user.click(comparisonGroupInput);

    expect(defaultProps.updateComparisonGroup).toHaveBeenCalledWith(4);
  });

  describe('when the metric-session-filter feature flag is enabled', () => {
    beforeEach(() => {
      window.setFlag('metric-session-filter', true);
    });

    afterEach(() => {
      window.setFlag('metric-session-filter', false);
    });

    it('displays a filter component', () => {
      render(<PopulationForm {...defaultProps} />);
      expect(screen.getByTestId('filter-section')).toBeInTheDocument();
    });
  });
});
