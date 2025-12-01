import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as redux from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as clubsApi from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import * as officialsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import * as tvChannelsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi';
import * as competitionsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { getTranslations } from '@kitman/modules/src/MatchDay/shared/utils';
import { getOrganisation } from '@kitman/common/src/redux/global/selectors';
import createLeagueFixture from '@kitman/services/src/services/planning/createLeagueFixture';
import { axios } from '@kitman/common/src/utils/services';
import leagueFixtureMock from '@kitman/services/src/services/planning/createLeagueFixture/mock';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import NewLeagueFixtureDrawer from '..';

jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getOrganisation: jest.fn(),
}));

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/modules/src/MatchDay/shared/constants', () => ({
  ...jest.requireActual('@kitman/modules/src/MatchDay/shared/constants'),
  defaultFixtureFormState: {
    matchId: '123456',
    round: '1',
    timezone: '',
    homeTeam: 101,
    awayTeam: 102,
    homeSquad: 201,
    awaySquad: 202,
    location: 123,
    tvChannelIds: [401],
    tvContactIds: [],
    referee: 1,
    assistant_referee_1: 2,
    assistant_referee_2: 3,
    fourth_referee: 4,
    var: 5,
    avar: 6,
    matchDirectorId: 342,
  },
}));
jest.mock('@kitman/services/src/services/planning/createLeagueFixture');

