import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import moment from 'moment-timezone';
import InjuryOccurrence from '../../components/InjuryOccurrence';

jest.mock('@kitman/components', () => ({
  Checkbox: ({
    label,
    id,
    isChecked,
    toggle,
    isDisabled,
    isLabelPositionedOnTheLeft,
  }) => (
    <input
      type="checkbox"
      data-testid={id || label}
      aria-label={label}
      checked={isChecked}
      onChange={() => toggle({ checked: !isChecked })}
      disabled={isDisabled}
      className={isLabelPositionedOnTheLeft ? 'label-left' : ''}
    />
  ),
  DatePicker: ({ label, name, value, onDateChange, minDate, disabled }) => (
    <input
      type="date"
      aria-label={label}
      data-testid={name}
      name={name} // Ensure name attribute is set
      value={value ? value.substring(0, 10) : ''} // Assume value is ISO string, take YYYY-MM-DD part
      onChange={(e) => onDateChange(e.target.value)}
      min={minDate ? minDate.substring(0, 10) : ''} // Assume minDate is ISO string, take YYYY-MM-DD part
      disabled={disabled}
    />
  ),
  Dropdown: ({ label, name, items = [], value, onChange, disabled }) => (
    <select
      aria-label={label}
      data-testid={name || label}
      value={value === null ? '' : value} // Handle null as empty, 0 is a valid value
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.title}
        </option>
      ))}
    </select>
  ),
  GroupedDropdown: ({ label, options = [], value, onChange, isDisabled }) => (
    <select
      aria-label={label}
      data-testid={label}
      value={value === null ? '' : value} // Handle null as empty, 0 is a valid value
      onChange={(e) => {
        const selectedOption = options
          .flatMap((group) =>
            group.isGroupOption ? group.options || [] : [group]
          )
          .find(
            (opt) =>
              String(opt.key_name) === e.target.value ||
              String(opt.id) === e.target.value
          );
        // The component expects an object with id and type.
        // activityGroupOptions has key_name and type.
        // positionGroupOptions has key_name.
        // We need to map these to 'id' and 'type' for the component's updateActivity.
        if (selectedOption) {
          onChange({
            id: selectedOption.key_name || selectedOption.id,
            type: selectedOption.type,
            key_name: selectedOption.key_name,
            name: selectedOption.name,
          });
        } else {
          onChange({ id: null, type: null, key_name: null, name: null });
        }
      }}
      disabled={isDisabled}
    >
      {options.map((group, groupIndex) =>
        group.isGroupOption ? (
          <optgroup
            key={group.name || `group-${groupIndex}`}
            label={group.name}
          >
            {(group.options || []).map((item, itemIndex) => (
              <option
                key={
                  item.key_name || item.id || `item-${groupIndex}-${itemIndex}`
                }
                value={item.key_name || item.id}
              >
                {item.name || item.title}
              </option>
            ))}
          </optgroup>
        ) : (
          <option
            key={group.key_name || group.id || `group-${groupIndex}`}
            value={group.key_name || group.id}
          >
            {group.name || group.title}
          </option>
        )
      )}
    </select>
  ),
  InputNumeric: ({ label, optional, value, onChange, disabled }) => (
    <input
      type="number"
      aria-label={label}
      data-testid={label}
      value={value === null ? '' : value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={optional ? 'Optional' : ''}
      disabled={disabled}
    />
  ),
}));

