import { render, screen, waitFor } from '@testing-library/react';
import $ from 'jquery';
import ActivityName from '../../components/ActivityName';

jest.mock('jquery', () => ({
  ajax: jest.fn(),
}));

describe('ActivityName Component', () => {
  const gameAndTrainingMockData = {
    games: [
      {
        value: 3,
        name: 'vs Cork',
      },
    ],
    training_sessions: [
      {
        value: 4,
        name: 'Club Training',
      },
    ],
  };

  describe('when the activity is a game', () => {
    const props = {
      activityType: 'game',
      athleteId: 2,
      occurrenceDate: '10/11/2018',
      gameId: 3,
      trainingSessionId: null,
      t: (key) => key,
    };

    it('requests the game data with the correct params then shows the game name', async () => {
      $.ajax.mockImplementation((options) => {
        options.success(gameAndTrainingMockData);
      });

      render(<ActivityName {...props} />);

      expect($.ajax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/athletes/2/injuries/game_and_training_options',
          data: {
            date: props.occurrenceDate,
          },
        })
      );

      await waitFor(() => {
        expect(screen.getByText('vs Cork')).toBeInTheDocument();
      });
    });

    describe('when no game is specified', () => {
      it('displays "Unlisted Games" instead of a game name', async () => {
        const newProps = { ...props, gameId: null };
        $.ajax.mockImplementation((options) => {
          options.success(gameAndTrainingMockData);
        });

        render(<ActivityName {...newProps} />);

        await waitFor(() => {
          expect(screen.getByText('Unlisted Games')).toBeInTheDocument();
        });
      });
    });
  });

  describe('when the activity is a training session', () => {
    const props = {
      activityType: 'training',
      athleteId: 2,
      occurrenceDate: '10/11/2018',
      gameId: null,
      trainingSessionId: 4,
      t: (key) => key,
    };

    it('requests the training session data with the correct params then shows the training session name', async () => {
      $.ajax.mockImplementation((options) => {
        options.success(gameAndTrainingMockData);
      });

      render(<ActivityName {...props} />);

      expect($.ajax).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/athletes/2/injuries/game_and_training_options',
          data: {
            date: props.occurrenceDate,
          },
        })
      );

      await waitFor(() => {
        expect(screen.getByText('Club Training')).toBeInTheDocument();
      });
    });

    describe('when no training session is specified', () => {
      it('displays "Unlisted Training Session" instead of a training session name', async () => {
        const newProps = { ...props, trainingSessionId: null };
        $.ajax.mockImplementation((options) => {
          options.success(gameAndTrainingMockData);
        });

        render(<ActivityName {...newProps} />);

        await waitFor(() => {
          expect(
            screen.getByText('Unlisted Training Session')
          ).toBeInTheDocument();
        });
      });
    });
  });
});
