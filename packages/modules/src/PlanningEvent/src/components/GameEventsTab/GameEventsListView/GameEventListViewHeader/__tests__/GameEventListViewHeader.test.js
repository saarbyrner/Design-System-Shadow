import $ from 'jquery';
import * as redux from 'react-redux';
import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import GameEventListViewHeader from '../GameEventListViewHeader';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('GameEventListViewHeader', () => {
  const formationChange = {
    id: 1,
    kind: eventTypes.formation_change,
    absolute_minute: 10,
    relation: { id: 1, name: '4-4-2' },
  };

  const mockPeriod = {
    duration: 45,
    additional_duration: 5,
    absolute_duration_start: 0,
    absolute_duration_end: 45,
  };

  const defaultProps = {
    canDelete: true,
    isDmrLocked: false,
    pitchViewEnabled: false,
    event: { id: 1 },
    isFirstPeriodSelected: false,
    activitiesForPeriod: [
      formationChange,
      {
        id: 2,
        kind: eventTypes.formation_change,
        absolute_minute: 30,
        relation: { id: 2, name: '4-3-3' },
      },
      { id: 3, absolute_minute: 10, kind: eventTypes.red, athlete_id: 5 },
    ],
    t: i18nextTranslateStub(),
    period: mockPeriod,
    onDelete: jest.fn(),
    onEdit: jest.fn(),
    onGameActivitiesUpdate: jest.fn(),
  };

  const defaultStartedPeriodProps = {
    event: { id: 1 },
    activitiesForPeriod: [formationChange],
    t: i18nextTranslateStub(),
    period: mockPeriod,
    isFirstPeriodSelected: true,
    canDelete: true,
    pitchViewEnabled: true,
    hasPeriodStarted: true,
    onGameActivitiesUpdate: jest.fn(),
  };

  const renderComponent = (props = defaultProps, matchDayFlow = false) => {
    usePreferences.mockReturnValue({
      preferences: {
        league_game_team: matchDayFlow,
      },
    });
    return render(<GameEventListViewHeader {...props} />);
  };

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  describe('initial rendering', () => {
    it('renders the correct period/formation data', () => {
      renderComponent();
      expect(
        screen.getByText('Duration: 45 (+ 5) mins | 4-4-2 | 4-3-3')
      ).toBeInTheDocument();
    });

    it('fires off onEdit when the edit tooltip is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getAllByRole('button')[1]);
      await user.click(screen.getByText('Edit'));

      expect(defaultProps.onEdit).toHaveBeenCalledWith(defaultProps.period);
    });

    it('renders the delete modal when the delete modal tooltip is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getAllByRole('button')[1]);
      await user.click(screen.getByText('Delete'));

      expect(screen.getByText('Delete period')).toBeInTheDocument();
      await user.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Delete period')).not.toBeInTheDocument();
    });

    it('fires off onDelete when Delete is called in the modal', async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(screen.getAllByRole('button')[1]);
      await user.click(screen.getByText('Delete'));

      expect(screen.getByText('Delete period')).toBeInTheDocument();
      await user.click(screen.getAllByText('Delete')[1]);
      expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.period);
    });

    it('presents the user with a cannot delete modal when delete is clicked', async () => {
      const user = userEvent.setup();
      renderComponent({ ...defaultProps, canDelete: false });
      await user.click(screen.getAllByRole('button')[1]);
      await user.click(screen.getByText('Delete'));

      expect(screen.getByText('Unable to delete period')).toBeInTheDocument();
      await user.click(screen.getByText('Close'));
    });

    it('hides the delete period option when in the match day flow for the first period', async () => {
      const user = userEvent.setup();
      renderComponent(
        {
          ...defaultProps,
          isFirstPeriodSelected: true,
          event: { id: 1, league_setup: true },
        },
        true
      );
      await user.click(screen.getAllByRole('button')[1]);
      expect(screen.queryByText('Delete')).not.toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });

  describe('pitch view enabled render', () => {
    beforeEach(() => {
      const deferred = $.Deferred();
      jest.spyOn($, 'ajax').mockImplementation(() => deferred.resolve([]));
    });

    it('presents the user with a delete modal and confirm button', async () => {
      const user = userEvent.setup();
      renderComponent({ ...defaultProps, pitchViewEnabled: true });
      await user.click(screen.getAllByRole('button')[2]);
      await user.click(screen.getByText('Delete'));
      expect(screen.getByText('Delete period')).toBeInTheDocument();
      await user.click(screen.getByText('Confirm'));
      expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.period);
    });

    it('renders the clear period button and when clicked clears the periods activities', async () => {
      const user = userEvent.setup();
      renderComponent({ ...defaultProps, pitchViewEnabled: true });
      expect(screen.getByText('Clear')).toBeInTheDocument();
      await user.click(screen.getByText('Clear'));
      await user.click(screen.getByText('Confirm'));
      expect(defaultProps.onGameActivitiesUpdate).toHaveBeenCalledWith({
        updates: [],
        deletions: [
          { id: 1, delete: true },
          { delete: true, id: 2 },
          { id: 3, delete: true },
        ],
      });
    });
  });

  describe('pitch view enabled render and formation_complete', () => {
    const formationCompleteProps = {
      ...defaultStartedPeriodProps,
      activitiesForPeriod: [
        formationChange,
        { id: 2, absolute_minute: 10, kind: eventTypes.red, athlete_id: 5 },
        { id: 3, absolute_minute: 6, kind: eventTypes.goal, athlete_id: 5 },
        {
          id: 4,
          kind: eventTypes.formation_complete,
          athlete_id: null,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: 'Planning::Private::Models::Formation',
          relation: {
            id: 3,
            number_of_players: 11,
            name: '3-4-3',
          },
          game_period_id: 16,
          game_activity_id: null,
        },
        {
          id: 5,
          kind: eventTypes.formation_position_view_change,
          athlete_id: 1,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: 'Planning::Private::Models::FormationPositionView',
          relation: {
            id: 23,
            field_id: 1,
            formation_id: 3,
            position: {
              id: 84,
              name: 'Goalkeeper',
              order: 1,
              abbreviation: 'GK',
            },
            x: 0,
            y: 5,
            order: 1,
          },
          game_period_id: 16,
          game_activity_id: null,
        },
        {
          id: 6,
          kind: eventTypes.position_change,
          athlete_id: 1,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: 'Position',
          relation: {
            id: 84,
            name: 'Goalkeeper',
            order: 1,
          },
          game_period_id: 16,
          game_activity_id: null,
        },
      ],
    };

    it('renders the Edit lineup and Clear events buttons when formation_complete game activity exists', async () => {
      renderComponent({ ...formationCompleteProps });
      const buttonEditStartingLineup = screen.getByRole('button', {
        name: 'Edit lineup',
      });
      expect(buttonEditStartingLineup).toBeInTheDocument();
      const buttonClearEvents = screen.getByRole('button', {
        name: 'Clear events',
      });
      expect(buttonClearEvents).toBeInTheDocument();
    });

    it('disables the edit lineup button when the isDmrLocked prop is true', async () => {
      renderComponent({ ...formationCompleteProps, isDmrLocked: true });
      const buttonEditStartingLineup = screen.getByRole('button', {
        name: 'Edit lineup',
      });
      expect(buttonEditStartingLineup).toBeDisabled();
    });

    it('renders the most recent pitch movement activity', () => {
      renderComponent({ ...formationCompleteProps });
      expect(
        screen.getByText('Recent Pitch Movement Activity:')
      ).toBeInTheDocument();
      expect(
        screen.getByText("Formation Change - 4-4-2 10'")
      ).toBeInTheDocument();
    });

    it('expects the Edit lineup button to be disabled when in period game activities exist', () => {
      renderComponent({ ...formationCompleteProps });
      const buttonEditStartingLineup = screen.getByRole('button', {
        name: 'Edit lineup',
      });
      expect(buttonEditStartingLineup).toBeDisabled();
    });

    it('renders the Clear events button and when clicked clears the periods activities', async () => {
      const user = userEvent.setup();
      renderComponent({ ...formationCompleteProps });
      expect(screen.getByText('Clear events')).toBeInTheDocument();
      await user.click(screen.getByText('Clear events'));
      await user.click(screen.getByText('Confirm'));
      expect(
        formationCompleteProps.onGameActivitiesUpdate
      ).toHaveBeenCalledWith({
        deletions: [
          { delete: true, id: 1 },
          { delete: true, id: 2 },
          { delete: true, id: 3 },
        ],
        updates: [],
      });
    });
  });

  describe('pitch view enabled render with a substitution as the most recent activity', () => {
    const subInfoProps = {
      ...defaultStartedPeriodProps,
      athletes: [{ id: 4444, fullname: 'Test Name Man' }],
      activitiesForPeriod: [
        {
          id: 3,
          kind: eventTypes.formation_complete,
          athlete_id: null,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: 'Planning::Private::Models::Formation',
          relation: {
            id: 1,
            number_of_players: 11,
            name: '4-4-2',
          },
          game_period_id: 1,
          game_activity_id: null,
        },
        {
          id: 4,
          kind: eventTypes.sub,
          athlete_id: 4444,
          game_period_id: 1,
          absolute_minute: 20,
          game_activity_id: null,
        },
      ],
    };

    it('renders the most recent pitch movement activity', () => {
      renderComponent({ ...subInfoProps });
      expect(
        screen.getByText('Recent Pitch Movement Activity:')
      ).toBeInTheDocument();
      expect(
        screen.getByText("Substitution - Test Name Man 20'")
      ).toBeInTheDocument();
    });
  });

  describe('pitch view enabled render and Edit lineup button enabled', () => {
    const editStartingLineupEnabledProps = {
      ...defaultStartedPeriodProps,
      activitiesForPeriod: [
        {
          id: 3,
          kind: eventTypes.formation_complete,
          athlete_id: null,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: 'Planning::Private::Models::Formation',
          relation: {
            id: 1,
            number_of_players: 11,
            name: '4-4-2',
          },
          game_period_id: 1,
          game_activity_id: null,
        },
      ],
    };

    it('renders the Edit lineup button when formation_complete game activity exists', () => {
      renderComponent({ ...editStartingLineupEnabledProps });
      const buttonEditStartingLineup = screen.getByRole('button', {
        name: 'Edit lineup',
      });
      expect(buttonEditStartingLineup).toBeInTheDocument();
    });

    it('expects the Edit lineup button to be enabled when in period game activities do not exist', () => {
      renderComponent({ ...editStartingLineupEnabledProps });
      const buttonEditStartingLineup = screen.getByRole('button', {
        name: 'Edit lineup',
      });
      expect(buttonEditStartingLineup).toBeEnabled();
    });

    it('allows edit lineup to be clicked and a dispatch to be fired updating the activities', async () => {
      const user = userEvent.setup();
      renderComponent({ ...editStartingLineupEnabledProps });
      await user.click(
        screen.getByRole('button', {
          name: 'Edit lineup',
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: [
          {
            ...editStartingLineupEnabledProps.activitiesForPeriod[0],
            delete: true,
          },
        ],
        type: 'gameActivities/setUnsavedGameActivities',
      });
    });
  });
});
