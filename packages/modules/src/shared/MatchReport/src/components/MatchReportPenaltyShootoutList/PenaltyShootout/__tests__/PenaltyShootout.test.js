import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'core-js/stable/structured-clone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PenaltyShootout from '../index';

describe('PenaltyShootout', () => {
  const mockPenaltyActivity = {
    activityIndex: 0,
    absolute_minute: 1,
    minute: 1,
    athlete_id: null,
    kind: 'penalty_shootout',
  };

  const mockPenaltyActivities = {
    homePenalties: [mockPenaltyActivity, mockPenaltyActivity],
  };

  const mockPlayers = [
    { id: 1, fullname: 'Ted Danson', squad_number: 4 },
    { id: 2, fullname: 'Danny Devito', squad_number: 6 },
  ];

  const mockSetPenaltyActivities = jest.fn();

  const renderComponent = (
    currentActivity = mockPenaltyActivity,
    currentPenaltyActivities = mockPenaltyActivities,
    penaltyNum = 1
  ) =>
    render(
      <PenaltyShootout
        penaltyNum={penaltyNum}
        players={mockPlayers}
        teamPenaltyType="homePenalties"
        penaltyActivity={currentActivity}
        setPenaltyActivities={mockSetPenaltyActivities}
        allPenaltyActivities={currentPenaltyActivities}
        isReadOnly={false}
        t={i18nextTranslateStub()}
      />
    );

  describe('initial local penalties render', () => {
    it('renders out the penalty shootout row', () => {
      renderComponent();
      expect(screen.getByText('Player 1')).toBeInTheDocument();
      expect(screen.getAllByRole('button').length).toEqual(3);
    });

    it('allows the user to select a player', async () => {
      renderComponent();
      await userEvent.click(screen.getByLabelText('Player 1'));
      await userEvent.click(screen.getByText('Danny Devito'));
      expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
        homePenalties: [
          {
            activityIndex: 0,
            absolute_minute: 1,
            athlete_id: 2,
            kind: 'penalty_shootout',
            minute: 1,
          },
          mockPenaltyActivity,
        ],
      });
    });

    it('allows the user to click the scored or missed buttons', async () => {
      renderComponent({ ...mockPenaltyActivity, athlete_id: 1 });
      await userEvent.click(screen.getByTestId('SCORED-button'));
      expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
        homePenalties: [
          {
            activityIndex: 0,
            absolute_minute: 1,
            athlete_id: null,
            game_activities: [
              {
                absolute_minute: 0,
                athlete_id: null,
                kind: 'goal',
                minute: 0,
              },
            ],
            kind: 'penalty_shootout',
            minute: 1,
          },
          mockPenaltyActivity,
        ],
      });

      await userEvent.click(screen.getByTestId('MISSED-button'));
      expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
        homePenalties: [
          {
            activityIndex: 0,
            absolute_minute: 1,
            athlete_id: null,
            game_activities: [
              {
                absolute_minute: 0,
                athlete_id: null,
                kind: 'no_goal',
                minute: 0,
              },
            ],
            kind: 'penalty_shootout',
            minute: 1,
          },
          mockPenaltyActivity,
        ],
      });
    });
  });

  describe('local completed penalty render', () => {
    const mockAthletePenaltyActivity = {
      activityIndex: 0,
      absolute_minute: 1,
      minute: 1,
      athlete_id: 2,
      kind: 'penalty_shootout',
      game_activities: [{ kind: 'goal', athlete_id: 2, absolute_minute: 1 }],
    };

    const mockPreSelectedActivities = {
      homePenalties: [mockAthletePenaltyActivity, mockPenaltyActivity],
    };

    beforeEach(() => {
      renderComponent(mockAthletePenaltyActivity, mockPreSelectedActivities);
    });

    it('renders the athletes jersey number', () => {
      expect(screen.getByText('Danny Devito')).toBeInTheDocument();
      expect(screen.getByText('#6')).toBeInTheDocument();
    });

    it('changes the penalty nested activity athlete_id when the athlete is updated', async () => {
      await userEvent.click(screen.getByLabelText('Player 1'));
      await userEvent.click(screen.getByText('Ted Danson'));

      expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
        homePenalties: [
          {
            ...mockAthletePenaltyActivity,
            athlete_id: 1,
            game_activities: [
              { absolute_minute: 1, athlete_id: 1, kind: 'goal' },
            ],
          },
          mockPenaltyActivity,
        ],
      });
    });

    it('unsets the penalty status when the scored button is clicked', async () => {
      await userEvent.click(screen.getByTestId('SCORED-button'));
      expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
        homePenalties: [
          {
            ...mockAthletePenaltyActivity,
            game_activities: null,
          },
          mockPenaltyActivity,
        ],
      });
    });
  });

  describe('saved penalties render', () => {
    const mockSavedActivities = {
      homePenalties: [
        {
          activityIndex: 0,
          id: 1,
          absolute_minute: 1,
          minute: 1,
          athlete_id: 2,
          kind: 'penalty_shootout',
        },
        {
          activityIndex: 1,
          id: 2,
          absolute_minute: 2,
          minute: 2,
          athlete_id: 2,
          kind: 'penalty_shootout',
        },
        {
          id: 3,
          absolute_minute: 0,
          minute: 0,
          athlete_id: 2,
          kind: 'goal',
          game_activity_id: 1,
        },
      ],
    };

    it('changes the saved penalty activity athlete_id when the athlete is updated', async () => {
      renderComponent(
        mockSavedActivities.homePenalties[0],
        mockSavedActivities
      );

      await userEvent.click(screen.getByLabelText('Player 1'));
      await userEvent.click(screen.getByText('Ted Danson'));

      expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
        homePenalties: [
          {
            ...mockSavedActivities.homePenalties[0],
            athlete_id: 1,
          },
          mockSavedActivities.homePenalties[1],
          {
            ...mockSavedActivities.homePenalties[2],
            athlete_id: 1,
          },
        ],
      });
    });

    it('allows the user to change the status of a saved penalty', async () => {
      renderComponent(
        mockSavedActivities.homePenalties[0],
        mockSavedActivities
      );
      await userEvent.click(screen.getByTestId('SCORED-button'));
      expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
        homePenalties: [
          {
            ...mockSavedActivities.homePenalties[0],
            game_activities: null,
          },
          mockSavedActivities.homePenalties[1],
          {
            ...mockSavedActivities.homePenalties[2],
            delete: true,
          },
        ],
      });

      await userEvent.click(screen.getByTestId('MISSED-button'));
      expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
        homePenalties: [
          {
            ...mockSavedActivities.homePenalties[0],
            game_activities: [
              {
                absolute_minute: 0,
                athlete_id: 2,
                kind: 'no_goal',
                minute: 0,
              },
            ],
          },
          mockSavedActivities.homePenalties[1],
          {
            ...mockSavedActivities.homePenalties[2],
            delete: true,
          },
        ],
      });
    });
  });

  describe('penalties delete render', () => {
    const mockPenalties = [
      mockPenaltyActivity,
      {
        ...mockPenaltyActivity,
        absolute_minute: 2,
        minute: 2,
        activityIndex: 1,
      },
      {
        ...mockPenaltyActivity,
        absolute_minute: 3,
        minute: 3,
        activityIndex: 2,
      },
    ];

    const mockTeamsPenaltiesForDelete = {
      homePenalties: mockPenalties,
      awayPenalties: mockPenalties,
    };

    const mockSavedPenalties = [
      { ...mockPenalties[0], id: 1 },
      { ...mockPenalties[1], id: 2 },
      { ...mockPenalties[1], id: 2, delete: true },
      { ...mockPenalties[2], id: 3 },
    ];

    const mockSavedTeamsPenaltiesForDelete = {
      homePenalties: mockSavedPenalties,
      awayPenalties: mockSavedPenalties,
    };

    describe('local penalties render', () => {
      it('allows the user to delete a penalty and adjust the other penalties to their new counter', async () => {
        renderComponent(mockPenalties[1], mockTeamsPenaltiesForDelete, 2);
        await userEvent.hover(screen.getAllByRole('button')[2]);
        await userEvent.click(screen.getAllByRole('button')[2]);
        expect(screen.getByText('Delete Penalty')).toBeInTheDocument();
        await userEvent.click(screen.getByText('Confirm'));
        expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
          awayPenalties: [
            mockPenalties[0],
            {
              ...mockPenalties[2],
              absolute_minute: 2,
              minute: 2,
            },
          ],
          homePenalties: [
            mockPenalties[0],
            {
              ...mockPenalties[2],
              absolute_minute: 2,
              minute: 2,
            },
          ],
        });
      });
    });

    describe('saved penalties render', () => {
      it('allows the user to delete a saved penalty and adjust the other saved penalties to their new counter', async () => {
        renderComponent(
          mockSavedPenalties[1],
          mockSavedTeamsPenaltiesForDelete,
          2
        );
        await userEvent.hover(screen.getAllByRole('button')[2]);
        await userEvent.click(screen.getAllByRole('button')[2]);
        expect(screen.getByText('Delete Penalty')).toBeInTheDocument();
        await userEvent.click(screen.getByText('Confirm'));
        expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
          awayPenalties: [
            mockSavedPenalties[0],
            {
              ...mockSavedPenalties[1],
              delete: true,
            },
            mockSavedPenalties[2],
            {
              ...mockSavedPenalties[3],
              absolute_minute: 2,
              minute: 2,
            },
          ],
          homePenalties: [
            mockSavedPenalties[0],
            {
              ...mockSavedPenalties[1],
              delete: true,
            },
            mockSavedPenalties[2],
            {
              ...mockSavedPenalties[3],
              absolute_minute: 2,
              minute: 2,
            },
          ],
        });
      });
    });
  });
});
