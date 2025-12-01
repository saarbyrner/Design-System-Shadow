import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import MatchReportPenaltyShootoutList from '../index';

describe('MatchReportPenaltyShootoutList', () => {
  const mockGameEvent = {
    squad: { name: 'Test Name 1', owner_name: 'KL Galaxy' },
    opponent_squad: { name: 'Test Name 2', owner_name: 'KL Toronto' },
  };
  const mockPlayers = { homePlayers: [], awayPlayers: [] };

  const mockPenaltyActivities = {
    homePenalties: [
      { athlete_id: null, kind: 'penalty_shootout', absolute_minute: '1' },
    ],
    awayPenalties: [
      { athlete_id: null, kind: 'penalty_shootout', absolute_minute: '1' },
    ],
  };
  const mockSetPenaltyActivities = jest.fn();

  const componentRender = (gameEvent = mockGameEvent) =>
    render(
      <MatchReportPenaltyShootoutList
        gameEvent={gameEvent}
        players={mockPlayers}
        penaltyActivities={mockPenaltyActivities}
        setPenaltyActivities={mockSetPenaltyActivities}
        isReadOnly={false}
        t={i18nextTranslateStub()}
      />
    );

  describe('initial render', () => {
    beforeEach(() => {
      componentRender();
    });

    it('renders out the header', () => {
      expect(screen.getByText('Penalty Shoot-out')).toBeInTheDocument();
      expect(screen.getByText('Add Penalty')).toBeInTheDocument();
    });

    it('renders out the team names', () => {
      expect(screen.getByText('KL Galaxy Test Name 1')).toBeInTheDocument();
      expect(screen.getByText('KL Toronto Test Name 2')).toBeInTheDocument();
      expect(screen.getAllByText('Jersey').length).toEqual(2);
      expect(screen.getAllByText('Scored').length).toEqual(2);
      expect(screen.getAllByText('Missed').length).toEqual(2);
    });

    it('allows the user to click and add additional penalties for each team', async () => {
      await userEvent.click(screen.getByText('Add Penalty'));
      expect(mockSetPenaltyActivities).toHaveBeenCalledWith({
        awayPenalties: [
          { absolute_minute: '1', athlete_id: null, kind: 'penalty_shootout' },
          {
            absolute_minute: 2,
            athlete_id: null,
            kind: 'penalty_shootout',
            minute: 2,
          },
        ],
        homePenalties: [
          { absolute_minute: '1', athlete_id: null, kind: 'penalty_shootout' },
          {
            absolute_minute: 2,
            athlete_id: null,
            kind: 'penalty_shootout',
            minute: 2,
          },
        ],
      });
    });
  });

  describe('non squad render', () => {
    it('renders out the respective correct team names', () => {
      componentRender({
        organisation_team: { name: 'The Bloodline' },
        opponent_team: { name: 'The Judgement Day' },
      });
      expect(screen.getByText('The Bloodline')).toBeInTheDocument();
      expect(screen.getByText('The Judgement Day')).toBeInTheDocument();
    });
  });
});
