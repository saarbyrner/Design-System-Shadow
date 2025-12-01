import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as redux from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getTranslations } from '@kitman/modules/src/MatchDay/shared/utils';
import moment from 'moment-timezone';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import mock from '@kitman/modules/src/MatchDay/shared/mock';
import { rest, server } from '@kitman/services/src/mocks/server';
import * as officialsApi from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';

import MatchOfficials from '..';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('MatchOfficials', () => {
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);

  const officialUsers = [
    {
      id: 1,
      fullname: 'Mark Evans',
    },
    {
      id: 2,
      fullname: 'Sophia Clarke',
    },
    {
      id: 3,
      fullname: 'David Brooks',
    },
    {
      id: 4,
      fullname: 'Emily Harper',
    },
    {
      id: 5,
      fullname: 'Liam Turner',
    },
    {
      id: 6,
      fullname: 'Olivia Wright',
    },
    {
      id: 7,
      fullname: 'John Doe',
    },
  ];

  const renderComponent = ({
    customEvent = mock.event,
    enableReserveAr = false,
  } = {}) => {
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          manageGameInformation: true,
        },
      },
    });
    usePreferences.mockReturnValue({
      preferences: {
        enable_reserve_ar: enableReserveAr,
      },
    });
    renderWithRedux(
      <LocalizationProvider>
        <MatchOfficials />
      </LocalizationProvider>,
      {
        preloadedState: {
          planningEventApi: {
            queries: [
              {
                endpointName: 'getPlanningEvent',
                data: {
                  event: customEvent,
                },
              },
            ],
          },
        },
      }
    );
  };

  let useDispatchSpy;
  let mockDispatch;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);

    moment.tz.setDefault('Europe/Dublin');
    useLeagueOperations.mockReturnValue({
      isLeague: true,
      isLeagueStaffUser: true,
    });
    jest.spyOn(officialsApi, 'useGetOfficialUsersQuery').mockReturnValue({
      data: officialUsers,
      isFetching: false,
    });

    jest.spyOn(officialsApi, 'useGetGameOfficialsQuery').mockReturnValue({
      data: mock.gameOfficials,
      isFetching: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    moment.tz.setDefault();
  });

  it('calls useGetOfficialUsersQuery with division ID when event has squad with division', () => {
    const eventWithDivision = {
      ...mock.event,
      squad: {
        ...mock.event.squad,
        division: [{ id: 123, name: 'KLS' }],
      },
    };

    renderComponent({ customEvent: eventWithDivision });

    expect(officialsApi.useGetOfficialUsersQuery).toHaveBeenCalledWith({
      divisionId: 123,
    });
  });

  it('calls useGetOfficialUsersQuery with undefined division ID when event has no division', () => {
    renderComponent();

    expect(officialsApi.useGetOfficialUsersQuery).toHaveBeenCalledWith({
      divisionId: undefined,
    });
  });

  it('renders correctly', () => {
    renderComponent({});

    expect(screen.getByText('Referee:')).toBeInTheDocument();
    expect(screen.getByText('Mark Evans')).toBeInTheDocument();

    expect(screen.getByText('AR1:')).toBeInTheDocument();
    expect(screen.getByText('Sophia Clarke')).toBeInTheDocument();

    expect(screen.getByText('AR2:')).toBeInTheDocument();
    expect(screen.getByText('David Brooks')).toBeInTheDocument();

    expect(screen.getByText('4th Official:')).toBeInTheDocument();
    expect(screen.getByText('Emily Harper')).toBeInTheDocument();

    expect(screen.getByText('VAR:')).toBeInTheDocument();
    expect(screen.getByText('Liam Turner')).toBeInTheDocument();

    expect(screen.getByText('AVAR:')).toBeInTheDocument();
    expect(screen.getByText('Olivia Wright')).toBeInTheDocument();

    expect(screen.queryByText('Reserve AR:')).not.toBeInTheDocument();
  });

  it('shows the edit view when Edit button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({ enableReserveAr: true });

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByLabelText('Referee')).toBeInTheDocument();
    expect(screen.getByLabelText('AR1')).toBeInTheDocument();
    expect(screen.getByLabelText('AR2')).toBeInTheDocument();
    expect(screen.getByLabelText('4th Official')).toBeInTheDocument();
    expect(screen.getByLabelText('VAR')).toBeInTheDocument();
    expect(screen.getByLabelText('AVAR')).toBeInTheDocument();
    expect(screen.getByLabelText('Reserve AR')).toBeInTheDocument();
  });

  it('toggles back to view mode when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({});

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Referee:')).toBeInTheDocument();
    expect(screen.getByText('Mark Evans')).toBeInTheDocument();
  });

  it('saves game officials', async () => {
    const user = userEvent.setup();

    jest.spyOn(officialsApi, 'useGetGameOfficialsQuery').mockReturnValue({
      data: {},
      isFetching: false,
    });

    renderComponent({ enableReserveAr: true });

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await user.click(screen.getByLabelText('Referee'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[0].fullname })
    );

    await user.click(screen.getByLabelText('AR1'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[1].fullname })
    );

    await user.click(screen.getByLabelText('AR2'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[2].fullname })
    );

    await user.click(screen.getByLabelText('4th Official'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[3].fullname })
    );

    await user.click(screen.getByLabelText('VAR'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[4].fullname })
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

    await user.click(screen.getByLabelText('AVAR'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[5].fullname })
    );

    // button should be enabled now as we have selected all the required fields
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();

    await user.click(screen.getByLabelText('Reserve AR'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[6].fullname })
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'SUCCESS',
        title: textEnum.officialsSavedSuccess,
      },
      type: 'toasts/add',
    });
  });

  it('displays an error message when save game officials submission fail', async () => {
    server.use(
      rest.put(
        '/planning_hub/events/:event_id/game_officials/bulk_save',
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );

    const user = userEvent.setup();

    renderComponent({});

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await user.click(screen.getByLabelText('Referee'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[0].fullname })
    );

    await user.click(screen.getByLabelText('AR1'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[1].fullname })
    );

    await user.click(screen.getByLabelText('AR2'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[2].fullname })
    );

    await user.click(screen.getByLabelText('4th Official'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[3].fullname })
    );

    await user.click(screen.getByLabelText('VAR'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[4].fullname })
    );

    await user.click(screen.getByLabelText('AVAR'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[5].fullname })
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'ERROR',
        title: textEnum.officialsSavedError,
      },
      type: 'toasts/add',
    });
  });

  it('hides edit button for club user', () => {
    useLeagueOperations.mockReturnValue({
      isLeague: false,
      isLeagueStaffUser: false,
    });
    renderComponent({});
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  it('shows alert when duplicate officials are choosen', async () => {
    const user = userEvent.setup();
    renderComponent({});

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await user.click(screen.getByLabelText('Referee'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[0].fullname })
    );

    // Here we select the same official
    await user.click(screen.getByLabelText('AR1'));
    await user.click(
      screen.getByRole('option', { name: officialUsers[0].fullname })
    );

    expect(
      screen.getByText(textEnum.duplicateOfficialsErrorText)
    ).toBeInTheDocument();
  });

  describe('for club users', () => {
    beforeEach(() => {
      useLeagueOperations.mockReturnValue({
        isLeague: false,
        isLeagueStaffUser: false,
      });
    });

    it('locks the view when email has not been sent out', () => {
      renderComponent({
        customEvent: { ...mock.event, dmn_notification_status: false },
      });
      expect(screen.getByTestId('LockClockIcon')).toBeInTheDocument();
    });

    it('unlocks the view when email has been sent out', () => {
      renderComponent({
        customEvent: { ...mock.event, dmn_notification_status: true },
      });
      expect(screen.queryByTestId('LockClockIcon')).not.toBeInTheDocument();
    });
  });

  describe('for league users', () => {
    beforeEach(() => {
      useLeagueOperations.mockReturnValue({
        isLeague: true,
        isLeagueStaffUser: true,
      });
    });

    it('unlocks the view when email has not been sent out', () => {
      renderComponent({
        customEvent: { ...mock.event, dmn_notification_status: false },
      });
      expect(screen.queryByTestId('LockClockIcon')).not.toBeInTheDocument();
    });

    it('unlocks the view when email has been sent out', () => {
      renderComponent({
        customEvent: { ...mock.event, dmn_notification_status: true },
      });
      expect(screen.queryByTestId('LockClockIcon')).not.toBeInTheDocument();
    });
  });
});
