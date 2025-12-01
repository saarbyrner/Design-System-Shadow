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
  useSearchInboundElectronicFileListQuery,
  useLazySearchInboundElectronicFileListQuery,
  useSearchOutboundElectronicFileListQuery,
  useLazySearchOutboundElectronicFileListQuery,
  useGetUnreadCountQuery,
  useLazyGetUnreadCountQuery,
  useCreatePresignedAttachmentsMutation,
  useUploadFileToS3Mutation,
  useConfirmFileUploadMutation,
  useSendElectronicFileMutation,
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useUpdateContactsArchivedMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { initialData as initialGridData } from '@kitman/modules/src/ElectronicFiles/shared/hooks/useGrid';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import ListElectronicFilesApp from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/App';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const props = {
  t: i18nextTranslateStub(),
};

const store = storeFake(mockState);

const mockCreatePresignedAttachments = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({ attachments: [] }),
}));
const mockUploadFileToS3Mutation = jest.fn();
const mockConfirmFileUploadMutation = jest.fn();
const mockSendElectronicFileMutation = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({ attachments: [] }),
}));
const mockUpdateViewedMutation = jest.fn();
const mockUpdateArchivedMutation = jest.fn();
const mockUpdateContactsArchivedMutation = jest.fn();
const mockRefreshUnreadCount = jest.fn();
const mockInboundRefreshList = jest.fn();
const mockOutboundRefreshList = jest.fn();

const renderComponent = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ListElectronicFilesApp {...props} />
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
    useSearchInboundElectronicFileListQuery.mockReturnValue({
      data: initialGridData,
      isSuccess: true,
    });
    useSearchOutboundElectronicFileListQuery.mockReturnValue({
      data: initialGridData,
      isSuccess: true,
    });
    useGetUnreadCountQuery.mockReturnValue({
      data: { unread: 0 },
      isSuccess: true,
    });
    useCreatePresignedAttachmentsMutation.mockReturnValue([
      mockCreatePresignedAttachments,
      {
        isLoading: false,
      },
    ]);
    useUploadFileToS3Mutation.mockReturnValue([
      mockUploadFileToS3Mutation,
      {
        isLoading: false,
      },
    ]);
    useConfirmFileUploadMutation.mockReturnValue([
      mockConfirmFileUploadMutation,
      {
        isLoading: false,
      },
    ]);
    useSendElectronicFileMutation.mockReturnValue([
      mockSendElectronicFileMutation,
      {
        isLoading: false,
      },
    ]);
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
  it('renders correctly', async () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: 'eFile', level: 5 })
    ).toBeInTheDocument();
  });
});
