import { render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MainContent from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/MainContent';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import { data as outboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchOutboundElectronicFileList.mock';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import {
  useSearchInboundElectronicFileListQuery,
  useLazySearchInboundElectronicFileListQuery,
  useSearchOutboundElectronicFileListQuery,
  useLazySearchOutboundElectronicFileListQuery,
  useLazyGetUnreadCountQuery,
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useUpdateContactsArchivedMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { columnSets } from '@kitman/modules/src/ElectronicFiles/shared/hooks/useGrid';

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
    delete window.location;
    useSearchInboundElectronicFileListQuery.mockReturnValue({
      data: inboundData,
      error: false,
      isLoading: false,
    });
    useSearchOutboundElectronicFileListQuery.mockReturnValue({
      data: outboundData,
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
  });

  it('renders grid correctly', () => {
    renderComponent();

    const tableHeaders = document
      .querySelector('.MuiDataGrid-columnHeaders')
      .querySelectorAll('.MuiDataGrid-columnHeaderTitle');

    expect(tableHeaders.length).toBe(columnSets.inbox.length);

    const tableRows = document
      .querySelector('.MuiDataGrid-root')
      .querySelectorAll('.MuiDataGrid-row');

    expect(tableRows.length).toBe(inboundData.data.length);
  });
});
