import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import AppHeader from '@kitman/modules/src/ElectronicFiles/shared/components/AppHeader';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

const props = {
  t: i18nextTranslateStub(),
};

let store;
const renderComponent = (state = mockState) => {
  store = storeFake(state);
  render(
    <Provider store={store}>
      <AppHeader {...props} />
    </Provider>
  );
};

describe('<AppHeader />', () => {
  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        efile: {
          canSend: true,
          canViewArchive: true,
          canManageContacts: true,
        },
      },
      isSuccess: true,
    });
  });
  it('renders header and buttons correctly', async () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'eFile', level: 5 })
    ).toBeInTheDocument();

    const newMessageButton = screen.getByRole('button', {
      name: /new message/i,
    });

    const viewArchiveButton = screen.getByRole('button', {
      name: /view archive/i,
    });

    expect(newMessageButton).toBeInTheDocument();
    expect(viewArchiveButton).toBeInTheDocument();
  });

  it('renders disabled buttons in loading state correctly', async () => {
    renderComponent({
      ...mockState,
      electronicFilesApi: {
        ...mockState.electronicFilesApi,
        queries: {
          ...mockState.electronicFilesApi.queries,
          searchInboundElectronicFileList: {
            ...mockState.electronicFilesApi.queries
              .searchInboundElectronicFileList,
            status: 'pending',
          },
          searchOutboundElectronicFileList: {
            ...mockState.electronicFilesApi.queries
              .searchOutboundElectronicFileList,
            status: 'pending',
          },
          searchContactList: {
            ...mockState.electronicFilesApi.queries.searchContactList,
            status: 'pending',
          },
        },
      },
    });

    expect(
      screen.getByRole('heading', { name: 'eFile', level: 5 })
    ).toBeInTheDocument();

    const newMessageButton = screen.getByRole('button', {
      name: /new message/i,
    });

    const viewArchiveButton = screen.getByRole('button', {
      name: /view archive/i,
    });

    expect(newMessageButton).toBeInTheDocument();
    expect(newMessageButton).toBeDisabled();
    expect(viewArchiveButton).toBeInTheDocument();
    expect(viewArchiveButton).toBeDisabled();
  });

  it('calls dispatch when clicking New message button', async () => {
    renderComponent();

    const newMessageButton = screen.getByRole('button', {
      name: /new message/i,
    });

    expect(newMessageButton).toBeInTheDocument();

    await userEvent.click(newMessageButton);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: true,
      type: 'sendDrawerSlice/updateOpen',
    });
  });

  it('calls dispatch when clicking New contact button', async () => {
    renderComponent({
      ...mockState,
      sidebarSlice: {
        selectedMenuItem: MENU_ITEM.contacts,
      },
    });

    const newContactButton = screen.getByRole('button', {
      name: /new contact/i,
    });

    expect(newContactButton).toBeInTheDocument();

    await userEvent.click(newContactButton);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: true,
      type: 'contactDrawerSlice/updateOpen',
    });
  });

  it('calls dispatch when clicking View Archive button and selectedMenuItem = inbox', async () => {
    renderComponent();

    const viewArchiveButton = screen.getByRole('button', {
      name: /view archive/i,
    });

    expect(viewArchiveButton).toBeInTheDocument();

    await userEvent.click(viewArchiveButton);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        partialFilter: {
          archived: true,
        },
        selectedMenuItem: 'inbox',
      },
      type: 'gridSlice/updatePersistedFilter',
    });
  });

  it('calls dispatch when clicking View Archive button and selectedMenuItem = contacts', async () => {
    renderComponent({
      ...mockState,
      sidebarSlice: {
        selectedMenuItem: MENU_ITEM.contacts,
      },
    });

    const viewArchiveButton = screen.getByRole('button', {
      name: /view archive/i,
    });

    expect(viewArchiveButton).toBeInTheDocument();

    await userEvent.click(viewArchiveButton);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: {
        archived: true,
      },
      type: 'contactsGridSlice/updateFilter',
    });
  });

  describe('Permissions', () => {
    it('hides the New message button when permissions.efile.canSend is false', () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          efile: {
            canSend: false,
          },
        },
        isSuccess: true,
      });

      renderComponent();

      expect(
        screen.queryByRole('button', {
          name: /new message/i,
        })
      ).not.toBeInTheDocument();
    });

    it('hides the View Archive button when permissions.efile.canViewArchive is false', () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          efile: {
            canViewArchive: false,
          },
        },
        isSuccess: true,
      });

      renderComponent();

      expect(
        screen.queryByRole('button', {
          name: /view archive/i,
        })
      ).not.toBeInTheDocument();
    });

    it('hides the New contact and View Archive button when permissions.efile.canManageContacts is false', () => {
      useGetPermissionsQuery.mockReturnValue({
        data: {
          efile: {
            canManageContacts: false,
          },
        },
        isSuccess: true,
      });

      renderComponent();

      expect(
        screen.queryByRole('button', {
          name: /new contact/i,
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: /view archive/i,
        })
      ).not.toBeInTheDocument();
    });
  });
});
