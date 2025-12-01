import { screen, within } from '@testing-library/react';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getUnregisteredPlayers } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import matchInformationMock from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/data/match_information';
import matchReportMock from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/data/match_monitor_report';

import UnregisteredPlayersTable from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors'
    ),
    getUnregisteredPlayers: jest.fn(),
  })
);

const props = {
  t: i18nextTranslateStub(),
  matchInformation: matchInformationMock,
};

describe('<UnregisteredPlayersTable />', () => {
  describe('Table renders', () => {
    beforeEach(() => {
      getUnregisteredPlayers.mockReturnValue([]);
    });
    it('displays the table headers', () => {
      renderWithProviders(<UnregisteredPlayersTable {...props} />);
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('DOB')).toBeInTheDocument();
      expect(screen.getByText('Club')).toBeInTheDocument();
      expect(screen.getByText('Registration')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
    });
  });
  describe('No unregistered players added', () => {
    beforeEach(() => {
      getUnregisteredPlayers.mockReturnValue([]);
    });
    it('displays the empty state message', () => {
      renderWithProviders(<UnregisteredPlayersTable {...props} />);
      expect(
        screen.getByText(
          'Click add new player button (above) to add players who are not in the squad.'
        )
      ).toBeInTheDocument();
    });
  });
  describe('Unregistered players have been added', () => {
    beforeEach(() => {
      getUnregisteredPlayers.mockReturnValue(
        matchReportMock.game_monitor_report_unregistered_athletes
      );
    });
    it('displays the players', () => {
      renderWithProviders(<UnregisteredPlayersTable {...props} />);
      expect(screen.getByText('Luke Shaw')).toBeInTheDocument();
      expect(screen.getByText('26/02/1994')).toBeInTheDocument();
      expect(screen.getAllByText('Manchester United').length).toBeGreaterThan(
        0
      );
      expect(screen.getByText('Registered')).toBeInTheDocument();
      expect(screen.getByText('free text')).toBeInTheDocument();
    });

    it('displays the players sorted by surname', () => {
      renderWithProviders(<UnregisteredPlayersTable {...props} />);

      // removing first row as it's header
      const rows = screen.getAllByRole('row').slice(1);

      expect(within(rows[0]).getByText('John Doe')).toBeInTheDocument();
      expect(within(rows[1]).getByText('Luke Shaw')).toBeInTheDocument();
    });
  });
});
