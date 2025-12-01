import { screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axios } from '@kitman/common/src/utils/services';
import {
  SEARCH_CONTACTS_URL,
  defaultSearchContactsPayload,
} from '@kitman/services/src/services/contacts/searchContacts';
import contactRolesMock from '@kitman/services/src/services/contacts/getContactRoles/mock';
import { useLeagueOperations } from '@kitman/common/src/hooks';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';

import App from '../App';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');

describe('<App />', () => {
  const renderComponent = ({
    isLeague,
    isOrgSupervised,
    manageContacts,
  } = {}) => {
    useLeagueOperations.mockReturnValue({
      isLeague,
      isOrgSupervised,
    });
    usePermissions.mockReturnValue({
      permissions: {
        leagueGame: {
          manageContacts,
        },
      },
    });

    return renderWithRedux(<App />, {
      preloadedState: {},
      useGlobalStore: true,
    });
  };

  beforeEach(() => {
    window.setFlag('lops-grid-filter-enhancements', true);
    jest.useFakeTimers();
  });

  afterEach(() => {
    window.setFlag('lops-grid-filter-enhancements', false);
    useLeagueOperations.mockClear();
    jest.useRealTimers();
  });

  it('renders correctly (with manageContacts perm on)', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    await act(async () => {
      renderComponent({ manageContacts: true });
    });
    expect(
      screen.getByRole('heading', { name: 'Contacts' })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Search', { selector: 'input' })
    ).toBeInTheDocument();
    ['Role', 'Status', 'List'].forEach((name) => {
      expect(
        screen.getByLabelText(name, { selector: 'input' })
      ).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalledWith(SEARCH_CONTACTS_URL, {
        ...defaultSearchContactsPayload,
      });
    });

    [
      'Name Owner Matchday Role Phone Email List',
      'Gordon Morales Atlanta United FC MLS Competition Contact +4444444444 john@gmail.com DMN',
      'Anna Smith Los Angeles Galaxy Team Manager +5555555555 anna.smith@gmail.com DMN',
      'Michael Johnson New York Red Bulls Coach +6666666666 michael.johnson@gmail.com DMR',
    ].forEach((name) => {
      expect(screen.getByRole('row', { name })).toBeInTheDocument();
    });

    // renders the title
    expect(
      screen.getByText('Assistant & Goalkeeper Coach')
    ).toBeInTheDocument();
  });

  it('filters by name', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    await act(async () => {
      renderComponent();
    });

    const search = screen.getByLabelText('Search', { selector: 'input' });
    const value = 'n';
    fireEvent.change(search, { target: { value } });
    jest.advanceTimersByTime(1000);
    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalledWith(SEARCH_CONTACTS_URL, {
        ...defaultSearchContactsPayload,
        search_expression: value,
      });
    });
  });

  it('filters by role', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup({ delay: null });
    renderComponent();
    await user.click(screen.getByLabelText('Role', { selector: 'input' }));
    await user.click(screen.getByText(contactRolesMock[0].name));
    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalledWith(SEARCH_CONTACTS_URL, {
        ...defaultSearchContactsPayload,
        game_contact_role_ids: [contactRolesMock[0].id],
      });
    });
  });

  it('filters by status', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup({ delay: null });
    renderComponent();

    await user.click(screen.getByLabelText('Status', { selector: 'input' }));
    await user.click(screen.getByText('Rejected'));

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenNthCalledWith(2, SEARCH_CONTACTS_URL, {
        ...defaultSearchContactsPayload,
        statuses: ['rejected'],
      });
    });
  });

  it('filters by list', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup({ delay: null });
    renderComponent();

    await user.click(screen.getByLabelText('List', { selector: 'input' }));
    await user.click(screen.getByRole('option', { name: 'DMR' }));

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenNthCalledWith(2, SEARCH_CONTACTS_URL, {
        ...defaultSearchContactsPayload,
        dmr: true,
      });
    });
  });

  it('clears filters', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup({ delay: null });
    renderComponent({ isLeague: true });

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalledWith(SEARCH_CONTACTS_URL, {
        ...defaultSearchContactsPayload,
      });
    });
  });

  it('opens contact drawer with the manageContacts permission', async () => {
    const user = userEvent.setup({ delay: null });
    renderComponent({ isLeague: true, manageContacts: true });
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('Add Contact')).toBeInTheDocument();
  });

  it('closes contact drawer with manageContacts permission', async () => {
    const user = userEvent.setup({ delay: null });
    renderComponent({ isLeague: true, manageContacts: true });
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByText('Add Contact')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.queryByText('Add Contact')).not.toBeInTheDocument();
    });
  });

  it('shows the status column for league users', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    renderComponent({ isLeague: true });

    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalledWith(SEARCH_CONTACTS_URL, {
        ...defaultSearchContactsPayload,
      });
    });

    expect(
      screen.getByRole('columnheader', { name: 'Status' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('row', {
        name: 'Gordon Morales Atlanta United FC MLS Competition Contact +4444444444 john@gmail.com DMN Pending',
      })
    ).toBeInTheDocument();
  });

  it('hides the "Add" button for club users', async () => {
    renderComponent({ isOrgSupervised: true });
    expect(
      screen.queryByRole('button', { name: 'Add' })
    ).not.toBeInTheDocument();
  });

  it('hides the "Add" button for club users, when permissions is false', async () => {
    renderComponent({ isLeague: true, manageContacts: false });
    expect(
      screen.queryByRole('button', { name: 'Add' })
    ).not.toBeInTheDocument();
  });

  it('hides the "Add" button for club users, when permissions is true', async () => {
    renderComponent({ isLeague: true, manageContacts: true });
    expect(screen.queryByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('hides the "Status" column for club users', async () => {
    renderComponent({ isOrgSupervised: true });
    expect(
      screen.queryByRole('columnheader', { name: 'Status' })
    ).not.toBeInTheDocument();
  });

  it('hides the "Action" column for club users', async () => {
    renderComponent({ isOrgSupervised: true });
    expect(
      screen.queryByRole('columnheader', { name: 'actions' })
    ).not.toBeInTheDocument();
  });

  it('renders the contact name tooltip correctly', async () => {
    const axiosPostSpy = jest.spyOn(axios, 'post');
    const user = userEvent.setup({ delay: null });
    renderComponent({ isOrgSupervised: true });
    await waitFor(() => {
      expect(axiosPostSpy).toHaveBeenCalledWith(SEARCH_CONTACTS_URL, {
        ...defaultSearchContactsPayload,
      });
    });
    const contactName = screen.getByText('Gordon Morales');
    await user.hover(contactName);
    await waitFor(() => {
      const elements = screen.getAllByText('Gordon Morales');
      expect(elements).toHaveLength(2);
    });
  });
});