describe('NewLeagueFixtureDrawer', () => {
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);
  const mockDispatch = jest.fn();
  const onClose = jest.fn();
  const onSubmitSuccess = jest.fn();
  let useDispatchSpy;
  const mockCompetitions = [{ value: 1, label: 'Premier League' }];
  const mockClubs = [
    { value: 101, label: 'Club A' },
    { value: 102, label: 'Club B' },
  ];
  const mockHomeSquads = [{ value: 201, label: 'Squad A1' }];
  const mockAwaySquads = [{ value: 202, label: 'Squad B1' }];
  const mockOfficials = [
    {
      value: 1,
      label: 'Mark Evans',
    },
    {
      value: 2,
      label: 'Sophia Clarke',
    },
    {
      value: 3,
      label: 'David Brooks',
    },
    {
      value: 4,
      label: 'Emily Harper',
    },
    {
      value: 5,
      label: 'Liam Turner',
    },
    {
      value: 6,
      label: 'Olivia Wright',
    },
    {
      value: 7,
      label: 'John Doe',
    },
  ];
  const mockTvChannels = [{ value: 401, label: 'Channel A' }];

  getOrganisation.mockReturnValue(() => ({
    id: '1',
    name: 'Test Organisation',
    country: 'Test Country',
    locale: 'en-gb',
    timezone: 'Europe/London',
  }));
  const defaultPreferences = {
    league_game_officials: true,
    league_game_match_director: true,
    league_game_tv: true,
    league_game_game_time: true,
    league_game_match_id: true,
    league_game_notification_recipient: false,
    enable_reserve_ar: true,
  };
  const renderComponent = (props = {}, customPreferences = {}) => {
    const preferences = { ...defaultPreferences, ...customPreferences };

    usePreferences.mockReturnValue({ preferences });

    return renderWithRedux(
      <LocalizationProvider>
        <NewLeagueFixtureDrawer
          onClose={onClose}
          onSubmitSuccess={onSubmitSuccess}
          {...props}
        />
      </LocalizationProvider>
    );
  };

  const selectAutocompleteOption = async (user, inputLabel, optionLabel) => {
    await user.click(screen.getByLabelText(inputLabel));
    await user.click(screen.getByText(optionLabel));
  };

  const setDate = async (user, gameTimePreference) => {
    await user.click(
      gameTimePreference
        ? screen.getByLabelText('Date')
        : screen.getByLabelText('Date and time')
    );
    await user.type(screen.getAllByRole('textbox')[0], '11/01/2024 10:15 am');
  };

  const setKickTime = async (user) => {
    await user.click(screen.getByTestId('ClockIcon'));
    await user.click(screen.getByLabelText('10 hours'));
    await user.click(screen.getByLabelText('30 minutes'));
  };

  const setMatchId = async (user) => {
    const matchIdInput = screen.getByLabelText('Match #');
    await user.click(matchIdInput);
    fireEvent.change(matchIdInput, { target: { value: '123456' } });
  };

  const fillForm = async (user, preferences = defaultPreferences) => {
    if (
      Object.keys(preferences).length === 0 ||
      preferences?.league_game_match_id
    ) {
      await setMatchId(user);
    }
    await selectAutocompleteOption(
      user,
      'Competition',
      mockCompetitions[0].label
    );

    const gameTimePreference =
      Object.keys(preferences).length === 0 ||
      preferences?.league_game_game_time;
    await setDate(user, gameTimePreference);
    if (gameTimePreference) {
      await setKickTime(user);
    }
  };

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatch);

    jest.spyOn(competitionsApi, 'useGetCompetitionsQuery').mockReturnValue({
      data: mockCompetitions,
    });
    jest.spyOn(clubsApi, 'useGetClubsQuery').mockReturnValue({
      data: mockClubs,
    });
    jest.spyOn(clubsApi, 'useLazyGetClubSquadsQuery').mockReturnValue([
      jest.fn().mockResolvedValue({
        data: [mockHomeSquads[0], mockAwaySquads[0]],
      }),
    ]);
    jest.spyOn(officialsApi, 'useGetOfficialUsersQuery').mockReturnValue({
      data: mockOfficials,
    });
    jest.spyOn(tvChannelsApi, 'useGetTvChannelsQuery').mockReturnValue({
      data: mockTvChannels,
    });
  });

  it('renders correctly', () => {
    renderComponent({ t, isOpen: true });
    expect(screen.getByText('Create Fixture')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('navigates back when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({ t, isOpen: true });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('disables Save button if form is invalid', () => {
    renderComponent({ t, isOpen: true });
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('enables Save button when form is valid', async () => {
    const user = userEvent.setup();
    renderComponent({ t, isOpen: true });
    await fillForm(user);
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('kick time validation works correctly', async () => {
    const user = userEvent.setup();
    renderComponent({ t, isOpen: true });

    const kickTimeField = screen.getByTestId('fixture-kick-time-input');
    const dateTimeField = screen.getByTestId('fixture-date-time-input');
    await user.type(dateTimeField, '11/04/2025 02:00 PM');

    await user.type(kickTimeField, '01:00 PM');
    await waitFor(() => {
      expect(kickTimeField).toHaveAttribute('aria-invalid', 'true');
    });

    await user.type(kickTimeField, '03:00 PM');
    await waitFor(() => {
      expect(kickTimeField).toHaveAttribute('aria-invalid', 'false');
    });
  });

  it('shows success toast and closes side panel on successful fixture creation', async () => {
    const user = userEvent.setup();
    createLeagueFixture.mockResolvedValueOnce({
      event: {
        ...leagueFixtureMock.event,
        id: 3855163,
      },
    });

    renderComponent({ t, isOpen: true });

    await fillForm(user);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(createLeagueFixture.mock.calls[0][0]).toEqual({
      assistant_referee_1: 2,
      assistant_referee_2: 3,
      avar: 6,
      awaySquad: 202,
      awayTeam: 102,
      competition: 1,
      date: '2024-11-01T01:15:00Z',
      fourth_referee: 4,
      homeSquad: 201,
      homeTeam: 101,
      kickTime: '2024-11-01T10:30:00Z',
      location: 123,
      matchDirectorId: 342,
      matchId: '123456',
      referee: 1,
      round: '1',
      timezone: 'Europe/London',
      tvChannelIds: [401],
      tvContactIds: [],
      var: 5,
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'SUCCESS',
        title: textEnum.createLeagueFixtureSuccess,
        links: [
          {
            id: 3855163,
            link: '/planning_hub/events/3855163',
            text: 'View fixture',
          },
        ],
      },
      type: 'toasts/add',
    });

    expect(onClose).toHaveBeenCalled();
    expect(onSubmitSuccess).toHaveBeenCalled();
  });

  it('shows error toast on failed fixture creation', async () => {
    const user = userEvent.setup();
    createLeagueFixture.mockImplementation(() => {
      throw new Error();
    });
    renderComponent({ t, isOpen: true });
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'ERROR',
        title: textEnum.createLeagueFixtureError,
      },
      type: 'toasts/add',
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(onSubmitSuccess).not.toHaveBeenCalled();
  });

  it('successfully edit a fixture', async () => {
    const user = userEvent.setup();
    const updateGameInformation = jest.spyOn(axios, 'patch');

    renderComponent({
      t,
      isOpen: true,
      event: {
        ...leagueFixtureMock.event,
        mls_game_key: 123,
      },
    });

    await selectAutocompleteOption(
      user,
      'Match Director (optional)',
      'Conor Hoeger'
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateGameInformation).toHaveBeenCalledWith(
      `/planning_hub/league_games/${leagueFixtureMock.event.id}`,
      {
        away_organisation_id: 1267,
        away_squad_id: 7535,
        competition_id: 1971,
        event_location_id: null,
        game_officials: [
          { official_id: 267317, role: 'referee' },
          { official_id: 161703, role: 'assistant_referee_1' },
          { official_id: 181938, role: 'assistant_referee_2' },
          { official_id: 183048, role: 'fourth_referee' },
          { official_id: 161704, role: 'reserve_ar' },
          { official_id: 152182, role: 'var' },
          { official_id: 267316, role: 'avar' },
        ],
        game_time: '2024-11-04T19:00:00Z',
        home_organisation_id: 1268,
        home_squad_id: 3496,
        local_timezone: 'Europe/London',
        provider_external_id: 123,
        round_number: 234,
        start_time: '2024-11-04T20:00:00Z',
        tv_channel_ids: [1],
        tv_game_contacts_ids: [12],
        match_director_id: 181475,
      }
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'SUCCESS',
        title: textEnum.updateLeagueFixtureSuccess,
        links: [
          {
            id: 3855163,
            link: `/planning_hub/events/${leagueFixtureMock.event.id}`,
            text: 'View fixture',
          },
        ],
      },
      type: 'toasts/add',
    });

    expect(onClose).toHaveBeenCalled();
    expect(onSubmitSuccess).toHaveBeenCalled();
  });

  it('fails to edit a fixture', async () => {
    const user = userEvent.setup();
    jest.spyOn(axios, 'patch').mockImplementation(() => {
      throw new Error();
    });
    renderComponent({
      t,
      isOpen: true,
      event: {
        ...leagueFixtureMock.event,
        mls_game_key: 123,
      },
    });
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'ERROR',
        title: textEnum.updateLeagueFixtureError,
      },
      type: 'toasts/add',
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(onSubmitSuccess).not.toHaveBeenCalled();
  });

  it('hide fields if preferences is off on fixture creation', async () => {
    const user = userEvent.setup();
    createLeagueFixture.mockResolvedValueOnce({
      event: {
        ...leagueFixtureMock.event,
        id: 3855163,
      },
    });

    const preferences = {
      league_game_officials: false,
      league_game_match_director: false,
      league_game_tv: false,
      league_game_game_time: false,
      league_game_match_id: false,
      league_game_notification_recipient: false,
      league_game_hide_club_game: false,
      enable_reserve_ar: false,
    };

    renderComponent({ t, isOpen: true }, preferences);

    await user.click(screen.getByLabelText('Timezone'));
    await user.click(screen.getByText('US/Alaska'));

    await fillForm(user, preferences);

    expect(screen.getByLabelText('Date and time')).toBeInTheDocument();
    expect(screen.queryByText('Kick Time')).not.toBeInTheDocument();
    expect(screen.queryByText('Match #')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Match Director (optional)')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('TV (optional)')).not.toBeInTheDocument();
    expect(screen.queryByText('TV users')).not.toBeInTheDocument();
    expect(screen.queryByText('Referee')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Notifications recipient')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Reserve AR')).not.toBeInTheDocument();
  });

  it('show notification receipients field if preferences is ON on fixture creation', async () => {
    const user = userEvent.setup();
    createLeagueFixture.mockResolvedValueOnce({
      event: {
        ...leagueFixtureMock.event,
        id: 3855163,
      },
    });

    const preferences = {
      league_game_officials: false,
      league_game_match_director: false,
      league_game_tv: false,
      league_game_game_time: false,
      league_game_match_id: false,
      league_game_notification_recipient: true,
    };

    renderComponent({ t, isOpen: true }, preferences);

    await user.click(screen.getByLabelText('Timezone'));
    await user.click(screen.getByText('US/Alaska'));

    await fillForm(user, preferences);

    expect(
      screen.getByLabelText('Notifications recipient')
    ).toBeInTheDocument();
  });

  it('show hide club game field if preferences is ON on fixture creation', async () => {
    const user = userEvent.setup();
    createLeagueFixture.mockResolvedValueOnce({
      event: {
        ...leagueFixtureMock.event,
        id: 3855163,
      },
    });

    const preferences = {
      league_game_officials: false,
      league_game_match_director: false,
      league_game_tv: false,
      league_game_game_time: false,
      league_game_match_id: false,
      league_game_notification_recipient: false,
      league_game_hide_club_game: true,
    };

    renderComponent({ t, isOpen: true }, preferences);

    await user.click(screen.getByLabelText('Timezone'));
    await user.click(screen.getByText('US/Alaska'));

    await fillForm(user, preferences);

    expect(
      screen.getByLabelText(
        "Hide from club view (if checked game won't show on club schedule)"
      )
    ).toBeInTheDocument();
  });
});
