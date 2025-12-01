import * as redux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import * as getContactRolesApi from '@kitman/modules/src/Contacts/src/redux/rtk/getContactRolesApi';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import { getTranslations } from '@kitman/modules/src/MatchDay/shared/utils';
import { axios } from '@kitman/common/src/utils/services';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import * as searchContactsApi from '@kitman/modules/src/Contacts/src/redux/rtk/searchContactsApi';
import useLastPathSegment from '@kitman/common/src/hooks/useLastPathSegment';
import { transformedContactRoles } from '@kitman/services/src/services/contacts/getContactRoles/mock';
import mock from '@kitman/modules/src/MatchDay/shared/mock';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import GamedayRoles from '..';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/hooks/useLastPathSegment');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');

describe('GamedayRoles', () => {
  const user = userEvent.setup();
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);
  const mockDispatch = jest.fn();
  let useDispatchSpy;
  let updateGamedayRoles = jest.fn();

  const renderComponent = ({
    customEvent,
    manageGameInformation = true,
    leagueGameContacts = true,
  } = {}) => {
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          manageGameInformation,
        },
      },
    });

    usePreferences.mockReturnValue({
      preferences: {
        league_game_contacts: leagueGameContacts,
      },
    });

    renderWithRedux(
      <LocalizationProvider>
        <GamedayRoles />
      </LocalizationProvider>,
      {
        preloadedState: {
          planningEventApi: {
            queries: [
              {
                endpointName: 'getPlanningEvent',
                data: {
                  event: {
                    ...mock.event,
                    ...customEvent,
                  },
                },
              },
            ],
          },
        },
      }
    );
  };

  beforeEach(() => {
    useLastPathSegment.mockImplementation(() => 3855199);

    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatch);

    useLeagueOperations.mockReturnValue({
      isLeague: true,
      isLeagueStaffUser: true,
    });

    jest.spyOn(searchContactsApi, 'useSearchContactsQuery').mockReturnValue({
      data: [
        {
          value: 1,
          label: 'Isabella Walker',
          phone: '+447612841361',
          email: 'iw@kitmanlabs.com',
          roleIds: [1, 2, 3],
        },
        {
          value: 2,
          label: 'James Lee',
          phone: '+447612841362',
          email: 'jl@kitmanlabs.com',
          roleIds: [2, 3, 4],
        },
      ],
    });

    jest.spyOn(getContactRolesApi, 'useGetContactRolesQuery').mockReturnValue({
      data: transformedContactRoles,
    });
  });

  afterEach(() => {
    mockDispatch.mockRestore();
    updateGamedayRoles.mockRestore();
  });

  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByText('Matchday Roles')).toBeInTheDocument();
    ['role', 'name', 'email', 'phone'].forEach((name) => {
      expect(screen.getByRole('columnheader', { name })).toBeInTheDocument();
    });

    ['Match Director - - -', 'MLS Competition Contact - - -'].forEach(
      (name) => {
        expect(screen.getByRole('row', { name })).toBeInTheDocument();
      }
    );
  });

  it('shows the edit form when click on Edit', async () => {
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'Match Director' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', { name: 'MLS Competition Contact' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('combobox', { name: 'Name' })).toHaveLength(2);
  });

  it('closes the edit form', async () => {
    renderComponent();

    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();
  });

  it('saves gameday roles succesfully', async () => {
    updateGamedayRoles = jest.spyOn(axios, 'post');
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    // NOTE: form is already filled
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateGamedayRoles).toHaveBeenCalledWith(
      '/planning_hub/events/3855199/event_game_contacts/bulk_save',
      {
        event_game_contacts: [
          { game_contact_id: 2, game_contact_role_id: 2, id: null },
          { game_contact_id: 12, game_contact_role_id: 1, id: null },
        ],
      }
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'SUCCESS',
        title: textEnum.gamedayRolesSavedSuccess,
      },
      type: 'toasts/add',
    });

    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();
  });

  it('fails to save the gameday roles', async () => {
    updateGamedayRoles = jest.spyOn(axios, 'post').mockImplementation(() => {
      throw new Error();
    });
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    // NOTE: form is already filled
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateGamedayRoles).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'ERROR',
        title: textEnum.gamedayRolesSavedError,
      },
      type: 'toasts/add',
    });
  });

  it('hides remove button for required roles', async () => {
    renderComponent();
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.queryByTestId('RemoveCircleIcon')).not.toBeInTheDocument();
  });

  it('shows a remove button for optional roles', async () => {
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(
      screen.getByRole('menuitem', { name: 'MLS Operations Contact' })
    );

    expect(screen.getByTestId('RemoveCircleIcon')).toBeInTheDocument();
  });

  it('saves gameday roles with optional role succesfully', async () => {
    updateGamedayRoles = jest.spyOn(axios, 'post');
    renderComponent();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));
    await user.click(
      screen.getByRole('menuitem', { name: 'MLS Operations Contact' })
    );
    await user.click(screen.getAllByRole('combobox', { name: 'Name' })[2]);
    await user.click(screen.getByRole('option', { name: 'Isabella Walker' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateGamedayRoles).toHaveBeenCalledWith(
      '/planning_hub/events/3855199/event_game_contacts/bulk_save',
      {
        event_game_contacts: [
          { game_contact_id: 2, game_contact_role_id: 2, id: null },
          { game_contact_id: 12, game_contact_role_id: 1, id: null },
          { game_contact_id: 1, game_contact_role_id: 3, id: null },
        ],
      }
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'SUCCESS',
        title: textEnum.gamedayRolesSavedSuccess,
      },
      type: 'toasts/add',
    });

    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Save' })
    ).not.toBeInTheDocument();
  });

  describe('for club users', () => {
    beforeEach(() => {
      useLeagueOperations.mockReturnValue({
        isLeague: false,
        isLeagueStaffUser: false,
      });
    });

    it('locks the view when email has not been sent out', () => {
      renderComponent({ customEvent: { dmn_notification_status: false } });
      expect(screen.getByTestId('LockClockIcon')).toBeInTheDocument();
    });

    it('unlocks the view when email has been sent out', () => {
      renderComponent({ customEvent: { dmn_notification_status: true } });
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
      renderComponent({ customEvent: { dmn_notification_status: false } });
      expect(screen.queryByTestId('LockClockIcon')).not.toBeInTheDocument();
    });

    it('unlocks the view when email has been sent out', () => {
      renderComponent({ customEvent: { dmn_notification_status: true } });
      expect(screen.queryByTestId('LockClockIcon')).not.toBeInTheDocument();
    });
  });
});
