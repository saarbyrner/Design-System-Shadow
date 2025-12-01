import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import DevelopmentGoalRow from '../DevelopmentGoalRow';

jest.mock('@kitman/common/src/hooks/useEventTracking');
const mockTrackEvent = jest.fn();

describe('<DevelopmentGoalRow />', () => {
  let user;
  const onSelectGoal = jest.fn();
  const onUnselectGoal = jest.fn();

  const baseProps = {
    event: { id: 1, type: 'training' },
    isLoading: false,
    withUnarchiveCompletionType: true,
    eventDevelopmentGoalItem: {
      checked: true,
      development_goal: {
        id: 1,
        description:
          'Develop your defensive awareness by scanning more often and reading the game quicker',
        start_time: '2021-09-05T23:00:00Z',
        close_time: '2021-10-14T23:00:00Z',
        principles: [
          {
            id: 1,
            name: 'Flexibility in the attacking',
            principle_categories: [],
            principle_types: [{ id: 1, name: 'Technical' }],
            phases: [{ id: 1, name: 'Phase 1' }],
          },
          {
            id: 2,
            name: 'Line-out',
            principle_categories: [],
            principle_types: [{ id: 1, name: 'Technical' }],
            phases: [{ id: 2, name: 'Phase 2' }],
          },
        ],
        development_goal_types: [{ id: 1, name: 'Development goal type 1' }],
      },
      development_goal_completion_type_id: 1,
    },
    developmentGoalCompletionTypes: [
      { id: 1, name: 'Coached' },
      { id: 2, name: 'Practised' },
    ],
    areCoachingPrinciplesEnabled: true,
    onSelectGoal,
    onUnselectGoal,
  };

  beforeEach(() => {
    user = userEvent.setup();
    mockTrackEvent.mockClear();
    onSelectGoal.mockClear();
    onUnselectGoal.mockClear();
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  });

  const renderComponent = (overrideProps = {}) => {
    return render(<DevelopmentGoalRow {...baseProps} {...overrideProps} />);
  };

  it('renders the correct goal description', () => {
    renderComponent();
    expect(
      screen.getByText(
        'Develop your defensive awareness by scanning more often and reading the game quicker'
      )
    ).toBeInTheDocument();
  });

  it('renders the correct goal tags', () => {
    renderComponent();
    expect(screen.getByText('Development goal type 1')).toBeInTheDocument();
    expect(
      screen.getByText('Flexibility in the attacking (Phase 1, Technical)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Line-out (Phase 2, Technical)')
    ).toBeInTheDocument();
  });

  it('does not render the principle tags if areCoachingPrinciplesEnabled is false', () => {
    renderComponent({ areCoachingPrinciplesEnabled: false });
    expect(screen.getByText('Development goal type 1')).toBeInTheDocument();
    expect(
      screen.queryByText('Flexibility in the attacking (Phase 1, Technical)')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Line-out (Phase 2, Technical)')
    ).not.toBeInTheDocument();
  });

  it('displays the correct completion actions and allows interaction', async () => {
    renderComponent();
    const coachedCheckbox = screen.getAllByRole('checkbox')[0];
    const practisedCheckbox = screen.getAllByRole('checkbox')[1];

    expect(coachedCheckbox).toBeChecked();
    expect(practisedCheckbox).not.toBeChecked();

    await user.click(practisedCheckbox);

    expect(onSelectGoal).toHaveBeenCalledWith(1, 2);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Calendar — Game details — Development goals — Check'
    );
  });

  it('calls onUnselectGoal when a checked item is clicked', async () => {
    renderComponent();
    const coachedCheckbox = screen.getAllByRole('checkbox')[0];
    expect(coachedCheckbox).toBeChecked();

    await user.click(coachedCheckbox);

    expect(onUnselectGoal).toHaveBeenCalledWith(1);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Calendar — Game details — Development goals — Uncheck'
    );
  });
});
