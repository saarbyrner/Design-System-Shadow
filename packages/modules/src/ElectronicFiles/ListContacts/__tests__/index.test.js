import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetPreferencesQuery,
  useGetCurrentUserQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  useLazySearchInboundElectronicFileListQuery,
  useLazySearchOutboundElectronicFileListQuery,
  useSearchContactListQuery,
  useGetUnreadCountQuery,
  useLazyGetUnreadCountQuery,
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useCreateContactMutation,
  useUpdateContactMutation,
  useUpdateContactsArchivedMutation,
  useMakeContactFavoriteMutation,
  useDeleteContactFavoriteMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { initialData as initialGridData } from '@kitman/modules/src/ElectronicFiles/ListContacts/src/hooks/useContactsGrid';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import ListContactsApp from '@kitman/modules/src/ElectronicFiles/ListContacts';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const store = storeFake(mockState);

const mockRefreshUnreadCount = jest.fn();
const mockInboundRefreshList = jest.fn();
const mockOutboundRefreshList = jest.fn();
const mockUpdateViewedMutation = jest.fn();
const mockUpdateArchivedMutation = jest.fn();
const mockCreateContactMutation = jest.fn();
const mockUpdateContactMutation = jest.fn();
const mockUpdateContactsArchivedMutation = jest.fn();
const mockMakeContactFavorite = jest.fn();
const mockDeleteContactFavorite = jest.fn();

const renderComponent = () =>
  render(
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ListContactsApp />
      </LocalizationProvider>
    </Provider>
  );

describe('Root', () => {
  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: {},
      isSuccess: true,
    });
    useGetCurrentUserQuery.mockReturnValue({
      data: {},
      isSuccess: true,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: {
        efile: {
          canSend: true,
          canViewArchive: true,
        },
        medical: {
          documents: {
            canView: true,
          },
        },
      },
      isSuccess: true,
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: {},
      isSuccess: true,
    });
    useLazySearchInboundElectronicFileListQuery.mockReturnValue([
      mockInboundRefreshList,
    ]);
    useLazySearchOutboundElectronicFileListQuery.mockReturnValue([
      mockOutboundRefreshList,
    ]);
    useSearchContactListQuery.mockReturnValue({
      data: initialGridData,
      isSuccess: true,
    });
    useGetUnreadCountQuery.mockReturnValue({
      data: { unread: 0 },
      isSuccess: true,
    });
    useLazyGetUnreadCountQuery.mockReturnValue([mockRefreshUnreadCount]);
    useGetPreferencesQuery.mockReturnValue({
      data: {},
      isSuccess: true,
      isError: false,
      isLoading: false,
    });
    useUpdateViewedMutation.mockReturnValue([mockUpdateViewedMutation]);
    useUpdateArchivedMutation.mockReturnValue([mockUpdateArchivedMutation]);
    useCreateContactMutation.mockReturnValue([
      mockCreateContactMutation,
      {
        isLoading: false,
      },
    ]);
    useUpdateContactMutation.mockReturnValue([
      mockUpdateContactMutation,
      {
        isLoading: false,
      },
    ]);
    useUpdateContactsArchivedMutation.mockReturnValue([
      mockUpdateContactsArchivedMutation,
    ]);
    useMakeContactFavoriteMutation.mockReturnValue([
      mockMakeContactFavorite,
      {
        isLoading: false,
      },
    ]);
    useDeleteContactFavoriteMutation.mockReturnValue([
      mockDeleteContactFavorite,
      {
        isLoading: false,
      },
    ]);
  });
  it('renders correctly', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'eFile', level: 5 })
    ).toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {},
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {},
      isError: true,
    });

    renderComponent();

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByText('Go back and try again')).toBeInTheDocument();
  });
});
