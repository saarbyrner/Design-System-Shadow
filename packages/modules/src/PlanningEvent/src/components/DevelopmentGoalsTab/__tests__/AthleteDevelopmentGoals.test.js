import { render, screen } from '@testing-library/react';
import AthleteDevelopmentGoals from '../AthleteDevelopmentGoals';

jest.mock('../DevelopmentGoalCompletionActions', () => ({
  DevelopmentGoalCompletionActionsTranslated: () => (
    <div data-testid="completion-actions">Actions</div>
  ),
}));

jest.mock('../DevelopmentGoalRow', () => (props) => (
  <div data-testid="dev-goal-row">
    {props.eventDevelopmentGoalItem.development_goal.description}
  </div>
));

describe('<AthleteDevelopmentGoals />', () => {
  const baseProps = {
    event: { id: 1, type: 'training' },
    isLoading: false,
    athleteSettings: {
      avatarUrl:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
      name: 'Benjamin Alain',
      position: 'Hooker',
    },
    athleteEventId: 1,
    withCompletionTypes: true,
    withUnarchiveCompletionType: true,
    eventDevelopmentGoalItems: [
      {
        development_goal: {
          id: 1,
          description:
            'Develop your defensive awareness by scanning more often and reading the game quicker',
        },
      },
      {
        development_goal: {
          id: 2,
          description:
            'Develop your offensive awareness by increasing physical skills',
        },
      },
    ],
    developmentGoalCompletionTypes: [
      { id: 1, name: 'Coached' },
      { id: 2, name: 'Practised' },
    ],
    onSelectAthleteGoals: jest.fn(),
    onUnselectAthleteGoals: jest.fn(),
    onSelectGoal: jest.fn(),
    onUnselectGoal: jest.fn(),
    areCoachingPrinciplesEnabled: true,
  };

  const renderComponent = (overrideProps = {}) => {
    return render(
      <AthleteDevelopmentGoals {...baseProps} {...overrideProps} />
    );
  };

  it('renders the correct athlete settings', () => {
    renderComponent();
    const avatar = screen.getByRole('img', { name: 'Athlete avatar' });
    expect(avatar).toHaveAttribute(
      'src',
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png'
    );
    expect(
      screen.getByRole('heading', { name: 'Benjamin Alain' })
    ).toBeInTheDocument();
    expect(screen.getByText('Hooker')).toBeInTheDocument();
  });

  it('renders the correct goals', () => {
    renderComponent();
    const goalRows = screen.getAllByTestId('dev-goal-row');
    expect(goalRows).toHaveLength(2);
    expect(goalRows[0]).toHaveTextContent(
      'Develop your defensive awareness by scanning more often and reading the game quicker'
    );
    expect(goalRows[1]).toHaveTextContent(
      'Develop your offensive awareness by increasing physical skills'
    );
  });

  it('renders the completion actions', () => {
    renderComponent();
    expect(screen.getByTestId('completion-actions')).toBeInTheDocument();
  });
});
