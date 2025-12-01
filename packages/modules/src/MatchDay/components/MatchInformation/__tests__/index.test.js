import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';
import * as redux from 'react-redux';
import { rest, server } from '@kitman/services/src/mocks/server';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import mock from '@kitman/modules/src/MatchDay/shared/mock';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { getTranslations } from '@kitman/modules/src/MatchDay/shared/utils';
import useLeagueOperations from '@kitman/common/src/hooks/useLeagueOperations';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import mockContacts from '@kitman/services/src/services/contacts/getEventGameContacts/mock';

import MatchInformation from '..';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');

describe('MatchInformation', () => {
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);

  const renderComponent = ({ timezone }) => {
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          manageGameInformation: true,
        },
      },
    });
    renderWithRedux(
      <LocalizationProvider>
        <MatchInformation />
      </LocalizationProvider>,
      {
        preloadedState: {
          planningEventApi: {
            queries: [
              {
                endpointName: 'getPlanningEvent',
                data: {
                  event: timezone
                    ? { ...mock.event, local_timezone: timezone }
                    : mock.event,
                },
              },
            ],
          },
        },
      }
    );
  };

  let useDispatchSpy = jest.spyOn(redux, 'useDispatch');
  let mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);

    moment.tz.setDefault('Europe/Dublin');

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-09-10'));

    server.use(
      rest.post('/planning_hub/game_contacts/search', (req, res, ctx) =>
        res(ctx.json({ game_contacts: mockContacts }))
      ),
      rest.get('/ui/planning_hub/event_locations', (req, res, ctx) =>
        res(ctx.json([{ id: 1, name: 'Test Pitch 1' }]))
      ),
      rest.get('/planning_hub/tv_channels', (req, res, ctx) =>
        res(
          ctx.json([
            { id: 1, name: 'AAA' },
            { id: 2, name: 'BBB' },
          ])
        )
      ),
      rest.get(
        '/planning_hub/events/:event_id/game_officials',
        (req, res, ctx) => res(ctx.json(mock.gameOfficials))
      )
    );

    useLeagueOperations.mockReturnValue({
      isLeague: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    moment.tz.setDefault();
  });

  it('renders correctly', () => {
    renderComponent({});

    expect(screen.getByText('Match #:')).toBeInTheDocument();
    expect(screen.getAllByText('--')[0]).toBeInTheDocument();

    expect(screen.getByText('Match Time:')).toBeInTheDocument();
    expect(screen.getByText('12:30 AM GMT')).toBeInTheDocument();

    expect(screen.getByText('Kick Time:')).toBeInTheDocument();
    expect(screen.getByText('12:00 AM GMT')).toBeInTheDocument();

    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('09/10/2024')).toBeInTheDocument();

    expect(screen.getByText('Venue:')).toBeInTheDocument();
    expect(screen.getByText('Camp Nou')).toBeInTheDocument();

    expect(screen.getByText('TV:')).toBeInTheDocument();
    expect(screen.getAllByText('--')[1]).toBeInTheDocument();
  });

  it('renders correctly when the timezone is different', () => {
    renderComponent({ timezone: 'Japan' });

    expect(screen.getByText('Match Time:')).toBeInTheDocument();
    expect(screen.getByText('09:30 AM JST')).toBeInTheDocument();

    expect(screen.getByText('Kick Time:')).toBeInTheDocument();
    expect(screen.getByText('09:00 AM JST')).toBeInTheDocument();

    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText('09/10/2024')).toBeInTheDocument();
  });

  it('shows the edit view when Edit button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({});

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await waitFor(() => user.click(editButton));

    expect(screen.getByLabelText('Match #')).toBeInTheDocument();
    expect(screen.getByLabelText('Venue')).toBeInTheDocument();
    expect(screen.getByLabelText('TV')).toBeInTheDocument();
  });

  it('toggles back to view mode when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent({});

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await waitFor(() => user.click(editButton));
    await waitFor(() => user.click(screen.getByText('Cancel')));

    expect(screen.getByText('Match #:')).toBeInTheDocument();
    expect(screen.getAllByText('--')[0]).toBeInTheDocument();
  });

  it('saves game information', async () => {
    const user = userEvent.setup();

    renderComponent({});

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await waitFor(() => user.click(editButton));

    fireEvent.change(screen.getByLabelText('Match #'), {
      target: { value: '1' },
    });

    fireEvent.change(screen.getByLabelText('Kick Time'), {
      target: { value: '10:30 AM' },
    });

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '09/10/2024' },
    });
    await waitFor(() => user.click(screen.getByLabelText('Venue')));
    await waitFor(() => user.click(screen.getByText('Test Pitch 1')));
    await waitFor(() => user.click(screen.getByLabelText('TV')));
    await waitFor(() => user.click(screen.getByText('AAA')));

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();

    await waitFor(() =>
      user.click(screen.getByRole('button', { name: 'Save' }))
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'SUCCESS',
        title: textEnum.informationSavedSuccess,
      },
      type: 'toasts/add',
    });
  });

  it('shows an error when saves game information fails', async () => {
    server.use(
      rest.patch('/planning_hub/league_games/:event_id', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const user = userEvent.setup();

    renderComponent({});

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await waitFor(() => user.click(editButton));

    fireEvent.change(screen.getByLabelText('Match #'), {
      target: { value: '1' },
    });

    fireEvent.change(screen.getByLabelText('Kick Time'), {
      target: { value: '10:30 AM' },
    });

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '09/10/2024' },
    });

    await waitFor(() => user.click(screen.getByLabelText('TV')));
    await waitFor(() => user.click(screen.getByText('AAA')));

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();

    await waitFor(() =>
      user.click(screen.getByRole('button', { name: 'Save' }))
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        status: 'ERROR',
        title: textEnum.informationSavedError,
      },
      type: 'toasts/add',
    });
  });

  it('hides edit button for club user', () => {
    useLeagueOperations.mockReturnValue({
      isOrgSupervised: true,
    });
    renderComponent({});
    expect(
      screen.queryByRole('button', { name: 'Edit' })
    ).not.toBeInTheDocument();
  });

  it('shows the tv users dropdown when the tv channel is selected and there are users linked to the channels', async () => {
    const user = userEvent.setup();
    renderComponent({});

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await waitFor(() => user.click(editButton));
    await waitFor(() => user.click(screen.getByLabelText('TV')));
    await waitFor(() => user.click(screen.getByText('AAA')));

    const tvUsersField = screen.getByLabelText('TV users');
    await expect(tvUsersField).toBeInTheDocument();
  });

  it('does not show the tv users dropdown when the tv channel is not selected', async () => {
    const user = userEvent.setup();
    renderComponent({});

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await waitFor(() => user.click(editButton));

    const tvUsersField = screen.queryByLabelText('TV users');
    await expect(tvUsersField).not.toBeInTheDocument();
  });

  it('filters the tv users dropdown based on the selected tv channel', async () => {
    const user = userEvent.setup();
    renderComponent({});

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await waitFor(() => user.click(editButton));

    await waitFor(() => user.click(screen.getByLabelText('TV')));
    await waitFor(() => user.click(screen.getByText('AAA')));

    const tvUsersField = screen.getByLabelText('TV users');
    await waitFor(() => user.click(tvUsersField));
    let options = await screen.findByRole('option');
    expect(options).toBeInTheDocument();

    await waitFor(() => user.click(screen.getByLabelText('TV')));
    await waitFor(() => user.click(screen.getByText('BBB')));
    options = await screen.findAllByRole('option');
    await waitFor(() => user.click(tvUsersField));
    expect(options).toHaveLength(2);
  });

  it('kick time validation works correctly', async () => {
    const user = userEvent.setup();
    renderComponent({});

    await waitFor(() => user.click(screen.getByText('Edit')));

    fireEvent.change(screen.getByLabelText('Match #'), {
      target: { value: '1' },
    });

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '09/10/2024' },
    });

    await waitFor(() => user.click(screen.getByLabelText('TV')));
    await waitFor(() => user.click(screen.getByText('AAA')));

    const kickTimeField = screen.getByLabelText('Kick Time');
    const saveButton = screen.getByRole('button', { name: 'Save' });

    fireEvent.change(kickTimeField, { target: { value: '12:10 AM' } });

    expect(saveButton).toBeDisabled();

    fireEvent.change(kickTimeField, { target: { value: '10:30 AM' } });
    expect(saveButton).toBeEnabled();
  });
});
