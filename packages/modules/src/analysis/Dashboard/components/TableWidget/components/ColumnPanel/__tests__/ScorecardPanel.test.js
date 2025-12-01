import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import ScorecardPanel from '../components/ScorecardPanel';

describe('<ScorecardPanel />', () => {
  const defaultProps = {
    t: (key) => key,
    selectedPopulation: {
      applies_to_squad: false,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    squadAthletes: {
      position_groups: [],
    },
    squads: [],
    isLoading: false,
    isEditMode: false,
    isOpen: false,
    dateRange: {},
    onSetDateRange: jest.fn(),
    onSetTimePeriod: jest.fn(),
    onSetTimePeriodLength: jest.fn(),
    onSetTimePeriodLengthOffset: jest.fn(),
    onSetPopulation: jest.fn(),
    onApply: jest.fn(),
    timePeriod: '',
    timePeriodLength: 0,
    timePeriodLengthOffset: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithStore(<ScorecardPanel {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('renders the AthleteModule component', () => {
    renderWithStore(<ScorecardPanel {...defaultProps} />);

    expect(screen.getByLabelText('Athlete')).toBeInTheDocument();
  });

  it('renders the DateRangeModule component', () => {
    renderWithStore(<ScorecardPanel {...defaultProps} />);

    expect(screen.getByLabelText('Date')).toBeInTheDocument();
  });

  describe('for the actions footer', () => {
    it('renders the add another checkbox', () => {
      renderWithStore(<ScorecardPanel {...defaultProps} />);

      expect(screen.getByLabelText('Add another')).toBeInTheDocument();
    });

    it('renders the Apply button', () => {
      renderWithStore(<ScorecardPanel {...defaultProps} />);

      expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    });

    it('disables the text button if timePeriod and athlete are empty', () => {
      renderWithStore(<ScorecardPanel {...defaultProps} />);

      const applyButton = screen.getByRole('button', { name: 'Apply' });
      expect(applyButton).toBeDisabled();
    });

    it('enables the text button when valid population and timePeriod are provided', () => {
      const propsWithValidData = {
        ...defaultProps,
        selectedPopulation: {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        timePeriod: 'today',
      };

      renderWithStore(<ScorecardPanel {...propsWithValidData} />);

      const applyButton = screen.getByRole('button', { name: 'Apply' });
      expect(applyButton).toBeEnabled();
    });

    it('passes the value of add another checkbox to the onApply', async () => {
      const user = userEvent.setup();
      const mockOnApply = jest.fn();
      const propsWithValidData = {
        ...defaultProps,
        selectedPopulation: {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        timePeriod: 'today',
        onApply: mockOnApply,
      };

      renderWithStore(<ScorecardPanel {...propsWithValidData} />);

      const applyButton = screen.getByRole('button', { name: 'Apply' });
      const addAnotherCheckbox = screen.getByLabelText('Add another');

      await user.click(applyButton);
      expect(mockOnApply).toHaveBeenCalledWith(false);

      await user.click(addAnotherCheckbox);

      await user.click(applyButton);
      expect(mockOnApply).toHaveBeenCalledWith(true);
    });
  });

  describe('when the graph-squad-selector is true', () => {
    beforeEach(() => {
      window.setFlag('graph-squad-selector', true);
    });

    it('renders the SquadModule and hides the AthleteModule', () => {
      renderWithStore(<ScorecardPanel {...defaultProps} />);

      expect(screen.getByLabelText('Athletes')).toBeInTheDocument();
      expect(screen.queryByLabelText('Athlete')).not.toBeInTheDocument();
    });
  });
});
