import { render, screen, fireEvent } from '@testing-library/react';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import GameFields from '../game/GameFields';

// Mock service calls
jest.mock('@kitman/services', () => ({
  getTeams: jest.fn(),
  getOrganisationTeams: jest.fn(),
  getCompetitions: jest.fn(),
  getVenueTypes: jest.fn(),
}));

// Mock withSelectServiceSuppliedOptions and form components
jest.mock('@kitman/components', () => {
  return {
    Select: ({ label, value, onChange, 'data-testid': testId }) => (
      <select
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        <option value="1">{label} Option 1</option>
      </select>
    ),
    InputNumeric: ({ value, onChange, 'data-testid': testId, disabled }) => (
      <input
        data-testid={testId}
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      />
    ),
    Checkbox: ({ isChecked, toggle, 'data-testid': testId }) => (
      <input
        data-testid={testId}
        type="checkbox"
        checked={isChecked}
        onChange={(e) => toggle({ checked: e.target.checked })}
      />
    ),
    InputText: ({ value, onValidation, disabled, 'data-testid': testId }) => (
      <input
        data-testid={testId}
        value={value}
        disabled={disabled}
        onChange={(e) => onValidation({ value: e.target.value })}
      />
    ),
    withSelectServiceSuppliedOptions: (Component) => (props) =>
      <Component {...props} />,
  };
});

describe('GameFields', () => {
  const baseProps = {
    event: {
      start_time: moment().subtract(1, 'days').toISOString(),
      local_timezone: 'UTC',
      organisation_team_id: '',
      score: null,
      team_id: '',
      opponent_score: null,
      competition_id: '',
      round_number: null,
      venue_type_id: '',
      turnaround_fixture: false,
      turnaround_prefix: '',
    },
    eventValidity: {},
    onUpdateEventDetails: jest.fn(),
    onDataLoadingStatusChanged: jest.fn(),
    t: i18nextTranslateStub(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders all fields', () => {
    render(<GameFields {...baseProps} />);

    expect(screen.getByTestId('GameFields|Team')).toBeInTheDocument();
    expect(screen.getByTestId('GameFields|Score')).toBeInTheDocument();
    expect(screen.getByTestId('GameFields|Opposition')).toBeInTheDocument();
    expect(screen.getByTestId('GameFields|OpponentScore')).toBeInTheDocument();
    expect(screen.getByTestId('GameFields|Competition')).toBeInTheDocument();
    expect(screen.getByTestId('GameFields|RoundNumber')).toBeInTheDocument();
    expect(screen.getByTestId('GameFields|Venue')).toBeInTheDocument();
    expect(
      screen.getByTestId('GameFields|CreateTurnaroundMarker')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('GameFields|TurnaroundPrefix')
    ).toBeInTheDocument();
  });

  test('updates organisation_team_id on team select change', () => {
    render(<GameFields {...baseProps} />);
    fireEvent.change(screen.getByTestId('GameFields|Team'), {
      target: { value: '1' },
    });
    expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
      organisation_team_id: '1',
    });
  });

  test('updates score on numeric input', () => {
    render(<GameFields {...baseProps} />);
    fireEvent.change(screen.getByTestId('GameFields|Score'), {
      target: { value: '2' },
    });
    expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
      score: 2,
    });
  });

  test('checkbox toggles turnaround_fixture', () => {
    render(<GameFields {...baseProps} />);
    fireEvent.click(screen.getByTestId('GameFields|CreateTurnaroundMarker'));
    expect(baseProps.onUpdateEventDetails).toHaveBeenCalledWith({
      turnaround_fixture: true,
    });
  });

  test('updates turnaround_prefix on input change', () => {
    const props = {
      ...baseProps,
      event: {
        ...baseProps.event,
        turnaround_fixture: true,
        turnaround_prefix: '',
      },
    };
    render(<GameFields {...props} />);
    fireEvent.change(screen.getByTestId('GameFields|TurnaroundPrefix'), {
      target: { value: 'TP' },
    });
    expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
      turnaround_prefix: 'TP',
    });
  });

  test('disables score input if event is in the future', () => {
    const futureProps = {
      ...baseProps,
      event: {
        ...baseProps.event,
        start_time: moment().add(1, 'days').toISOString(),
      },
    };
    render(<GameFields {...futureProps} />);
    expect(screen.getByTestId('GameFields|Score')).toBeDisabled();
    expect(screen.getByTestId('GameFields|OpponentScore')).toBeDisabled();
  });
});
