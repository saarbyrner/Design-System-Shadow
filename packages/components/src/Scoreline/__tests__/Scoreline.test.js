import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Scoreline from '../index';

describe('Scoreline', () => {
  const mockSetGameScores = jest.fn();
  const mockGameScores = { orgScore: 1, opponentScore: 2 };

  const renderComponent = (
    mockGameEvent = {},
    gameScores = mockGameScores,
    editDisabled = false
  ) =>
    render(
      <Scoreline
        gameScores={gameScores}
        gameEvent={mockGameEvent}
        setGameScores={mockSetGameScores}
        isEditScoreDisabled={editDisabled}
      />
    );

  describe('initial render', () => {
    beforeEach(() => {
      renderComponent();
    });

    it('renders the default crest image if no logo path supplied', () => {
      expect(screen.getByTestId('org-crest')).toHaveAttribute(
        'src',
        '/img/kitman_default_crest.svg'
      );
      expect(screen.getByTestId('opponent-crest')).toHaveAttribute(
        'src',
        '/img/kitman_default_crest.svg'
      );
    });

    it('renders out the org score and opponent score', () => {
      expect(screen.getAllByRole('spinbutton')[0]).toHaveValue(1);
      expect(screen.getAllByRole('spinbutton')[1]).toHaveValue(2);
    });

    it('fires off change events when the scores are altered', async () => {
      await userEvent.type(screen.getAllByRole('spinbutton')[0], '3');
      expect(mockSetGameScores).toHaveBeenCalledWith({
        orgScore: 13,
        opponentScore: 2,
      });
      await userEvent.type(screen.getAllByRole('spinbutton')[1], '2');
      expect(mockSetGameScores).toHaveBeenCalledWith({
        orgScore: 1,
        opponentScore: 22,
      });
    });
  });

  describe('render with game event', () => {
    const mockGameEventGameScores = { orgScore: 12, opponentScore: 2 };

    const mockGameEvent = {
      organisation_team: {
        name: 'test org name',
        logo_full_path: 'testOrgPath.png',
      },
      opponent_team: {
        name: 'test opponent name',
        logo_full_path: 'testOpponentName.png',
      },
    };

    beforeEach(() => {
      renderComponent(mockGameEvent, mockGameEventGameScores);
    });

    it('Does not update the score when the score value is already 2 digits', async () => {
      await userEvent.type(screen.getAllByRole('spinbutton')[0], '3');
      expect(mockSetGameScores).not.toHaveBeenCalled();
    });
  });

  describe('render with edit disabled', () => {
    beforeEach(() => {
      renderComponent({}, mockGameScores, true);
    });

    it('does not allow the score inputs to be altered', async () => {
      await userEvent.type(screen.getAllByRole('spinbutton')[0], '3');
      expect(mockSetGameScores).not.toHaveBeenCalled();
      await userEvent.type(screen.getAllByRole('spinbutton')[1], '2');
      expect(mockSetGameScores).not.toHaveBeenCalled();
    });
  });
});
