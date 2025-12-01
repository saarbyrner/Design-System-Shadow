import $ from 'jquery';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';

import GameEventListViewSummaryGrid from '../GameEventListViewSummaryGrid';

describe('GameEventListViewSummaryGrid', () => {
  const defaultProps = {
    athletes: [
      {
        id: 1,
        fullname: 'John Doe',
        avatar_url: 'avatar_url.jpg',
        position: { id: 1, name: 'Position 1', abbreviation: 'P1' },
      },
      {
        id: 2,
        fullname: 'Jane Doh',
        avatar_url: 'avatar_url.jpg',
        position: { id: 1, name: 'Position 2', abbreviation: 'P2' },
      },
      {
        id: 3,
        fullname: 'Jim Poe',
        avatar_url: 'avatar_url.jpg',
        position: { id: 1, name: 'Position 3', abbreviation: 'P3' },
      },
    ],
    gridSorting: { column: null, order: null },
    positionGroups: [
      {
        id: 28,
        name: 'Goalkeeper',
        order: 1,
        positions: [
          {
            id: 84,
            name: 'Goalkeeper',
            order: 1,
            abbreviation: 'GK',
          },
        ],
      },
    ],
    participationLevels: [
      {
        value: 3859,
        label: 'Started - Full Game',
        canonical_participation_level: 'full',
        include_in_group_calculations: true,
      },
    ],
    canEditEvent: true,
    event: { id: 1 },
    t: i18nextTranslateStub(),
    onAttributesBulkUpdate: jest.fn(),
  };

  const defaultStore = {
    planningEvent: {
      athletePlayTimes: {
        localAthletePlayTimes: [],
        apiAthletePlayTimes: [],
      },
      athleteEvents: { apiAthleteEvents: [] },
      gameActivities: {
        localGameActivities: [
          {
            id: 1,
            kind: eventTypes.position_change,
            absolute_minute: 0,
            athlete_id: 1,
            relation: { id: 84 },
            game_period_id: 1,
          },
          {
            id: 2,
            kind: eventTypes.position_change,
            absolute_minute: 45,
            athlete_id: 1,
            relation: { id: 84 },
            game_period_id: 2,
          },
          {
            id: 3,
            kind: eventTypes.position_change,
            absolute_minute: 20,
            athlete_id: 2,
            relation: { id: 84 },
            game_period_id: 1,
          },
          {
            id: 4,
            kind: eventTypes.position_change,
            absolute_minute: 75,
            athlete_id: 2,
            relation: { id: 84 },
            game_period_id: 2,
          },
          { id: 5, kind: eventTypes.goal, absolute_minute: 10, athlete_id: 1 },
          {
            id: 6,
            kind: eventTypes.position_change,
            absolute_minute: 0,
            athlete_id: 3,
            relation: { id: 84 },
            game_period_id: 1,
          },
          { id: 7, kind: eventTypes.goal, absolute_minute: 15, athlete_id: 3 },
          {
            id: 8,
            kind: eventTypes.own_goal,
            absolute_minute: 15,
            athlete_id: 3,
            game_activity_id: 6,
          },
        ],
      },
      eventPeriods: {
        localEventPeriods: [
          {
            id: 1,
            duration: 45,
            absolute_duration_start: 0,
            absolute_duration_end: 45,
          },
          {
            id: 2,
            duration: 45,
            absolute_duration_start: 45,
            absolute_duration_end: 90,
          },
        ],
      },
    },
  };

  const renderComponent = ({
    props = defaultProps,
    mockStore = defaultStore,
  }) =>
    renderWithRedux(<GameEventListViewSummaryGrid {...props} />, {
      preloadedState: mockStore,
    });

  describe('initial render', () => {
    it('renders the correct content when FF is enabled', async () => {
      window.setFlag('league-ops-game-events-own-goal', true);
      const user = userEvent.setup();
      renderComponent({});

      expect(screen.getByText('Athlete')).toBeInTheDocument();
      expect(screen.getByText('Total minutes')).toBeInTheDocument();
      expect(screen.getAllByText('Participation').length).toEqual(4);
      expect(screen.getByText('Group calculations')).toBeInTheDocument();
      expect(screen.getByText('Yellow')).toBeInTheDocument();
      expect(screen.getByText('Red')).toBeInTheDocument();
      expect(screen.getByText('Goal')).toBeInTheDocument();
      expect(screen.getByText('Assist')).toBeInTheDocument();
      expect(screen.getByText('Own Goal')).toBeInTheDocument();

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Position 1')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
      await user.hover(screen.getByText('90'));
      expect(screen.getAllByText('90').length).toEqual(2);

      expect(screen.getByText('Jane Doh')).toBeInTheDocument();
      expect(screen.getByText('Position 2')).toBeInTheDocument();
      expect(screen.getByText('40')).toBeInTheDocument();
      await user.hover(screen.getByText('40'));
      expect(screen.getAllByText('90').length).toEqual(2);

      expect(screen.getByText('Jim Poe')).toBeInTheDocument();
      expect(screen.getByText('Position 3')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
      await user.hover(screen.getByText('45'));
      expect(screen.getAllByText('90').length).toEqual(2);
    });

    it('allows the user to bulk update participation levels', async () => {
      window.setFlag('league-ops-game-events-own-goal', true);
      const ajaxSpy = jest.spyOn($, 'ajax');
      const user = userEvent.setup();
      renderComponent({});
      await user.click(screen.getAllByText('Participation')[0]);
      expect(screen.getByText('Set all')).toBeInTheDocument();
      await user.click(screen.getAllByRole('textbox')[3]);
      await user.click(screen.getByText('Started - Full Game'));
      await user.click(screen.getByText('Apply'));
      expect(ajaxSpy).toHaveBeenCalledWith({
        contentType: 'application/json',
        data: '{"participation_level":3859,"athlete_id":null,"filters":{},"tab":"athletes_tab"}',
        method: 'POST',
        url: '/planning_hub/events/1/athlete_events/update_attributes',
      });
      expect(defaultProps.onAttributesBulkUpdate).toHaveBeenCalled();
    });

    it('renders the correct rows and cells when FF is enabled', async () => {
      window.setFlag('league-ops-game-events-own-goal', true);

      renderComponent({});

      expect(screen.getByText('Own Goal')).toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const athlete1Row = rows.find((row) =>
        row.textContent.includes('John Doe')
      );
      expect(athlete1Row).toBeInTheDocument();

      const athlete2Row = rows.find((row) =>
        row.textContent.includes('Jane Doh')
      );
      expect(athlete2Row).toBeInTheDocument();

      const athlete3Row = rows.find((row) =>
        row.textContent.includes('Jim Poe')
      );
      expect(athlete3Row).toBeInTheDocument();

      expect(athlete1Row).toHaveTextContent('John Doe');
      // Yellow=0, Red=0, Goal=1, Assist=0, Own Goal=0
      expect(athlete1Row).toHaveTextContent('00100');

      expect(athlete2Row).toHaveTextContent('Jane Doh');
      // Yellow=0, Red=0, Goal=0, Assist=0, Own Goal=0
      expect(athlete2Row).toHaveTextContent('00000');

      expect(athlete3Row).toHaveTextContent('Jim Poe');
      // The goal number is 0 because it is marked as an own goal
      // Yellow=0, Red=0, Goal=0, Assist=0, Own Goal=1
      expect(athlete3Row).toHaveTextContent('00001');
    });

    it('renders the correct rows and cells when FF is disabled', async () => {
      window.setFlag('league-ops-game-events-own-goal', false);

      renderComponent({});

      expect(screen.queryByText('Own Goal')).not.toBeInTheDocument();

      const rows = screen.getAllByRole('row');
      const athlete1Row = rows.find((row) =>
        row.textContent.includes('John Doe')
      );
      expect(athlete1Row).toBeInTheDocument();

      const athlete2Row = rows.find((row) =>
        row.textContent.includes('Jane Doh')
      );
      expect(athlete2Row).toBeInTheDocument();

      const athlete3Row = rows.find((row) =>
        row.textContent.includes('Jim Poe')
      );
      expect(athlete3Row).toBeInTheDocument();

      expect(athlete1Row).toHaveTextContent('John Doe');
      // Yellow=0, Red=0, Goal=1, Assist=0
      expect(athlete1Row).toHaveTextContent('0010');

      expect(athlete2Row).toHaveTextContent('Jane Doh');
      // Yellow=0, Red=0, Goal=0, Assist=0
      expect(athlete2Row).toHaveTextContent('0000');

      expect(athlete3Row).toHaveTextContent('Jim Poe');
      // The goal number is 1 because the FF is disabled
      // Yellow=0, Red=0, Goal=0, Assist=0
      expect(athlete3Row).toHaveTextContent('0010');
    });
  });

  describe('render without edit permissions', () => {
    it('renders NO for group calculations', async () => {
      renderComponent({ props: { ...defaultProps, canEditEvent: false } });
      expect(screen.getAllByText('No').length).toEqual(3);
    });
  });

  describe('[featureflag set-overall-game-minutes] render', () => {
    const manualTimesStore = {
      planningEvent: {
        ...defaultStore.planningEvent,
        athletePlayTimes: {
          localAthletePlayTimes: [
            { game_period_id: 1, athlete_id: 1, minutes: 40 },
            { game_period_id: 2, athlete_id: 1, minutes: 20 },
            { game_period_id: 1, athlete_id: 2, minutes: 15 },
            { game_period_id: 2, athlete_id: 2, minutes: 35 },
            { game_period_id: 1, athlete_id: 3, minutes: 25 },
            { game_period_id: 2, athlete_id: 3, minutes: 30 },
          ],
          apiAthletePlayTimes: [],
        },
      },
    };

    beforeEach(() => {
      window.featureFlags = { 'set-overall-game-minutes': true };
    });

    afterEach(() => {
      window.featureFlags = { 'set-overall-game-minutes': false };
    });

    it('renders the correct content', async () => {
      const user = userEvent.setup();
      renderComponent({ mockStore: manualTimesStore });

      expect(screen.getByText('60')).toBeInTheDocument();
      await user.hover(screen.getByText('60'));
      expect(screen.getAllByText('60').length).toEqual(2);

      expect(screen.getByText('50')).toBeInTheDocument();
      await user.hover(screen.getByText('50'));
      expect(screen.getAllByText('50').length).toEqual(2);

      expect(screen.getByText('55')).toBeInTheDocument();
      await user.hover(screen.getByText('55'));
      expect(screen.getAllByText('55').length).toEqual(2);
    });
  });
});
