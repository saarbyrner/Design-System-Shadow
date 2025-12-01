import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterSection from '../index';

describe('<FilterSection />', () => {
  window.featureFlags = {};

  const defaultProps = {
    metricType: 'medical',
    filters: {
      time_loss: [],
      session_type: [],
      competitions: [],
      event_types: [],
      training_session_types: [],
    },
    addFilter: jest.fn(),
    removeFilter: jest.fn(),
    updateTimeLossFilters: jest.fn(),
    updateSessionTypeFilters: jest.fn(),
    updateEventTypeFilters: jest.fn(),
    updateTrainingSessionTypeFilters: jest.fn(),
    updateCompetitionFilters: jest.fn(),
    sessionsTypes: [
      {
        id: 1,
        name: 'Rugby Game',
      },
      {
        id: 2,
        name: 'Gym Session',
      },
    ],
    eventTypes: [
      {
        id: 'game',
        name: 'Game',
      },
      {
        id: 'training_session',
        name: 'Training Session',
      },
    ],
    trainingSessionTypes: [],
    timeLossTypes: [
      {
        id: 1,
        name: 'Time-loss',
      },
      {
        id: 2,
        name: 'Non Time-loss',
      },
    ],
    competitions: [
      { id: 1, name: 'Champions league' },
      { id: 2, name: 'Europa league' },
    ],
    t: (text) => text,
  };

  const gameEventTypes = {
    id: 'game',
    name: 'Game',
    subItems: [
      {
        id: 'game',
        name: 'Game',
      },
    ],
  };

  const trainingSessionTypes = {
    id: 'training_session',
    name: 'Training Session',
    subItems: [
      {
        id: '294',
        name: 'Captains Run',
      },
      {
        id: '16',
        name: 'Academy Rugby',
      },
      {
        id: '10',
        name: 'Agility',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Time Loss filter', () => {
    it('renders a time loss filter dropdown', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.getByText('Time-loss (Filter)')).toBeInTheDocument();
    });

    it('calls updateTimeLossFilters with the clicked filter', async () => {
      const user = userEvent.setup();
      const { container } = render(<FilterSection {...defaultProps} />);

      // time-loss filter dropdown
      const timeLossDropdownHeader = container.querySelector(
        '.dropdownWrapper__header'
      );

      await user.click(timeLossDropdownHeader);

      const timeLossOption = screen.getByText('Time-loss');
      await user.click(timeLossOption);

      expect(defaultProps.updateTimeLossFilters).toHaveBeenCalledWith(['1']);
    });

    it('calls updateTimeLossFilters to remove the clicked filter', async () => {
      const user = userEvent.setup();
      const propsWithSelectedFilters = {
        ...defaultProps,
        filters: {
          ...defaultProps.filters,
          time_loss: ['2', '1'],
        },
      };
      const { container } = render(
        <FilterSection {...propsWithSelectedFilters} />
      );

      const timeLossDropdownHeader = container.querySelector(
        '.dropdownWrapper__header'
      );

      await user.click(timeLossDropdownHeader);

      const nonTimeLossOption = screen.getByText('Non Time-loss');
      await user.click(nonTimeLossOption);

      // Should remove the clicked filter, leaving only the other one
      expect(defaultProps.updateTimeLossFilters).toHaveBeenCalledWith(['1']);
    });
  });

  it('renders a remove filter button and calls props.removeFilter when clicked', async () => {
    const user = userEvent.setup();
    render(<FilterSection {...defaultProps} />);

    const removeButton = screen.getByRole('button');

    expect(removeButton).toBeInTheDocument();

    await user.click(removeButton);

    expect(defaultProps.removeFilter).toHaveBeenCalledTimes(1);
  });

  describe('when filters is undefined', () => {
    it("doesn't render the filters section", () => {
      render(<FilterSection {...defaultProps} filters={undefined} />);

      expect(screen.queryByText('Time-loss (Filter)')).not.toBeInTheDocument();
    });

    it('renders an add filter button', async () => {
      const user = userEvent.setup();

      render(<FilterSection {...defaultProps} filters={undefined} />);

      const addFilterButton = screen.getByText('Filter');
      await user.click(addFilterButton);

      expect(defaultProps.addFilter).toHaveBeenCalledTimes(1);
    });
  });

  it('disables the session type dropdown when the medical category is illness', async () => {
    const user = userEvent.setup();
    const propsWithIllness = {
      ...defaultProps,
      medicalCategory: 'illness',
    };
    const { container } = render(<FilterSection {...propsWithIllness} />);

    // Session Type (Filter) - second dropdown
    const dropdownHeaders = container.querySelectorAll(
      '.dropdownWrapper__header'
    );
    const sessionTypeDropdownHeader = dropdownHeaders[1];

    // Try to click on the dropdown header
    await user.click(sessionTypeDropdownHeader);

    // the options should not be available for interaction
    const rugbyGameOption = screen.queryByText('Rugby Game');
    const gymSessionOption = screen.queryByText('Gym Session');
    expect(rugbyGameOption).not.toBeInTheDocument();
    expect(gymSessionOption).not.toBeInTheDocument();
  });

  it('disables the competition type dropdown when the medical category is illness', async () => {
    const user = userEvent.setup();
    const propsWithIllness = {
      ...defaultProps,
      medicalCategory: 'illness',
    };
    const { container } = render(<FilterSection {...propsWithIllness} />);

    // Competition dropdown header - third dropdown
    const dropdownHeaders = container.querySelectorAll(
      '.dropdownWrapper__header'
    );
    const competitionDropdownHeader = dropdownHeaders[2];

    // Try to click on the dropdown header
    await user.click(competitionDropdownHeader);

    // the options should not be available for interaction
    const championsLeagueOption = screen.queryByText('Champions league');
    const europaLeagueOption = screen.queryByText('Europa league');
    expect(championsLeagueOption).not.toBeInTheDocument();
    expect(europaLeagueOption).not.toBeInTheDocument();
  });

  describe('Session Type (Filter)', () => {
    it('renders a session type filter dropdown', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.getByText('Session Type (Filter)')).toBeInTheDocument();
    });

    it('calls updateSessionTypeFilters when selecting a new session type', async () => {
      const user = userEvent.setup();
      const { container } = render(<FilterSection {...defaultProps} />);

      // session type dropdown header - second dropdown
      const dropdownHeaders = container.querySelectorAll(
        '.dropdownWrapper__header'
      );
      const sessionTypeDropdownHeader = dropdownHeaders[1];

      await user.click(sessionTypeDropdownHeader);

      const rugbyGameOption = screen.getByText('Rugby Game');
      await user.click(rugbyGameOption);

      expect(defaultProps.updateSessionTypeFilters).toHaveBeenCalledWith(['1']);
    });

    it('calls updateSessionTypeFilters to remove the clicked filter', async () => {
      const user = userEvent.setup();
      const propsWithSelectedFilters = {
        ...defaultProps,
        filters: {
          ...defaultProps.filters,
          session_type: ['1', '2'], // Pre-selected filters
        },
      };
      const { container } = render(
        <FilterSection {...propsWithSelectedFilters} />
      );

      // session type dropdown - second dropdown
      const dropdownHeaders = container.querySelectorAll(
        '.dropdownWrapper__header'
      );
      const sessionTypeDropdownHeader = dropdownHeaders[1];

      await user.click(sessionTypeDropdownHeader);

      const rugbyGameOption = screen.getByText('Rugby Game');
      await user.click(rugbyGameOption);

      // Should remove the clicked filter, leaving only the other one
      expect(defaultProps.updateSessionTypeFilters).toHaveBeenCalledWith(['2']);
    });
  });

  describe('Competition (Filter)', () => {
    it('renders a competition filter dropdown', () => {
      render(<FilterSection {...defaultProps} />);

      expect(screen.getByText('Competition (Filter)')).toBeInTheDocument();
    });

    it('calls updateCompetitionFilters when selecting a new competition', async () => {
      const user = userEvent.setup();
      const { container } = render(<FilterSection {...defaultProps} />);

      // competition dropdown header - third dropdown
      const dropdownHeaders = container.querySelectorAll(
        '.dropdownWrapper__header'
      );
      const competitionDropdownHeader = dropdownHeaders[2];

      await user.click(competitionDropdownHeader);

      const europaLeagueOption = screen.getByText('Europa league');
      await user.click(europaLeagueOption);

      expect(defaultProps.updateCompetitionFilters).toHaveBeenCalledWith(['2']);
    });

    it('calls updateCompetitionFilters to remove the clicked filter', async () => {
      const user = userEvent.setup();
      const propsWithSelectedFilters = {
        ...defaultProps,
        filters: {
          ...defaultProps.filters,
          competitions: ['2', '1'], // Pre-selected filters
        },
      };
      const { container } = render(
        <FilterSection {...propsWithSelectedFilters} />
      );

      // competition dropdown header - third dropdown
      const dropdownHeaders = container.querySelectorAll(
        '.dropdownWrapper__header'
      );
      const competitionDropdownHeader = dropdownHeaders[2];

      await user.click(competitionDropdownHeader);

      const europaLeagueOption = screen.getByText('Europa league');
      await user.click(europaLeagueOption);

      expect(defaultProps.updateCompetitionFilters).toHaveBeenCalledWith(['1']);
    });
  });

  describe('when the metric-session-filter feature flag is enabled', () => {
    const propsWithComplexEventTypes = {
      ...defaultProps,
      eventTypes: [gameEventTypes],
      trainingSessionTypes: [trainingSessionTypes],
    };

    beforeEach(() => {
      window.setFlag('metric-session-filter', true);
    });

    afterEach(() => {
      window.setFlag('metric-session-filter', false);
    });

    it('renders an event type filter dropdown', () => {
      const metricProps = {
        ...defaultProps,
        metricType: 'metric',
      };
      render(<FilterSection {...metricProps} />);

      expect(screen.getByText('Session Type (Filter)')).toBeInTheDocument();
    });

    it('renders MultipleGroupSelector for event filter selection', () => {
      const metricProps = {
        ...propsWithComplexEventTypes,
        metricType: 'metric',
      };
      render(<FilterSection {...metricProps} />);

      expect(screen.getByText('Session Type (Filter)')).toBeInTheDocument();
    });

    it('calls updateEventTypeFilters with the clicked event filter', async () => {
      const user = userEvent.setup();

      const metricProps = {
        ...propsWithComplexEventTypes,
        metricType: 'metric',
      };
      const { container } = render(<FilterSection {...metricProps} />);

      const dropdownHeader = container.querySelector(
        '.dropdownWrapper__header'
      );
      await user.click(dropdownHeader);

      const gameCheckbox = screen.getByLabelText('Game');
      await user.click(gameCheckbox);

      expect(defaultProps.updateEventTypeFilters).toHaveBeenCalledWith([
        'game',
      ]);
    });

    it('calls updateTrainingSessionTypeFilters when selecting a training session type', async () => {
      const user = userEvent.setup();
      const metricProps = {
        ...propsWithComplexEventTypes,
        metricType: 'metric',
      };
      const { container } = render(<FilterSection {...metricProps} />);

      const dropdownHeader = container.querySelector(
        '.dropdownWrapper__header'
      );
      await user.click(dropdownHeader);

      const captainsRunCheckbox = screen.getByLabelText('Captains Run');
      await user.click(captainsRunCheckbox);

      expect(
        defaultProps.updateTrainingSessionTypeFilters
      ).toHaveBeenCalledWith([294]);
    });

    it('calls updateEventTypeFilters to remove the selected event filter', async () => {
      const user = userEvent.setup();
      const metricPropsWithSelectedFilters = {
        ...propsWithComplexEventTypes,
        metricType: 'metric',
        filters: {
          ...defaultProps.filters,
          event_types: ['game'],
          training_session_types: ['294'],
        },
      };
      const { container } = render(
        <FilterSection {...metricPropsWithSelectedFilters} />
      );

      // Open the MultipleGroupSelector dropdown
      const dropdownHeader = container.querySelector(
        '.dropdownWrapper__header'
      );
      await user.click(dropdownHeader);

      // Find and click the already selected game checkbox to deselect it
      const gameCheckbox = screen.getByLabelText('Game');
      await user.click(gameCheckbox);

      expect(defaultProps.updateEventTypeFilters).toHaveBeenCalledWith([]);
    });

    it('calls updateTrainingSessionTypeFilters to remove the selected training session filter', async () => {
      const user = userEvent.setup();
      const metricPropsWithSelectedFilters = {
        ...propsWithComplexEventTypes,
        metricType: 'metric',
        filters: {
          ...defaultProps.filters,
          event_types: ['game'],
          training_session_types: ['294'],
        },
      };
      const { container } = render(
        <FilterSection {...metricPropsWithSelectedFilters} />
      );

      // Open the MultipleGroupSelector dropdown
      const dropdownHeader = container.querySelector(
        '.dropdownWrapper__header'
      );
      await user.click(dropdownHeader);

      // Find and click the already selected training session checkbox to deselect it
      const captainsRunCheckbox = screen.getByLabelText('Captains Run');
      await user.click(captainsRunCheckbox);

      expect(
        defaultProps.updateTrainingSessionTypeFilters
      ).toHaveBeenCalledWith([]);
    });

    it('calls the appropriate functions when using Select All for a group', async () => {
      const user = userEvent.setup();
      const metricProps = {
        ...propsWithComplexEventTypes,
        metricType: 'metric',
      };
      const { container } = render(<FilterSection {...metricProps} />);

      const dropdownHeader = container.querySelector(
        '.dropdownWrapper__header'
      );
      await user.click(dropdownHeader);

      const selectAllButtons = screen.getAllByText('Select All');
      // The second "Select All" should be for Training Session group
      await user.click(selectAllButtons[1]);

      expect(
        defaultProps.updateTrainingSessionTypeFilters
      ).toHaveBeenCalledWith([294, 16, 10]);
    });

    it('calls the appropriate functions when using Clear for a group', async () => {
      const user = userEvent.setup();
      const metricPropsWithSelectedFilters = {
        ...propsWithComplexEventTypes,
        metricType: 'metric',
        filters: {
          ...defaultProps.filters,
          event_types: ['game'],
          training_session_types: ['294', '16'],
        },
      };
      const { container } = render(
        <FilterSection {...metricPropsWithSelectedFilters} />
      );

      const dropdownHeader = container.querySelector(
        '.dropdownWrapper__header'
      );
      await user.click(dropdownHeader);

      const clearButtons = screen.getAllByText('Clear');
      // The second "Clear" should be for Training Session group
      await user.click(clearButtons[1]);

      expect(
        defaultProps.updateTrainingSessionTypeFilters
      ).toHaveBeenCalledWith([]);
    });
  });
});
