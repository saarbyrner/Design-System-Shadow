import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import EventListActivity from '../EventListActivity';
import { eventListValueChangeTypes } from '../../eventListConsts';

describe('EventListActivity', () => {
  const mockPlayer = {
    id: 33925,
    firstname: 'AJ',
    lastname: 'McClune',
    fullname: 'AJ McClune',
    shortname: 'McClune',
    user_id: 38187,
    avatar_url: 'testImage.png',
    availability: 'unavailable',
    position: {
      name: 'Loose-head Prop',
      order: 1,
      abbreviation: 'LP',
      position_group: {
        order: 1,
        name: 'Forward',
      },
    },
    squad_number: 4,
    user: {
      id: 33925,
      fullname: 'AJ McClune',
      role: 'Manager',
      avatar_url: 'testImage.png',
    },
  };

  const mockEvent = (type, userType) => {
    const event = {
      kind: type,
      absolute_minute: 0,
      relation: { id: null },
      activityIndex: 5,
    };
    if (userType === 'athlete') event.athlete_id = 33925;
    else event.user_id = 33925;
    return event;
  };

  const mockPlayerOptions = [
    {
      label: 'Ted Burg',
      value: 1,
    },
    { label: 'Mr Pipp', value: 2 },
  ];

  const mockReasonsOptions = {
    yellow_options: [{ label: 'Test Offense', value: 1 }],
    red_options: [
      { label: 'Test Foul', value: 2 },
      { label: 'Test Foul Two', value: 3 },
    ],
  };

  const mockPeriod = {
    absolute_duration_start: 0,
    absolute_duration_end: 90,
  };

  const mockFormationOptions = [
    { label: '3-2-2', value: 1 },
    { label: '2-3-2', value: 2 },
  ];

  const mockAllActivities = [
    {
      kind: 'formation_change',
      absolute_minute: 0,
      relation: { id: 1, name: '3-2-2' },
    },
  ];

  const defaultProps = {
    isReadOnly: false,
    listType: 'PITCH',
    player: mockPlayer,
    currentPeriod: mockPeriod,
    formationOptions: mockFormationOptions,
    allGameActivities: mockAllActivities,
    event: mockEvent(eventTypes.sub, 'athlete'),
    pitchActivities: [],
    playerOptions: [],
    selectedEvent: null,
    assistValue: 10,
    reasonOptions: mockReasonsOptions,
    checkIfInvalidMinute: () => true,
    onDelete: jest.fn(),
    onChangeEventValue: jest.fn(),
    setSelectedEvent: jest.fn(),
    setActiveEventSelection: jest.fn(),
    t: i18nextTranslateStub(),
    handleOwnGoal: jest.fn(),
    handleClearAssist: jest.fn(),
  };

  const renderComponent = (props = defaultProps) =>
    render(<EventListActivity {...props} />);

  describe('render sub', () => {
    let renderedContainer;
    beforeEach(() => {
      const { container } = renderComponent({
        ...defaultProps,
        pitchActivities: [mockEvent(eventTypes.sub, 'athlete')],
      });
      renderedContainer = container;
    });

    it('renders out the player information', () => {
      expect(screen.getAllByRole('img')[0]).toHaveAttribute(
        'src',
        '/img/pitch-view/subArrow.png'
      );
      expect(screen.getByText('#4')).toBeInTheDocument();
      expect(screen.getByText('AJ McClune (Sub-out)')).toBeInTheDocument();
      expect(screen.getByText('LP')).toBeInTheDocument();
    });

    it('renders out the button and dropdowns', () => {
      expect(screen.getAllByRole('button')[0]).toBeInTheDocument();
      expect(screen.getByText('Time of Event')).toBeInTheDocument();
      expect(screen.getByText('Sub-in')).toBeInTheDocument();
      expect(
        renderedContainer.querySelector('.kitmanReactSelect__clear-indicator')
      ).not.toBeInTheDocument();
    });
  });

  describe('render sub activity with actions', () => {
    it('renders the delete modal when clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        pitchActivities: [mockEvent(eventTypes.sub, 'athlete')],
      });
      await user.click(screen.getAllByRole('button')[0]);
      expect(
        screen.getByText('Delete Event: Substitution')
      ).toBeInTheDocument();
    });

    it('sets the event when it is selected', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        pitchActivities: [mockEvent(eventTypes.sub, 'athlete')],
      });
      await user.click(screen.getByText('Min'));
      expect(defaultProps.setSelectedEvent).toHaveBeenCalledWith({
        absolute_minute: 0,
        activityIndex: 5,
        athlete_id: 33925,
        kind: eventTypes.sub,
        relation: { id: null },
      });
    });
  });

  describe('renders as a formation event type', () => {
    beforeEach(() => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.formation_change, 'athlete'),
        pitchActivities: [mockEvent(eventTypes.formation_change, 'athlete')],
      });
    });

    it('renders out the formation icon', () => {
      expect(screen.getAllByRole('img')[0]).toHaveAttribute(
        'src',
        '/img/pitch-view/formation.png'
      );
    });

    it('renders out the formation option dropdown', () => {
      expect(screen.getByText('Formation')).toBeInTheDocument();
    });
  });

  describe('renders formation event type - actions', () => {
    it('clicking the formation dropdown changes the formation', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.formation_change, 'athlete'),
        pitchActivities: [mockEvent(eventTypes.formation_change, 'athlete')],
      });
      await user.click(screen.getByLabelText('Formation'));
      await user.click(screen.getByText('2-3-2'));
      expect(defaultProps.onChangeEventValue).toHaveBeenCalledWith(
        5,
        eventListValueChangeTypes.formationChange,
        2
      );
    });

    it('renders the delete modal when clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.formation_change, 'athlete'),
        pitchActivities: [mockEvent(eventTypes.formation_change, 'athlete')],
      });
      await user.click(screen.getAllByRole('button')[0]);
      expect(
        screen.getByText('Delete Event: Formation Change')
      ).toBeInTheDocument();
    });
  });

  describe('renders as a switch event type', () => {
    let renderedContainer;
    beforeEach(() => {
      const { container } = renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.switch, 'athlete'),
        pitchActivities: [mockEvent(eventTypes.switch, 'athlete')],
        playerOptions: mockPlayerOptions,
      });
      renderedContainer = container;
    });
    it('renders out the switch icon', () => {
      expect(screen.getAllByRole('img')[0]).toHaveAttribute(
        'src',
        '/img/pitch-view/switch.png'
      );
    });

    it('renders out the player option dropdown', () => {
      expect(screen.getByText('Player in Field')).toBeInTheDocument();
      expect(
        renderedContainer.querySelector('.kitmanReactSelect__clear-indicator')
      ).not.toBeInTheDocument();
    });
  });

  describe('renders as a switch event - actions', () => {
    it('renders the delete modal when clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.switch, 'athlete'),
        pitchActivities: [mockEvent(eventTypes.switch, 'athlete')],
        playerOptions: mockPlayerOptions,
      });
      await user.click(screen.getAllByRole('button')[0]);
      expect(
        screen.getByText('Delete Event: Position Swap')
      ).toBeInTheDocument();
    });

    it('allows the player to select a player option', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.switch, 'athlete'),
        pitchActivities: [mockEvent(eventTypes.switch, 'athlete')],
        playerOptions: mockPlayerOptions,
      });
      await user.click(screen.getByLabelText('Player in Field'));
      await user.click(screen.getByText('Mr Pipp'));
      expect(defaultProps.onChangeEventValue).toHaveBeenCalledWith(
        5,
        eventListValueChangeTypes.playerChange,
        2
      );
    });
  });

  describe('render goal/yellow_card/red_card', () => {
    describe('goal', () => {
      it('renders the goal on PITCH with an assist, but without an own goal switch when feature flag is disabled', () => {
        window.setFlag('league-ops-match-report-v2', true); // irrelevant for PITCH list type
        window.setFlag('league-ops-game-events-own-goal', false);

        const { container } = renderComponent({
          ...defaultProps,
          event: mockEvent(eventTypes.goal, 'athlete'),
          playerOptions: mockPlayerOptions,
          assistValue: mockPlayerOptions[0].value,
        });

        expect(screen.getAllByRole('img')[0]).toHaveAttribute(
          'src',
          '/img/pitch-view/goal.png'
        );
        expect(screen.getByText('Min')).toBeInTheDocument();
        expect(screen.getByText('Assist')).toBeInTheDocument();
        expect(
          container.querySelector('.kitmanReactSelect__clear-indicator')
        ).toBeInTheDocument();
        expect(screen.queryByText('Mark as own goal')).not.toBeInTheDocument();
      });

      it('renders the goal on PITCH with an assist and an own goal switch when feature flag is disabled', () => {
        window.setFlag('league-ops-match-report-v2', false);
        window.setFlag('league-ops-game-events-own-goal', true);

        const { container } = renderComponent({
          ...defaultProps,
          event: mockEvent(eventTypes.goal, 'athlete'),
          playerOptions: mockPlayerOptions,
          assistValue: mockPlayerOptions[0].value,
        });

        expect(screen.getAllByRole('img')[0]).toHaveAttribute(
          'src',
          '/img/pitch-view/goal.png'
        );
        expect(screen.getByText('Min')).toBeInTheDocument();
        expect(screen.getByText('Assist')).toBeInTheDocument();
        expect(
          container.querySelector('.kitmanReactSelect__clear-indicator')
        ).toBeInTheDocument();
        expect(screen.getByText('Mark as own goal')).toBeInTheDocument();
      });

      it('clears the goal assist dropdown when the clear button is clicked', async () => {
        const user = userEvent.setup();
        const { container } = renderComponent({
          ...defaultProps,
          event: mockEvent(eventTypes.goal, 'athlete'),
          playerOptions: mockPlayerOptions,
          assistValue: mockPlayerOptions[0].value,
        });

        await user.click(
          container.querySelector('.kitmanReactSelect__clear-indicator')
        );

        expect(defaultProps.handleClearAssist).toHaveBeenCalledWith(5);
      });

      it('renders the goal on PITCH with own goal marked and disables the assist dropdown', () => {
        window.setFlag('league-ops-match-report-v2', false);
        window.setFlag('league-ops-game-events-own-goal', true);

        const goalEvent = mockEvent(eventTypes.goal, 'athlete');

        const { container } = renderComponent({
          ...defaultProps,
          event: goalEvent,
          playerOptions: mockPlayerOptions,
          assistValue: mockPlayerOptions[0].value,
          allGameActivities: [
            ...defaultProps.allGameActivities,
            { ...goalEvent, kind: eventTypes.own_goal },
          ],
        });

        expect(screen.getAllByRole('img')[0]).toHaveAttribute(
          'src',
          '/img/pitch-view/ownGoal.png'
        );

        const assistInput = screen.getByLabelText('Assist');
        expect(assistInput).toBeInTheDocument();
        expect(assistInput).toHaveAttribute('readonly');
        expect(
          container.querySelector('.kitmanReactSelect__clear-indicator')
        ).not.toBeInTheDocument();

        expect(screen.getByText('Mark as own goal')).toBeInTheDocument();
      });

      it('opens the delete modal but cancels the delete when cancel is clicked', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          event: mockEvent(eventTypes.goal, 'athlete'),
        });
        await user.click(screen.getAllByRole('button')[0]);
        expect(screen.getByText('Delete Event: Goal')).toBeInTheDocument();
        await user.click(screen.getByText('Cancel'));
        expect(
          screen.queryByText('Delete Event: Goal')
        ).not.toBeInTheDocument();
        expect(defaultProps.onDelete).not.toHaveBeenCalled();
      });

      it('fires off a delete call when the delete icon is clicked and the delete button in the modal', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          event: mockEvent(eventTypes.goal, 'athlete'),
        });
        await user.click(screen.getAllByRole('button')[0]);
        expect(screen.getByText('Delete Event: Goal')).toBeInTheDocument();
        await user.click(screen.getByText('Confirm'));
        expect(defaultProps.onDelete).toHaveBeenCalledWith(5);
      });

      it('resets the min duration back to what it was before if the input is invalid', async () => {
        renderComponent({
          ...defaultProps,
          event: mockEvent(eventTypes.goal, 'athlete'),
        });
        fireEvent.change(screen.getByRole('spinbutton'), {
          target: { value: '20' },
        });
        expect(screen.getByDisplayValue('20')).toBeInTheDocument();
        fireEvent.blur(screen.getByRole('spinbutton'));
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();
        expect(screen.getByText('Invalid Time In Period')).toBeInTheDocument();
      });

      it('resets the additional time duration back to what it was before if the input is empty and invalid', async () => {
        const user = userEvent.setup();
        renderComponent({
          ...defaultProps,
          event: mockEvent(eventTypes.goal, 'athlete'),
        });
        await user.clear(screen.getByRole('spinbutton'));
        await user.tab();
        expect(screen.getByDisplayValue('0')).toBeInTheDocument();
        expect(screen.getByText('Invalid Time In Period')).toBeInTheDocument();
      });

      it('changes the min duration when it is a valid duration', async () => {
        renderComponent({
          ...defaultProps,
          event: mockEvent(eventTypes.goal, 'athlete'),
          checkIfInvalidMinute: () => false,
          selectedEvent: mockEvent(eventTypes.goal, 'athlete'),
        });
        fireEvent.change(screen.getByRole('spinbutton'), {
          target: { value: '20' },
        });
        expect(screen.getByDisplayValue('20')).toBeInTheDocument();
        fireEvent.blur(screen.getByRole('spinbutton'));
        expect(screen.getByDisplayValue('20')).toBeInTheDocument();
        expect(defaultProps.onChangeEventValue).toHaveBeenCalledWith(
          5,
          eventListValueChangeTypes.absoluteMinuteChange,
          20
        );
      });
    });

    it('renders red card', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.red, 'athlete'),
      });
      expect(screen.getAllByRole('img')[0]).toHaveAttribute(
        'src',
        '/img/pitch-view/redCard.png'
      );
      expect(screen.getByText('Min')).toBeInTheDocument();
    });

    it('renders the red card delete modal when delete is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.red, 'athlete'),
      });
      await user.click(screen.getAllByRole('button')[0]);
      expect(screen.getByText('Delete Event: Red Card')).toBeInTheDocument();
    });

    it('renders yellow card', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.yellow, 'athlete'),
      });
      expect(screen.getAllByRole('img')[0]).toHaveAttribute(
        'src',
        '/img/pitch-view/yellowCard.png'
      );
      expect(screen.getByText('Min')).toBeInTheDocument();
    });
  });

  it('renders the yellow card delete modal when delete is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      event: mockEvent(eventTypes.yellow, 'athlete'),
    });
    await user.click(screen.getAllByRole('button')[0]);
    expect(screen.getByText('Delete Event: Yellow Card')).toBeInTheDocument();
  });

  it('renders reasons dropdown select if event is yellow card', async () => {
    renderComponent({
      ...defaultProps,
      event: mockEvent(eventTypes.yellow, 'athlete'),
    });
    expect(screen.getByLabelText('Reason')).toBeInTheDocument();
  });
  it('renders reasons dropdown select if event is red card', async () => {
    renderComponent({
      ...defaultProps,
      event: mockEvent(eventTypes.red, 'athlete'),
    });
    expect(screen.getByLabelText('Reason')).toBeInTheDocument();
  });

  describe('render with disabled ui', () => {
    it('renders a non editable red card when there is a corresponding yellow for it', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.red, 'athlete'),
        pitchActivities: [
          { kind: eventTypes.yellow, absolute_minute: 0, athlete_id: 33925 },
          { kind: eventTypes.yellow, absolute_minute: 5, athlete_id: 33925 },
          { kind: eventTypes.red, absolute_minute: 5, athlete_id: 33925 },
        ],
      });

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders out the switch event but disabled when it is not the most recent event', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.switch, 'athlete'),
        pitchActivities: [
          {
            kind: eventTypes.switch,
            absolute_minute: 5,
            athlete_id: 33925,
            relation_id: 2,
            activityIndex: 5,
          },
        ],
        playerOptions: mockPlayerOptions,
      });

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('render MATCH version of the component', () => {
    it('renders the goal without an assist dropdown', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        listType: 'MATCH',
      });
      expect(screen.queryByText('Assist')).not.toBeInTheDocument();
    });

    it('renders the goal on MATCH with an own goal switch when feature flag is enabled', () => {
      window.setFlag('league-ops-match-report-v2', true);
      window.setFlag('league-ops-game-events-own-goal', true); // irrelevant for MATCH list type

      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        listType: 'MATCH',
      });

      // not rendered in MATCH list type, even if own goal feature flag is on
      expect(screen.queryByText('Assist')).not.toBeInTheDocument();

      expect(screen.getAllByRole('img')[0]).toHaveAttribute(
        'src',
        '/img/pitch-view/goal.png'
      );
      expect(screen.getByText('Mark as own goal')).toBeInTheDocument();
    });

    it('renders the goal on MATCH with own goal marked when feature flag is enabled', () => {
      window.setFlag('league-ops-match-report-v2', true);
      window.setFlag('league-ops-game-events-own-goal', false);

      const goalEvent = mockEvent(eventTypes.goal, 'athlete');

      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        allGameActivities: [
          ...defaultProps.allGameActivities,
          { ...goalEvent, kind: eventTypes.own_goal },
        ],
        listType: 'MATCH',
      });
      expect(screen.queryByText('Assist')).not.toBeInTheDocument();
      expect(screen.getAllByRole('img')[0]).toHaveAttribute(
        'src',
        '/img/pitch-view/ownGoal.png'
      );
      expect(screen.getByText('Mark as own goal')).toBeInTheDocument();
    });

    it('renders the goal on MATCH without the own goal switch when feature flag is disabled', () => {
      window.setFlag('league-ops-match-report-v2', false);
      window.setFlag('league-ops-game-events-own-goal', true); // irrelevant for MATCH list type

      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        listType: 'MATCH',
      });

      // not rendered in MATCH list type, even if feature flag is enabled
      expect(screen.queryByText('Assist')).not.toBeInTheDocument();

      expect(screen.getAllByRole('img')[0]).toHaveAttribute(
        'src',
        '/img/pitch-view/goal.png'
      );
      expect(screen.queryByText('Mark as own goal')).not.toBeInTheDocument();
    });

    it('renders the additional minute input', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        listType: 'MATCH',
      });
      expect(screen.getByText('Additional Time')).toBeInTheDocument();
    });

    it('resets the additional time duration back to what it was before if the input is less than 0', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        listType: 'MATCH',
      });
      fireEvent.change(screen.getAllByRole('spinbutton')[1], {
        target: { value: '-1' },
      });
      expect(screen.getByDisplayValue('-1')).toBeInTheDocument();
      fireEvent.blur(screen.getAllByRole('spinbutton')[1]);
      expect(screen.getAllByDisplayValue('0')[1]).toBeInTheDocument();
      expect(screen.getByText('Invalid Input')).toBeInTheDocument();
    });

    it('resets the additional time duration back to what it was before if the input is invalid', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        listType: 'MATCH',
      });
      await user.clear(screen.getAllByRole('spinbutton')[1]);
      await user.tab();
      expect(screen.getAllByDisplayValue('0')[1]).toBeInTheDocument();
      expect(screen.getByText('Invalid Input')).toBeInTheDocument();
    });

    it('fires off the change minute call when a valid additional time is inputted', async () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        listType: 'MATCH',
      });

      fireEvent.change(screen.getAllByRole('spinbutton')[1], {
        target: { value: '20' },
      });
      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
      fireEvent.blur(screen.getAllByRole('spinbutton')[1]);

      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
      expect(defaultProps.onChangeEventValue).toHaveBeenCalledWith(
        5,
        eventListValueChangeTypes.additionalMinuteChange,
        20
      );
    });

    it('renders out the events but disabled in readOnly mode', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        listType: 'MATCH',
        checkIfInvalidMinute: () => false,
        selectedEvent: mockEvent(eventTypes.goal, 'athlete'),
        isReadOnly: true,
      });
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('changes the delete text in the modal to match report specific', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'athlete'),
        listType: 'MATCH',
      });
      await user.click(screen.getAllByRole('button')[0]);
      expect(screen.getByText('Delete Event: Goal')).toBeInTheDocument();
      expect(
        screen.getByText(
          'By deleting this event you will remove the the event on the Match Report!'
        )
      ).toBeInTheDocument();
    });
  });

  describe('renders Staff version of the component', () => {
    it('renders the staff information', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.goal, 'staff'),
        listType: 'MATCH',
      });
      expect(screen.getByText('AJ McClune')).toBeInTheDocument();
      expect(screen.getByText('Manager')).toBeInTheDocument();
    });

    it('renders out the reasons dropdown select', () => {
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.yellow, 'staff'),
        listType: 'MATCH',
      });
      expect(screen.getByText('Reason')).toBeInTheDocument();
    });

    it('allows the user to set a reason', async () => {
      const user = userEvent.setup();
      renderComponent({
        ...defaultProps,
        event: mockEvent(eventTypes.red, 'staff'),
        listType: 'MATCH',
      });
      await user.click(screen.getByLabelText('Reason'));
      await user.click(screen.getByText('Test Foul Two'));
      expect(defaultProps.onChangeEventValue).toHaveBeenCalledWith(
        5,
        eventListValueChangeTypes.reasonChange,
        3
      );
    });
  });
});
