import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import SessionSelector from '../index';

describe('SessionSelector component', () => {
  const props = {
    sessionType: 'Game',
    onChange: jest.fn(),
    turnaroundList: [
      { id: 45899, name: 'PS1', from: '31 Jan 2020', to: '06 Feb 2020' },
    ],
    t: i18nextTranslateStub(),
  };

  describe('On the 2019-11-08', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2019-11-08'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('has 1 week range selected by default', () => {
      render(<SessionSelector {...props} />);
      expect(screen.getAllByRole('textbox')[0]).toHaveValue(
        '1 Nov 2019 - 8 Nov 2019'
      );
    });
  });

  describe('When the request fails', () => {
    beforeEach(() => {
      server.use(
        rest.get('/workloads/games', (req, res, ctx) => res(ctx.status(500)))
      );
    });

    it('renders an error message', async () => {
      render(<SessionSelector {...props} />);

      await waitFor(() =>
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
      );
    });
  });

  describe('When the session is a Game', () => {
    it('renders the correct dropdown label', () => {
      render(<SessionSelector {...props} />);
      expect(screen.getByText('#sport_specific__Games')).toBeInTheDocument();
    });

    it('renders the correct empty text', () => {
      render(<SessionSelector {...props} />);
      expect(
        screen.getByText('No games available for date range.')
      ).toBeInTheDocument();
    });

    describe('When the request succeed', () => {
      beforeEach(() => {
        server.use(
          rest.get('/workloads/games', (req, res, ctx) =>
            res(
              ctx.json([
                {
                  id: 1,
                  date: '2019-11-08',
                  opponent_score: 1,
                  opponent_team_name: 'Team A',
                  score: 3,
                  team_name: 'Team B',
                  venue_type_name: 2,
                },
              ])
            )
          )
        );
      });

      describe('when the standard-date-formatting flag is off', () => {
        beforeEach(() => {
          window.featureFlags['standard-date-formatting'] = false;
        });

        it('renders the correct dropdown content', async () => {
          render(<SessionSelector {...props} />);

          await waitFor(() =>
            expect(screen.getByText('Team A (8 Nov 2019)')).toBeInTheDocument()
          );
        });

        it('calls onChange when choosing a session', async () => {
          render(<SessionSelector {...props} />);

          const gameAgainstTeamA = await screen.findByText(
            'Team A (8 Nov 2019)'
          );
          await userEvent.click(gameAgainstTeamA);

          expect(props.onChange).toHaveBeenCalledWith(1);
        });

        it('initiates the correct form values when editing', async () => {
          render(
            <SessionSelector
              {...props}
              initialDateRange={{
                start_date: '2020-01-01T00:00:00+00:00',
                end_date: '2020-01-01T00:00:00+00:00',
              }}
              sessionId={1}
            />
          );

          await waitFor(() => {
            expect(
              screen.getByRole('button', { name: 'Team A (8 Nov 2019)' })
            ).toBeInTheDocument();
          });

          expect(screen.getAllByRole('textbox')[0]).toHaveValue(
            '1 Jan 2020 - 1 Jan 2020'
          );
        });
      });
    });
  });

  describe('When the session is a training session', () => {
    it('renders the correct dropdown label', () => {
      render(<SessionSelector {...props} sessionType="TrainingSession" />);
      expect(screen.getByText('Training Sessions')).toBeInTheDocument();
    });

    it('renders the correct empty text', () => {
      render(<SessionSelector {...props} sessionType="TrainingSession" />);
      expect(
        screen.getByText('No sessions available for date range')
      ).toBeInTheDocument();
    });

    describe('When the request succeed', () => {
      beforeEach(() => {
        server.use(
          rest.get('/workloads/training_sessions', (req, res, ctx) =>
            res(
              ctx.json([
                {
                  id: 1,
                  date: '2019-11-08',
                  duration: 20,
                  session_type_name: 'Agility',
                  game_day_minus: 1,
                  game_day_plus: 3,
                },
                {
                  id: 2,
                  date: '2019-11-09',
                  duration: 30,
                  session_type_name: 'HSR',
                },
              ])
            )
          )
        );
      });

      it('renders the correct dropdwon content', async () => {
        render(<SessionSelector {...props} sessionType="TrainingSession" />);

        await waitFor(() => {
          expect(screen.getByText('Agility - Nov 8, 2019')).toBeInTheDocument();
          expect(screen.getByText('- (+3, -1)')).toBeInTheDocument();
          expect(screen.getByText('HSR - Nov 9, 2019')).toBeInTheDocument();
        });
      });
    });
  });
});
