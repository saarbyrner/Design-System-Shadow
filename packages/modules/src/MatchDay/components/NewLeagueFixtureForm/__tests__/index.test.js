import { screen, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as clubsApi from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import * as officialsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import * as tvChannelsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi';
import * as competitionsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi';
import * as notificationsRecipientsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/notificationsRecipientsApi';
import * as eventLocationsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/eventLocationsApi';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { getTranslations } from '@kitman/modules/src/MatchDay/shared/utils';
import { defaultFixtureFormState } from '@kitman/modules/src/MatchDay/shared/constants';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import NewLeagueFixtureForm from '..';

jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('NewLeagueFixtureForm', () => {
  let onChange;
  let useDispatchSpy;
  let mockDispatch;
  const user = userEvent.setup();
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);
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
  ];
  const mockLocations = [
    { value: 1, label: 'Venue X' },
    { value: 2, label: 'Venue Y' },
  ];
  const mockTvChannels = [{ value: 401, label: 'Channel A' }];
  const mockNotificationsRecipients = [{ value: 1, label: 'Jane Doe' }];
  const setForm = jest.fn();

  const renderComponent = (props = {}, customPreferences = {}) => {
    const defaultPreferences = {
      league_game_officials: true,
      league_game_match_director: true,
      league_game_tv: true,
      league_game_game_time: true,
      league_game_match_id: true,
      league_game_notification_recipient: false,
      league_game_hide_club_game: false,
    };
    const preferences = { ...defaultPreferences, ...customPreferences };
    usePreferences.mockReturnValue({ preferences });

    return renderWithRedux(
      <LocalizationProvider>
        <NewLeagueFixtureForm
          onChange={onChange}
          form={defaultFixtureFormState}
          {...props}
          setForm={setForm}
        />
      </LocalizationProvider>
    );
  };

  const selectAutocompleteOption = async (inputLabel, optionLabel) => {
    await user.click(screen.getByLabelText(inputLabel));
    await user.click(screen.getByRole('option', { name: optionLabel }));
  };

  beforeEach(() => {
    onChange = jest.fn();
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
    jest.spyOn(eventLocationsApi, 'useGetEventLocationsQuery').mockReturnValue({
      data: mockLocations,
    });
    jest
      .spyOn(notificationsRecipientsApi, 'useGetNotificationsRecipientsQuery')
      .mockReturnValue({
        data: mockNotificationsRecipients,
      });

    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderComponent({ t });
    expect(screen.getByLabelText('Match #')).toBeInTheDocument();
    expect(screen.getByLabelText('Competition')).toBeInTheDocument();
    expect(screen.getByLabelText('Match Day')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Kick Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
    expect(screen.getByLabelText('Home Team')).toBeInTheDocument();
    expect(screen.getByLabelText('Away Team')).toBeInTheDocument();
    expect(screen.getByLabelText('Home Squad')).toBeInTheDocument();
    expect(screen.getByLabelText('Away Squad')).toBeInTheDocument();
    expect(screen.getByLabelText('TV (optional)')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Match Director (optional)')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Referee')).toBeInTheDocument();
    expect(screen.getByLabelText('AR1')).toBeInTheDocument();
    expect(screen.getByLabelText('AR2')).toBeInTheDocument();
    expect(screen.getByLabelText('4th Official')).toBeInTheDocument();
    expect(screen.getByLabelText('VAR')).toBeInTheDocument();
    expect(screen.getByLabelText('AVAR')).toBeInTheDocument();
    expect(screen.getAllByText('Optional').length).toEqual(10);
  });

  it('calls the get squads endpoints for the home and away teams when the form already has the teams preset when opened (EDIT mode)', async () => {
    renderComponent({
      t,
      form: { homeTeam: 122, awayTeam: 123, homeSquad: 201, awaySquad: 202 },
    });
    await waitFor(() =>
      expect(screen.getByDisplayValue('Squad A1')).toBeInTheDocument()
    );
    expect(screen.getByDisplayValue('Squad B1')).toBeInTheDocument();
  });

  it('shows duplicated officials alert', async () => {
    renderComponent({
      t,
      form: { ...defaultFixtureFormState, referee: 1, var: 1 },
    });
    await selectAutocompleteOption('Referee', mockOfficials[0].label);
    await selectAutocompleteOption('AR1', mockOfficials[0].label);
    expect(
      screen.getByText(textEnum.duplicateOfficialsErrorText)
    ).toBeInTheDocument();
  });

  it('shows duplicated teams alert', async () => {
    renderComponent({ t, hasDuplicateTeams: true });
    expect(
      screen.getByText('Please select different teams')
    ).toBeInTheDocument();
  });

  it('calls onChange props when updating the form fields', async () => {
    renderComponent({ t });
    await selectAutocompleteOption('Competition', mockCompetitions[0].label);
    expect(setForm).toHaveBeenCalled();
  });

  it('calls onChange props when updating the home team', async () => {
    renderComponent({ t });
    await selectAutocompleteOption('Home Team', mockClubs[0].label);
    expect(setForm).toHaveBeenCalledWith({
      ...defaultFixtureFormState,
      homeTeam: 101,
    });
    expect(setForm).toHaveBeenCalledWith({
      ...defaultFixtureFormState,
      homeTeam: 101,
      homeSquad: 201,
    });
  });

  it('calls onChange props when updating the away team', async () => {
    renderComponent({ t });
    await selectAutocompleteOption('Away Team', mockClubs[0].label);
    expect(setForm).toHaveBeenCalledWith({
      ...defaultFixtureFormState,
      awayTeam: 101,
    });
    expect(setForm).toHaveBeenCalledWith({
      ...defaultFixtureFormState,
      awayTeam: 101,
      awaySquad: 201,
    });
  });

  it('dispatches an error when the squad endpoint fails when a team is selected', async () => {
    jest
      .spyOn(clubsApi, 'useLazyGetClubSquadsQuery')
      .mockReturnValue([jest.fn().mockRejectedValue('oh no')]);
    renderComponent({ t });
    await selectAutocompleteOption('Away Team', mockClubs[0].label);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { status: 'ERROR', title: 'Squad fetch failed.' },
      type: 'toasts/add',
    });
  });

  describe('NewLeagueFixtureForm with different preferences', () => {
    it('showing league_game_officials', () => {
      renderComponent(
        { t },
        {
          league_game_officials: true,
          league_game_match_director: false,
          league_game_tv: false,
          league_game_game_time: false,
          league_game_match_id: false,
        }
      );
      expect(screen.getByLabelText('Competition')).toBeInTheDocument();
      expect(screen.getByLabelText('Date and time')).toBeInTheDocument();
      expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Squad')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Squad')).toBeInTheDocument();
      expect(screen.getByLabelText('Referee')).toBeInTheDocument();
      expect(screen.getByLabelText('AR1')).toBeInTheDocument();
      expect(screen.getByLabelText('AR2')).toBeInTheDocument();
      expect(screen.getByLabelText('4th Official')).toBeInTheDocument();
      expect(screen.getByLabelText('VAR')).toBeInTheDocument();
      expect(screen.getByLabelText('AVAR')).toBeInTheDocument();
      expect(screen.getAllByText('Optional').length).toEqual(8);
    });

    it('showing league_game_match_director', () => {
      renderComponent(
        { t },
        {
          league_game_officials: false,
          league_game_match_director: true,
          league_game_tv: false,
          league_game_game_time: false,
          league_game_match_id: false,
        }
      );

      expect(
        screen.getByLabelText('Match Director (optional)')
      ).toBeInTheDocument();

      expect(screen.getByLabelText('Competition')).toBeInTheDocument();
      expect(screen.getByLabelText('Match Day')).toBeInTheDocument();
      expect(screen.getByLabelText('Date and time')).toBeInTheDocument();
      expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Squad')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Squad')).toBeInTheDocument();

      expect(screen.queryByText('TV (optional)')).not.toBeInTheDocument();
      expect(screen.queryByText('Referee')).not.toBeInTheDocument();
      expect(screen.queryByText('AR1')).not.toBeInTheDocument();
      expect(screen.queryByText('AR2')).not.toBeInTheDocument();
      expect(screen.queryByText('4th Official')).not.toBeInTheDocument();
      expect(screen.queryByText('VAR')).not.toBeInTheDocument();
      expect(screen.queryByText('AVAR')).not.toBeInTheDocument();
      expect(screen.getAllByText('Optional').length).toEqual(3);
    });

    it('showing league_game_tv', () => {
      renderComponent(
        { t },
        {
          league_game_officials: false,
          league_game_match_director: false,
          league_game_tv: true,
          league_game_game_time: false,
          league_game_match_id: false,
        }
      );

      expect(screen.getByLabelText('TV (optional)')).toBeInTheDocument();

      expect(screen.getAllByText('Optional').length).toEqual(3);

      expect(screen.getByLabelText('Competition')).toBeInTheDocument();
      expect(screen.getByLabelText('Match Day')).toBeInTheDocument();
      expect(screen.getByLabelText('Date and time')).toBeInTheDocument();
      expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Squad')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Squad')).toBeInTheDocument();

      expect(screen.queryByText('Match #')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Match Director (optional)')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Referee')).not.toBeInTheDocument();
      expect(screen.queryByText('AR1')).not.toBeInTheDocument();
      expect(screen.queryByText('AR2')).not.toBeInTheDocument();
      expect(screen.queryByText('4th Official')).not.toBeInTheDocument();
      expect(screen.queryByText('VAR')).not.toBeInTheDocument();
      expect(screen.queryByText('AVAR')).not.toBeInTheDocument();
    });

    it('show league_game_game_time', () => {
      renderComponent(
        { t },
        {
          league_game_officials: false,
          league_game_match_director: false,
          league_game_tv: false,
          league_game_game_time: true,
          league_game_match_id: false,
        }
      );

      expect(screen.getByLabelText('Date')).toBeInTheDocument();
      expect(screen.getByLabelText('Kick Time')).toBeInTheDocument();
      expect(screen.getByLabelText('Timezone')).toBeInTheDocument();

      expect(screen.getByLabelText('Competition')).toBeInTheDocument();
      expect(screen.getByLabelText('Match Day')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Squad')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Squad')).toBeInTheDocument();

      expect(screen.queryByText('TV (optional)')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Match Director (optional)')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Referee')).not.toBeInTheDocument();
      expect(screen.queryByText('AR1')).not.toBeInTheDocument();
      expect(screen.queryByText('AR2')).not.toBeInTheDocument();
      expect(screen.queryByText('4th Official')).not.toBeInTheDocument();
      expect(screen.queryByText('VAR')).not.toBeInTheDocument();
      expect(screen.queryByText('AVAR')).not.toBeInTheDocument();

      expect(screen.getAllByText('Optional').length).toEqual(2);
    });

    it('showing league_game_match_id', () => {
      renderComponent(
        { t },
        {
          league_game_officials: false,
          league_game_match_director: false,
          league_game_tv: false,
          league_game_game_time: false,
          league_game_match_id: true,
        }
      );

      expect(screen.getByLabelText('Match #')).toBeInTheDocument();
      expect(screen.getByLabelText('Competition')).toBeInTheDocument();
      expect(screen.getByLabelText('Match Day')).toBeInTheDocument();
      expect(screen.getByLabelText('Date and time')).toBeInTheDocument();
      expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Squad')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Squad')).toBeInTheDocument();

      expect(screen.getAllByText('Optional').length).toEqual(2);
    });

    it('showing league_game_notification_recipient', async () => {
      renderComponent(
        { t },
        {
          league_game_officials: false,
          league_game_match_director: false,
          league_game_tv: false,
          league_game_game_time: false,
          league_game_match_id: false,
          league_game_notification_recipient: true,
        }
      );

      expect(
        screen.getByLabelText('Notifications recipient')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Competition')).toBeInTheDocument();
      expect(screen.getByLabelText('Match Day')).toBeInTheDocument();
      expect(screen.getByLabelText('Date and time')).toBeInTheDocument();
      expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Team')).toBeInTheDocument();
      expect(screen.getByLabelText('Home Squad')).toBeInTheDocument();
      expect(screen.getByLabelText('Away Squad')).toBeInTheDocument();

      expect(screen.getAllByText('Optional').length).toEqual(3);

      await user.click(screen.getByLabelText('Notifications recipient'));
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  it('showing league_game_hide_club_game', async () => {
    renderComponent(
      { t },
      {
        league_game_officials: false,
        league_game_match_director: false,
        league_game_tv: false,
        league_game_game_time: false,
        league_game_match_id: false,
        league_game_notification_recipient: false,
        league_game_hide_club_game: true,
      }
    );

    expect(
      screen.getByLabelText(
        "Hide from club view (if checked game won't show on club schedule)"
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Competition')).toBeInTheDocument();
    expect(screen.getByLabelText('Match Day')).toBeInTheDocument();
    expect(screen.getByLabelText('Date and time')).toBeInTheDocument();
    expect(screen.getByLabelText('Timezone')).toBeInTheDocument();
    expect(screen.getByLabelText('Home Team')).toBeInTheDocument();
    expect(screen.getByLabelText('Away Team')).toBeInTheDocument();
    expect(screen.getByLabelText('Home Squad')).toBeInTheDocument();
    expect(screen.getByLabelText('Away Squad')).toBeInTheDocument();

    expect(screen.getAllByText('Optional').length).toEqual(2);
  });

  it('Prepopulates the location field if the event location is set', () => {
    renderComponent({
      t,
      form: { location: 1 },
      event: { event_location: { name: 'Venue X', id: 1 } },
    });
    expect(screen.getByLabelText('Search venue')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Venue X')).toBeInTheDocument();
  });
});
