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
import ListElectronicFilesApp from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

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
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ListElectronicFilesApp />
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
    useGetPreferencesQuery.mockReturnValue({
      data: {},
      isSuccess: true,
      isError: false,
      isLoading: false,
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
