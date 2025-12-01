import { screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getRegisteredPlayers } from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import matchReportMock from '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/services/mocks/data/match_monitor_report';
import userEvent from '@testing-library/user-event';

import RegisteredPlayersTable from '..';

jest.mock(
  '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/selectors'
    ),
    getRegisteredPlayers: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/MatchMonitorApp/MatchMonitorReport/src/shared/redux/slices/matchMonitorSlice'
    ),
    onChangeRegisteredPlayer: jest.fn(),
  })
);

const props = {
  t: i18nextTranslateStub(),
  activeTeam: 'home',
};

describe('<RegisteredPlayersTable />', () => {
  describe('Table renders', () => {
    beforeEach(() => {
      getRegisteredPlayers.mockReturnValue([]);
    });
    it('displays the table headers', () => {
      renderWithProviders(<RegisteredPlayersTable {...props} />);
      expect(screen.getByText('Player')).toBeInTheDocument();
      expect(screen.getByText('Primary')).toBeInTheDocument();
      expect(screen.getByText('Compliant')).toBeInTheDocument();
    });
  });
  describe('No registered players added', () => {
    beforeEach(() => {
      getRegisteredPlayers.mockReturnValue([]);
    });
    it('displays the empty state message', () => {
      renderWithProviders(<RegisteredPlayersTable {...props} />);
      expect(
        screen.getByText(
          'Click add existing player button (above) to add players who are not in the squad.'
        )
      ).toBeInTheDocument();
    });
  });
  describe('Registered players have been added', () => {
    beforeEach(() => {
      getRegisteredPlayers.mockReturnValue(
        matchReportMock.game_monitor_report_athletes
      );
    });
    it('displays the players', () => {
      renderWithProviders(<RegisteredPlayersTable {...props} />);

      // removing first row as it's header
      const rows = screen.getAllByRole('row').slice(1);

      expect(within(rows[0]).getByText('John Doe')).toBeInTheDocument();
      expect(within(rows[0]).getByText('Some Squad')).toBeInTheDocument();
      const checkbox = within(rows[0]).getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });

    it('displays the players sorted by surname', () => {
      renderWithProviders(<RegisteredPlayersTable {...props} />);

      // removing first row as it's header
      const rows = screen.getAllByRole('row').slice(1);

      expect(within(rows[0]).getByText('John Doe')).toBeInTheDocument();
      expect(within(rows[1]).getByText('Mason Mount')).toBeInTheDocument();
    });
  });
  describe('Registered player removal', () => {
    it('triggers onDelete when delete button is pressed', async () => {
      const onDeleteMock = jest.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <RegisteredPlayersTable {...props} onDelete={onDeleteMock} />
      );

      await user.click(screen.getByTestId('delete-athlete-1'));

      expect(onDeleteMock).toHaveBeenCalledWith(1);
    });
  });
});
