import i18n from 'i18next';
import { setI18n } from 'react-i18next';
import { VirtuosoMockContext } from 'react-virtuoso';
import * as redux from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import {
  getIsPanelOpen,
  getGame,
} from '@kitman/modules/src/LeagueFixtures/src/redux/selectors/assignStaffSelectors';
import { rest, server } from '@kitman/services/src/mocks/server';
import {
  mockGame,
  mockOfficials,
  mockGameOfficials,
} from '@kitman/modules/src/LeagueFixtures/__tests__/testScheduleData';
import { fixtureReports } from '@kitman/modules/src/shared/FixtureScheduleView/helpers';

import AssignStaffPanel from '..';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/LeagueFixtures/src/redux/selectors/assignStaffSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueFixtures/src/redux/selectors/assignStaffSelectors'
    ),
    getIsPanelOpen: jest.fn(),
    getGame: jest.fn(),
  })
);

const mockSelectors = ({ isOpen = false, game = mockGame }) => {
  getIsPanelOpen.mockReturnValue(isOpen);
  getGame.mockReturnValue(game);
};

describe('Assign Staff Panel', () => {
  const props = {
    reportType: fixtureReports.matchReport,
    t: i18nT,
  };
  const renderComponent = (extraProps) =>
    renderWithRedux(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 10000, itemHeight: 50 }}
      >
        <AssignStaffPanel {...props} {...extraProps} />
      </VirtuosoMockContext.Provider>
    );

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);

    server.use(
      rest.get('/users/official_only', (req, res, ctx) => {
        return res(ctx.json(mockOfficials));
      }),
      rest.post('/settings/additional_users/search', (req, res, ctx) => {
        return res(ctx.json({ data: mockOfficials }));
      })
    );
  });

  describe('NOT OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isOpen: false });
    });
    it('does not render', () => {
      renderComponent();
      expect(screen.queryByText('Save')).not.toBeInTheDocument();
    });
  });

  describe('IS OPEN', () => {
    describe('unassigned game', () => {
      beforeEach(() => {
        mockSelectors({ isOpen: true });
      });

      describe('default match official render', () => {
        it('does render', () => {
          renderComponent();
          expect(screen.getByText('Assign match official')).toBeInTheDocument();
          expect(
            screen.getByText(
              'Game: KL Galaxy vs KL Toronto - Mar 10 2025, 12:25 pm'
            )
          ).toBeInTheDocument();

          expect(screen.getByText('Save')).toBeInTheDocument();
        });

        it('allows the user to assign match officials', async () => {
          const user = userEvent.setup();
          renderComponent();
          selectEvent.openMenu(screen.getByRole('textbox'));

          await selectEvent.select(
            screen.getByRole('textbox'),
            'Michael Hackart'
          );

          await user.click(screen.getByText('Save'));

          await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
              payload: {
                status: 'SUCCESS',
                title: 'The match official assignment was successful.',
              },
              type: 'toasts/add',
            });
          });
        });

        it('fails to assign the user if the api fails', async () => {
          server.use(
            rest.put(
              '/planning_hub/events/:event_id/game_officials/bulk_save',
              (req, res, ctx) => res(ctx.status(500))
            )
          );
          const user = userEvent.setup();
          renderComponent();
          selectEvent.openMenu(screen.getByRole('textbox'));

          await selectEvent.select(
            screen.getByRole('textbox'),
            'Michael Hackart'
          );

          await user.click(screen.getByText('Save'));

          await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
              payload: {
                status: 'ERROR',
                title: 'The match official failed to save. Please try again.',
              },
              type: 'toasts/add',
            });
          });
        });
      });

      describe('default match monitor render', () => {
        it('does render', () => {
          renderComponent({ reportType: fixtureReports.matchMonitorReport });
          expect(screen.getByText('Assign match monitor')).toBeInTheDocument();
          expect(
            screen.getByText(
              'Game: KL Galaxy vs KL Toronto - Mar 10 2025, 12:25 pm'
            )
          ).toBeInTheDocument();

          expect(screen.getByText('Save')).toBeInTheDocument();
        });

        it('allows the user to assign match monitors', async () => {
          const user = userEvent.setup();
          renderComponent({ reportType: fixtureReports.matchMonitorReport });
          await user.click(screen.getByLabelText('Match monitor'));
          await user.click(screen.getByText('Michael Hackart'));
          await user.click(screen.getByText('Save'));

          await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
              payload: {
                status: 'SUCCESS',
                title: 'The match monitor assignment was successful.',
              },
              type: 'toasts/add',
            });
          });
        });

        it('fails to assign the monitor if the api fails', async () => {
          server.use(
            rest.post(
              '/planning_hub/events/:event_id/game_match_monitors',
              (req, res, ctx) => res(ctx.status(500))
            )
          );
          const user = userEvent.setup();
          renderComponent({ reportType: fixtureReports.matchMonitorReport });
          await user.click(screen.getByLabelText('Match monitor'));
          await user.click(screen.getByText('Michael Hackart'));
          await user.click(screen.getByText('Save'));

          await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({
              payload: {
                status: 'ERROR',
                title: 'The match monitor failed to save. Please try again.',
              },
              type: 'toasts/add',
            });
          });
        });
      });
    });

    describe('assigned game', () => {
      beforeEach(() => {
        mockSelectors({
          isOpen: true,
          game: {
            ...mockGame,
            event_users: [
              { id: 1, user: mockOfficials[0] },
              { id: 2, user: mockOfficials[1] },
            ],
            match_monitors: mockOfficials,
          },
        });
      });

      it('does render the match official panel with prepopulated event users', async () => {
        server.use(
          rest.get(
            `/planning_hub/events/:event_id/game_officials`,
            (req, res, ctx) => {
              return res(ctx.json(mockGameOfficials));
            }
          )
        );
        renderComponent();
        await waitFor(() =>
          expect(
            screen.getByText('Michael Hackart, Michael Yao')
          ).toBeInTheDocument()
        );
      });

      it('does render the match monitor panel with prepopulated match monitors', async () => {
        renderComponent({ reportType: fixtureReports.matchMonitorReport });
        await waitFor(() =>
          expect(screen.getByText('Michael Hackart')).toBeInTheDocument()
        );
        expect(screen.getByText('Michael Yao')).toBeInTheDocument();
      });
    });
  });
});