describe('Athlete Injury Editor <InjuryOccurrence /> component', () => {
  let props;

  beforeEach(() => {
    props = {
      activityGroupOptions: [
        { id: '', name: '', key_name: '', type: '' }, // Empty option
        {
          isGroupOption: true,
          name: 'Rugby training',
          options: [{ name: 'Conditionning', key_name: 0, type: 'Training' }],
        },
        {
          isGroupOption: true,
          name: 'Rugby game',
          options: [{ name: 'Match', key_name: 1, type: 'Game' }],
        },
      ],
      periodTerm: 'Custom Period',
      positionGroupOptions: [
        { id: '', name: '', key_name: '' }, // Empty option
        {
          isGroupOption: true,
          name: 'Forward',
          options: [
            { name: 'Hooker', key_name: 1 },
            { name: 'No. 8', key_name: 2 },
          ],
        },
        {
          isGroupOption: true,
          name: 'Back',
          options: [
            { name: 'Scrum Half', key_name: 3 },
            { name: 'Out Half', key_name: 4 },
          ],
        },
      ],
      gameOptions: [
        { id: '', title: '' }, // Empty option
        { id: 0, title: 'Unlisted game' },
        {
          id: 3,
          title: 'Ireland vs Scotland',
          date: '2018-11-10T00:00:00+00:00', // Use ISO format for consistency
        },
      ],
      periodOptions: [
        // Add periodOptions to props
        { id: '', title: '' }, // Empty option
        { id: 345, title: 'First Half' },
        { id: 346, title: 'Second Half' },
      ],
      trainingSessionOptions: [
        { id: '', title: '' }, // Empty option
        { id: 0, title: 'Conditionning 10/01/2018' },
        { id: 1, title: 'Sprint 10/01/2018' },
      ],
      activityType: null,
      activity: null,
      occurrenceDate: null,
      game: null,
      gameTime: null,
      periodId: null, // Initialize periodId
      trainingSession: null,
      isSessionCompleted: null,
      positionGroupId: null,
      isFetchingGameAndTrainingOptions: false,
      getGameAndTrainingOptions: jest.fn(),
      updateOccurrenceDate: jest.fn(),
      updateActivity: jest.fn(),
      updateTrainingSession: jest.fn(),
      updateGame: jest.fn(),
      updateGameTime: jest.fn(),
      updatePeriod: jest.fn(),
      updatePositionGroup: jest.fn(),
      updateSessionCompleted: jest.fn(),
      formType: 'INJURY',
      priorResolvedDate: '2018-06-06T00:00:00+01:00',
      isDisabled: false,
      t: (key) => key,
    };
  });

  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  it('renders', () => {
    render(<InjuryOccurrence {...props} />);
    // screen.debug(undefined, Infinity); // Temporarily add debug to inspect DOM
    expect(screen.getByLabelText('Date of Injury')).toBeInTheDocument();
  });

  it('renders a date picker', () => {
    render(<InjuryOccurrence {...props} />);
    const datepicker = screen.getByLabelText('Date of Injury');
    expect(datepicker).toBeInTheDocument();
    expect(datepicker).toHaveAttribute('name', 'InjuryOccurrenceDate');
    expect(datepicker).toHaveAttribute('min', '2018-06-06');
  });

  it('calls the correct action when editing the occurrenceDate', () => {
    const { updateOccurrenceDate, getGameAndTrainingOptions } = props;
    render(<InjuryOccurrence {...props} />);

    const datePicker = screen.getByLabelText('Date of Injury');
    const newDate = '2021-11-02';
    fireEvent.change(datePicker, { target: { value: newDate } });

    expect(updateOccurrenceDate).toHaveBeenCalledWith(newDate);
    expect(getGameAndTrainingOptions).toHaveBeenCalledWith(
      moment(newDate).format('YYYY-MM-DDTHH:mm:ssZ')
    );
  });

  it('calls the correct action when editing the activity', () => {
    const { updateActivity } = props;
    render(<InjuryOccurrence {...props} />);

    const activityDropdown = screen.getByLabelText('Activity');
    fireEvent.change(activityDropdown, { target: { value: '1' } }); // Assuming '1' is a game activity
    expect(updateActivity).toHaveBeenCalledWith(1, 'Game'); // Expect number 1, not string '1'
  });

  describe('When no activity is selected', () => {
    it('renders an activity dropdown only', () => {
      render(<InjuryOccurrence {...props} activity={null} />);

      const dropdown = screen.getByLabelText('Activity');
      expect(dropdown).toBeInTheDocument();
      expect(dropdown).toHaveAttribute('aria-label', 'Activity');
      expect(dropdown.children.length).toBe(3); // Empty option + Two optgroups
      expect(dropdown).toHaveValue('');
      expect(dropdown).toBeEnabled();
    });
  });

  describe('When the user selects a game activity', () => {
    beforeEach(() => {
      props.activityType = 'game';
    });

    it('renders a game dropdown', () => {
      render(<InjuryOccurrence {...props} />);

      const gameDropdown = screen.getByLabelText('Game');
      expect(gameDropdown).toBeInTheDocument();
      expect(gameDropdown.children.length).toBe(3); // Empty option + Unlisted game + Ireland vs Scotland
      expect(gameDropdown).toHaveValue('');
      expect(gameDropdown).toBeEnabled();
      expect(gameDropdown).toHaveAttribute(
        'data-testid',
        'athleteIssueEditor_game_dropdown'
      );
    });

    describe('When the injury-game-period feature flag is on', () => {
      beforeEach(() => {
        window.featureFlags['injury-game-period'] = true;
      });

      afterEach(() => {
        window.featureFlags['injury-game-period'] = false;
      });

      it('renders a period field', () => {
        render(<InjuryOccurrence {...props} />);
        const periodField = screen.getByLabelText('Custom Period');
        expect(periodField).toBeInTheDocument();
      });

      describe('When isDisabled is true', () => {
        it('disables the titles and fields', () => {
          render(<InjuryOccurrence {...props} isDisabled />);

          // Check the class of the h5 element with text "Event"
          expect(screen.getByText('Event')).toHaveClass(
            'athleteIssueEditor__sectionTitle--disabled'
          );

          // Occurrence date input
          expect(screen.getByLabelText('Date of Injury')).toBeDisabled();
          expect(screen.getByLabelText('Date of Injury')).toHaveAttribute(
            'min',
            ''
          );

          // Activity dropdown
          expect(screen.getByLabelText('Activity')).toBeDisabled();

          // Game dropdown
          expect(screen.getByLabelText('Game')).toBeDisabled();

          // Custom Period dropdown
          expect(screen.getByLabelText('Custom Period')).toBeDisabled();

          // Position when Injured dropdown
          expect(
            screen.getByLabelText('#sport_specific__Position_when_Injured')
          ).toBeDisabled();

          // Time input
          expect(screen.getByLabelText('Time')).toBeDisabled();

          // Session completed checkbox
          expect(screen.getByLabelText('Session completed')).toBeDisabled();
        });
      });
    });

    it('renders a time field', () => {
      render(<InjuryOccurrence {...props} />);
      const timeField = screen.getByLabelText('Time');
      expect(timeField).toBeInTheDocument();
      expect(timeField).toHaveAttribute('placeholder', 'Optional');
    });

    it('renders a position when injured dropdown for games', () => {
      render(<InjuryOccurrence {...props} />);
      const positionDropdown = screen.getByTestId(
        '#sport_specific__Position_when_Injured'
      );
      expect(positionDropdown).toBeInTheDocument();
      expect(positionDropdown.children.length).toBe(3); // Empty option + Two optgroups
      expect(positionDropdown).toHaveValue('');
    });

    it('renders a position when injured dropdown for training sessions', () => {
      props.activityType = 'training'; // Change activity type for this test
      render(<InjuryOccurrence {...props} />);
      const positionDropdown = screen.getByTestId(
        '#sport_specific__Position_when_Injured'
      );
      expect(positionDropdown).toBeInTheDocument();
      expect(positionDropdown.children.length).toBe(3); // Empty option + Two optgroups
      expect(positionDropdown).toHaveValue('');
    });

    it('renders a checkbox "session completed"', () => {
      render(<InjuryOccurrence {...props} />);
      const checkbox = screen.getByLabelText('Session completed');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('calls the correct action when editing the sessionCompleted', () => {
      const { updateSessionCompleted } = props;
      render(<InjuryOccurrence {...props} />);

      const checkbox = screen.getByLabelText('Session completed');
      fireEvent.click(checkbox);
      expect(updateSessionCompleted).toHaveBeenCalledWith(true);
    });

    describe('When the selected game has a date', () => {
      it('calls the correct action when editing the game', () => {
        const { updateGame } = props;
        render(<InjuryOccurrence {...props} />);

        const gameDropdown = screen.getByLabelText('Game');
        fireEvent.change(gameDropdown, { target: { value: '3' } });
        expect(updateGame).toHaveBeenCalledWith(
          '3',
          '2018-11-10T00:00:00+00:00'
        );
      });
    });

    describe("When the selected game doesn't have a date", () => {
      it('calls the correct action when editing the game', () => {
        const { updateGame } = props;
        render(<InjuryOccurrence {...props} />);

        const gameDropdown = screen.getByLabelText('Game');
        fireEvent.change(gameDropdown, { target: { value: '0' } });
        expect(updateGame).toHaveBeenCalledWith('0', undefined); // Expect undefined, not null
      });
    });

    it('calls the correct action when editing the side', () => {
      const { updateGameTime } = props;
      render(<InjuryOccurrence {...props} />);

      const timeField = screen.getByLabelText('Time');
      fireEvent.change(timeField, { target: { value: '32' } });
      expect(updateGameTime).toHaveBeenCalledWith('32');
    });

    it('calls the correct action when editing the position group', () => {
      const { updatePositionGroup } = props;
      render(<InjuryOccurrence {...props} />);

      const positionGroupDropdown = screen.getByTestId(
        '#sport_specific__Position_when_Injured'
      );
      fireEvent.change(positionGroupDropdown, { target: { value: '1' } }); // Assuming '1' is Hooker
      expect(updatePositionGroup).toHaveBeenCalledWith(1);
    });

    describe('When injury-game-period feature flag is on', () => {
      beforeEach(() => {
        window.featureFlags['injury-game-period'] = true;
      });

      afterEach(() => {
        window.featureFlags['injury-game-period'] = false;
      });

      it('calls the correct action when editing the period', () => {
        const { updatePeriod } = props;
        render(<InjuryOccurrence {...props} />);

        const periodDropdown = screen.getByLabelText('Custom Period');
        fireEvent.change(periodDropdown, { target: { value: '345' } });
        expect(updatePeriod).toHaveBeenCalledWith('345');
      });
    });

    describe('When the page is fetching games', () => {
      it('disables the date of injury and game dropdown', () => {
        render(
          <InjuryOccurrence {...props} isFetchingGameAndTrainingOptions />
        );

        const gameDropdown = screen.getByLabelText('Game');
        expect(gameDropdown).toBeDisabled();

        const datepicker = screen.getByLabelText('Date of Injury');
        expect(datepicker).toBeDisabled();
      });

      describe('When the injury-game-period feature flag is on', () => {
        beforeEach(() => {
          window.featureFlags['injury-game-period'] = true;
        });

        afterEach(() => {
          window.featureFlags['injury-game-period'] = false;
        });

        it('disables the period dropdown', () => {
          render(
            <InjuryOccurrence {...props} isFetchingGameAndTrainingOptions />
          );

          const periodDropdown = screen.getByLabelText('Custom Period');
          expect(periodDropdown).toBeDisabled();
        });
      });
    });
  });

  describe('When the user selects a training activity', () => {
    beforeEach(() => {
      props.activityType = 'training';
    });

    it('renders a Training Sessions dropdown', () => {
      render(<InjuryOccurrence {...props} />);

      const trainingSessionsDropdown =
        screen.getByLabelText('Training Session');
      expect(trainingSessionsDropdown).toBeInTheDocument();
      expect(trainingSessionsDropdown.children.length).toBe(3); // Empty option + Conditionning + Sprint
      expect(trainingSessionsDropdown).toHaveValue('');
      expect(trainingSessionsDropdown).toBeEnabled();
      expect(trainingSessionsDropdown).toHaveAttribute(
        'data-testid',
        'athleteIssueEditor_training_session_dropdown'
      );
    });

    it('calls the correct action when editing the training session', () => {
      const { updateTrainingSession } = props;
      render(<InjuryOccurrence {...props} activityType="training" />);

      const trainingSessionsDropdown =
        screen.getByLabelText('Training Session');
      fireEvent.change(trainingSessionsDropdown, { target: { value: '0' } }); // Change to a valid ID
      expect(updateTrainingSession).toHaveBeenCalledWith('0');
    });

    it('renders a checkbox "session completed"', () => {
      render(<InjuryOccurrence {...props} activityType="training" />);

      const sessionsCompletedCheckbox =
        screen.getByLabelText('Session completed');
      expect(sessionsCompletedCheckbox).toBeInTheDocument();
      expect(sessionsCompletedCheckbox).not.toBeChecked();
    });

    it('calls the correct action when editing the sessionCompleted', () => {
      const { updateSessionCompleted } = props;
      render(<InjuryOccurrence {...props} activityType="training" />);

      const sessionsCompletedCheckbox =
        screen.getByLabelText('Session completed');
      fireEvent.click(sessionsCompletedCheckbox);
      expect(updateSessionCompleted).toHaveBeenCalledWith(true);
    });

    describe('When the page is fetching training sessions', () => {
      it('disables the training session dropdown', () => {
        render(
          <InjuryOccurrence
            {...props}
            activityType="training"
            isFetchingGameAndTrainingOptions
          />
        );

        const trainingSessionsDropdown =
          screen.getByLabelText('Training Session');
        expect(trainingSessionsDropdown).toBeDisabled();
      });
    });
  });

  describe('When formMode is CREATE and gets the games and training session of the current date', () => {
    it('gets the games and training session of the current date', () => {
      const { getGameAndTrainingOptions } = props;
      render(<InjuryOccurrence {...props} formMode="CREATE" />);

      expect(getGameAndTrainingOptions).toHaveBeenCalledTimes(1);
      expect(getGameAndTrainingOptions).toHaveBeenCalledWith(
        moment().format('YYYY-MM-DDTHH:mm:ssZ')
      );
    });
  });

  describe('When formMode is EDIT', () => {
    it('gets the games and training session of the injury occurrence date', () => {
      const { getGameAndTrainingOptions } = props;
      const occurrenceDate = '2018-06-14T16:17:11+00:00';

      render(
        <InjuryOccurrence
          {...props}
          formMode="EDIT"
          occurrenceDate={occurrenceDate}
        />
      );

      expect(getGameAndTrainingOptions).toHaveBeenCalledWith(occurrenceDate);
    });
  });

  describe('When formType is INJURY', () => {
    it('displays the Activity select', () => {
      render(<InjuryOccurrence {...props} formType="INJURY" />);
      const activitySelect = screen.getByLabelText('Activity');
      expect(activitySelect).toBeInTheDocument();
    });
  });

  describe('When formType is ILLNESS', () => {
    it('does not display the Activity select', () => {
      render(<InjuryOccurrence {...props} formType="ILLNESS" />);
      const activitySelect = screen.queryByLabelText('Activity');
      expect(activitySelect).not.toBeInTheDocument();
    });

    it('renders the correct label for the field', () => {
      render(<InjuryOccurrence {...props} formType="ILLNESS" />);
      const dateFieldLabel = screen.getByLabelText('Date of Illness');
      expect(dateFieldLabel).toBeInTheDocument();
    });
  });
});
