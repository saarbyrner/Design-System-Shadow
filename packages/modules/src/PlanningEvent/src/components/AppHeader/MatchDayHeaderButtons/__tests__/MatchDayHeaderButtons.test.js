import { screen } from '@testing-library/react';
import * as redux from 'react-redux';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import userEvent from '@testing-library/user-event';
import { mailingList } from '@kitman/modules/src/Contacts/shared/constants';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  REDUCER_KEY as MATCH_DAY_EMAIL_SLICE,
  initialState,
} from '@kitman/modules/src/PlanningEvent/src/redux/slices/matchDayEmailSlice';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import { getMatchDayView } from '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors';

import MatchDayHeaderButtons from '..';

jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/PlanningEvent/src/redux/selectors/planningEventSelectors'
    ),
    getMatchDayView: jest.fn(),
  })
);

jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

const defaultStore = {
  [MATCH_DAY_EMAIL_SLICE]: initialState,
};

describe('Match Day Header Buttons', () => {
  const defaultProps = {
    isLeague: false,
    t: i18nextTranslateStub(),
  };

  const renderComponent = ({
    props = defaultProps,
    leaguePermissions = { viewGameTeam: true, viewGameInformation: true },
    leaguePreferences = {
      league_game_team: true,
      league_game_information: true,
      league_game_team_notifications: true,
      league_game_communications: true,
    },
    matchDayView = mailingList.Dmn,
  }) => {
    getMatchDayView.mockReturnValue(() => matchDayView);

    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: leaguePermissions,
      },
    });
    usePreferences.mockReturnValue({
      preferences: leaguePreferences,
    });

    renderWithRedux(<MatchDayHeaderButtons {...props} />, {
      preloadedState: defaultStore,
    });
  };

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  it('renders the match day buttons correctly', () => {
    renderComponent({});

    expect(screen.getByRole('button', { name: 'DMN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'DMR' })).toBeInTheDocument();
  });

  it(`calls setView with "${mailingList.Dmr}"`, async () => {
    const user = userEvent.setup();
    renderComponent({
      matchDayView: mailingList.Dmr,
    });
    await user.click(screen.getByRole('button', { name: 'DMN' }));
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: 'dmn',
      type: 'gameEvent/toggleMatchDayView',
    });
  });

  it(`calls setView with "${mailingList.Dmn}"`, async () => {
    const user = userEvent.setup();
    renderComponent({});
    await user.click(screen.getByRole('button', { name: 'DMR' }));
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: 'dmr',
      type: 'gameEvent/toggleMatchDayView',
    });
  });

  const emailButtonTestCases = [
    {
      isLeague: true,
      manageGameInformation: true,
      manageGameTeam: false,
      leagueGameTeamNotifications: true,
      leagueGameCommunications: false,
      isButtonVisible: true,
    },
    {
      isLeague: false,
      manageGameInformation: false,
      manageGameTeam: true,
      leagueGameTeamNotifications: false,
      leagueGameCommunications: true,
      isButtonVisible: true,
    },

    {
      isLeague: false,
      manageGameInformation: false,
      manageGameTeam: true,
      leagueGameTeamNotifications: false,
      leagueGameCommunications: false,
      isButtonVisible: false,
    },
  ];
  it.each(emailButtonTestCases)(
    'renders the email button',
    ({
      isLeague,
      manageGameInformation,
      manageGameTeam,
      leagueGameTeamNotifications,
      leagueGameCommunications,
      isButtonVisible,
    }) => {
      renderComponent({
        props: { ...defaultProps, isLeague },
        leaguePermissions: { manageGameInformation, manageGameTeam },
        leaguePreferences: {
          league_game_team_notifications: leagueGameTeamNotifications,
          league_game_communications: leagueGameCommunications,
        },
      });

      expect(screen.queryAllByRole('button', { name: 'Email' })).toHaveLength(
        isButtonVisible ? 1 : 0
      );
    }
  );

  it('renders the team button, when isLeague is false', () => {
    renderComponent({});
    expect(screen.getByRole('button', { name: 'Team' })).toBeInTheDocument();
  });

  it('does not render the team button, when isLeague is true', () => {
    renderComponent({
      props: { ...defaultProps, isLeague: true },
    });
    expect(
      screen.queryByRole('button', { name: 'Team' })
    ).not.toBeInTheDocument();
  });

  it('renders the team button, when isLeague is false and useModernRoster is true', () => {
    renderComponent({
      leaguePreferences: {
        league_game_communications: true,
      },
    });
    expect(screen.getByRole('button', { name: 'Team' })).toBeInTheDocument();
  });

  it('renders the team button, when isLeague is false and useClassicRoster is true', () => {
    renderComponent({
      leaguePreferences: {
        league_game_team_notifications: true,
      },
    });
    expect(screen.getByRole('button', { name: 'Team' })).toBeInTheDocument();
  });

  it('does not render the team button, when isLeague is false and useModernRoster and useClassicRoster are false', () => {
    renderComponent({
      leaguePreferences: {
        league_game_team_notifications: false,
        league_game_communications: false,
      },
    });
    expect(
      screen.queryByRole('button', { name: 'Team' })
    ).not.toBeInTheDocument();
  });
});
