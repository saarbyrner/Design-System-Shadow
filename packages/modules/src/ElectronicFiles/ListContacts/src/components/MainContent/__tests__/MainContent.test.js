import { render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { data as contactsData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchContactList.mock';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import {
  useSearchContactListQuery,
  useLazySearchInboundElectronicFileListQuery,
  useLazySearchOutboundElectronicFileListQuery,
  useLazyGetUnreadCountQuery,
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useUpdateContactsArchivedMutation,
  useMakeContactFavoriteMutation,
  useDeleteContactFavoriteMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import MainContent from '@kitman/modules/src/ElectronicFiles/ListContacts/src/components/MainContent';

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const props = {
  t: i18nextTranslateStub(),
};

const initialState = mockState;

const mockUpdateViewedMutation = jest.fn();
const mockUpdateArchivedMutation = jest.fn();
const mockUpdateContactsArchivedMutation = jest.fn();
const mockRefreshUnreadCount = jest.fn();
const mockInboundRefreshList = jest.fn();
const mockOutboundRefreshList = jest.fn();
const mockMakeContactFavorite = jest.fn();
const mockDeleteContactFavorite = jest.fn();

const renderComponent = (state = initialState) =>
  render(
    <Provider store={storeFake(state)}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <MainContent {...props} />
      </LocalizationProvider>
    </Provider>
  );

describe('<MainContent />', () => {
  beforeEach(() => {
    useSearchContactListQuery.mockReturnValue({
      data: contactsData,
      error: false,
      isLoading: false,
    });
    useUpdateViewedMutation.mockReturnValue([mockUpdateViewedMutation], {
      isLoading: false,
    });
    useUpdateArchivedMutation.mockReturnValue([mockUpdateArchivedMutation], {
      isLoading: false,
    });
    useUpdateContactsArchivedMutation.mockReturnValue(
      [mockUpdateContactsArchivedMutation],
      {
        isLoading: false,
      }
    );
    useLazyGetUnreadCountQuery.mockReturnValue([mockRefreshUnreadCount]);
    useLazySearchInboundElectronicFileListQuery.mockReturnValue([
      mockInboundRefreshList,
    ]);
    useLazySearchOutboundElectronicFileListQuery.mockReturnValue([
      mockOutboundRefreshList,
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

  it('renders grid correctly', () => {
    renderComponent();

    const tableHeaders = document
      .querySelector('.MuiDataGrid-columnHeaders')
      .querySelectorAll('.MuiDataGrid-columnHeaderTitle');

    expect(tableHeaders.length).toBe(5);

    const tableRows = document
      .querySelector('.MuiDataGrid-root')
      .querySelectorAll('.MuiDataGrid-row');

    expect(tableRows.length).toBe(contactsData.data.length);
  });
});
