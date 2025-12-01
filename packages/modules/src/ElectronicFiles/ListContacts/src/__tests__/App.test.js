import { screen, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
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
import ListContactsApp from '@kitman/modules/src/ElectronicFiles/ListContacts/src/App';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const props = {
  t: i18nextTranslateStub(),
};

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
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ListContactsApp {...props} />
        </LocalizationProvider>
      </Provider>
    </I18nextProvider>
  );

describe('<App />', () => {
  beforeEach(() => {
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
});
