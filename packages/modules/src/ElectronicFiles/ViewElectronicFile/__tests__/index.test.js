import { screen, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetPreferencesQuery,
  useGetCurrentUserQuery,
  useGetSquadAthletesQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  useGetUnreadCountQuery,
  useFetchInboundElectronicFileQuery,
  useFetchOutboundElectronicFileQuery,
  useCreatePresignedAttachmentsMutation,
  useUploadFileToS3Mutation,
  useConfirmFileUploadMutation,
  useSendElectronicFileMutation,
  useUpdateViewedMutation,
  useUpdateArchivedMutation,
  useSplitDocumentMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { data as mockInboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import { data as mockOutboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchOutboundElectronicFile.mock';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import ViewElectronicFileApp from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const mockUpdateViewedMutation = jest.fn();
const mockUpdateArchivedMutation = jest.fn();
const mockSplitDocumentMutation = jest.fn();

const store = storeFake({
  globalApi: {
    useGetPermissionsQuery: jest.fn(),
  },
  electronicFilesApi: {
    useGetUnreadCountQuery: jest.fn(),
  },
  ...mockState,
});

const mockCreatePresignedAttachments = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({ attachments: [] }),
}));
const mockUploadFileToS3Mutation = jest.fn();
const mockConfirmFileUploadMutation = jest.fn();
const mockSendElectronicFileMutation = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({ attachments: [] }),
}));

const renderComponent = () =>
  render(
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ViewElectronicFileApp />
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
        },
        medical: {
          documents: {
            canView: true,
          },
        },
      },
      isSuccess: true,
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: { squads: [] },
      error: false,
      isLoading: false,
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: {},
      isSuccess: true,
    });
    useGetPreferencesQuery.mockReturnValue({
      data: {},
      isSuccess: true,
      isError: false,
      isLoading: false,
    });
    useGetUnreadCountQuery.mockReturnValue({
      data: { unread: 0 },
      isSuccess: true,
    });
    useUpdateViewedMutation.mockReturnValue([mockUpdateViewedMutation], {
      isLoading: false,
    });
    useUpdateArchivedMutation.mockReturnValue([mockUpdateArchivedMutation], {
      isLoading: false,
    });
    useSplitDocumentMutation.mockReturnValue([mockSplitDocumentMutation], {
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
    useFetchInboundElectronicFileQuery.mockReturnValue({
      data: mockInboundData,
      isSuccess: true,
    });
    useFetchOutboundElectronicFileQuery.mockReturnValue({
      data: mockOutboundData,
      isSuccess: true,
    });
  });
  it('renders correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'eFile', level: 5 })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('menuitem', { name: /inbox/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /sent/i })
      ).toBeInTheDocument();
    });
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
