import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  useGetImportJobsQuery,
  useLazyDeleteMassUploadQuery,
} from '@kitman/modules/src/shared/MassUpload/redux/massUploadApi';
import { dataInCamelCase } from '@kitman/services/src/mocks/handlers/imports/genericImport';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';

import SubmissionsTable from '..';

jest.mock('@kitman/modules/src/shared/MassUpload/redux/massUploadApi');
jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<SubmissionsTable />', () => {
  const mockProps = {
    importType: IMPORT_TYPES.GrowthAndMaturation,
  };

  const dataWithoutAttachment = {
    ...dataInCamelCase,
    data: [dataInCamelCase.data[1]],
  };

  const initialPreloadedState = {
    massUploadSlice: {
      deleteImport: {
        attachmentId: null,
        isConfirmationModalOpen: false,
        submissionStatus: null,
      },
    },
  };

  const loadingText = 'Loading...';
  const noRowsMessage = 'No measurements submitted yet';

  const mockRefetch = jest.fn();
  const mockDeleteMassUpload = jest.fn();
  const mockTrackEvent = jest.fn();

  beforeEach(() => {
    useGetImportJobsQuery.mockReturnValue({
      data: {
        ...dataInCamelCase,
        data: dataInCamelCase.data.map((mockImport) => ({
          ...mockImport,
          importType: IMPORT_TYPES.GrowthAndMaturation,
        })),
      },
      isSuccess: true,
      isError: false,
      refetch: mockRefetch,
    });

    useLazyDeleteMassUploadQuery.mockReturnValue([
      mockDeleteMassUpload,
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
      },
    ]);

    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', async () => {
    renderWithRedux(<SubmissionsTable {...mockProps} />, {
      useGlobalStore: false,
      preloadedState: initialPreloadedState,
    });

    await waitFor(() => {
      expect(useGetImportJobsQuery).toHaveBeenCalled();
    });

    expect(
      screen.getByRole('columnheader', { name: 'Submission date' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Submitted by' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Submission status' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Submitted file' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Errors file' })
    ).toBeInTheDocument();

    dataInCamelCase.data.forEach(({ createdBy: { fullname } }) =>
      expect(screen.getByRole('cell', { name: fullname })).toBeInTheDocument()
    );
  });

  describe('export csv button', () => {
    it('renders export csv button if there are attachments', async () => {
      renderWithRedux(<SubmissionsTable {...mockProps} />, {
        useGlobalStore: false,
        preloadedState: initialPreloadedState,
      });

      await waitFor(() => {
        expect(useGetImportJobsQuery).toHaveBeenCalled();
      });

      expect(
        await screen.findByTestId('FileDownloadOutlinedIcon')
      ).toBeInTheDocument();
    });

    it('does not render export csv button if there are no attachments', async () => {
      useGetImportJobsQuery.mockReturnValue({
        data: dataWithoutAttachment,
        isSuccess: true,
        isError: false,
        refetch: mockRefetch,
      });
      renderWithRedux(<SubmissionsTable {...mockProps} />, {
        useGlobalStore: false,
        preloadedState: initialPreloadedState,
      });

      await waitFor(() => {
        expect(useGetImportJobsQuery).toHaveBeenCalled();
      });

      expect(
        screen.queryByTestId('FileDownloadOutlinedIcon')
      ).not.toBeInTheDocument();
    });
  });

  it(`displays ‘${noRowsMessage}’ if there is no submissions`, async () => {
    useGetImportJobsQuery.mockReturnValue({
      data: [],
      isSuccess: true,
      isError: false,
      refetch: mockRefetch,
    });
    renderWithRedux(<SubmissionsTable {...mockProps} />, {
      useGlobalStore: false,
      preloadedState: initialPreloadedState,
    });

    await waitFor(() =>
      expect(screen.queryByText(loadingText)).not.toBeInTheDocument()
    );
    expect(screen.getByText(noRowsMessage)).toBeInTheDocument();
  });

  describe('Delete confirmation modal', () => {
    beforeEach(() => {
      window.setFlag(
        'cap-training-variable-importer-delete-imported-file',
        true
      );
    });

    it('should dispatch action to open confirmation modal', async () => {
      const user = userEvent.setup();
      const { mockedStore } = renderWithRedux(
        <SubmissionsTable {...mockProps} />,
        {
          useGlobalStore: false,
          preloadedState: initialPreloadedState,
        }
      );
      await user.click(
        screen.getAllByRole('button', {
          name: 'Delete import',
        })[0]
      );

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          id: 1,
          showDeleteConfirmation: true,
          submissionStatus: 'pending',
        },
        type: 'massUploadSlice/onUpdateImportToDelete',
      });
    });

    it('should dispatch success toast if request succeeds', async () => {
      useLazyDeleteMassUploadQuery.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isSuccess: true,
          isError: false,
        },
      ]);
      const { mockedStore } = renderWithRedux(
        <SubmissionsTable {...mockProps} />,
        {
          useGlobalStore: false,
          preloadedState: initialPreloadedState,
        }
      );

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: { id: null, status: 'SUCCESS', title: 'Import deleted' },
        type: 'toasts/add',
      });
    });

    it('should dispatch error toast if request fails', async () => {
      useLazyDeleteMassUploadQuery.mockReturnValue([
        jest.fn(),
        {
          isLoading: false,
          isSuccess: false,
          isError: true,
        },
      ]);
      const { mockedStore } = renderWithRedux(
        <SubmissionsTable {...mockProps} />,
        {
          useGlobalStore: false,
          preloadedState: initialPreloadedState,
        }
      );

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: {
          id: null,
          status: 'ERROR',
          title: 'Error deleting import',
          description: 'Please try again.',
        },
        type: 'toasts/add',
      });
    });

    it('should dispatch action to close confirmation modal on click of Cancel', async () => {
      const user = userEvent.setup();
      const { mockedStore } = renderWithRedux(
        <SubmissionsTable {...mockProps} />,
        {
          useGlobalStore: false,
          preloadedState: {
            massUploadSlice: {
              ...initialPreloadedState.massUploadSlice,
              deleteImport: {
                ...initialPreloadedState.massUploadSlice.deleteImport,
                attachmentId: 1,
                isConfirmationModalOpen: true,
              },
            },
          },
        }
      );

      await user.click(
        screen.getAllByRole('button', {
          name: 'Cancel',
        })[0]
      );

      expect(mockedStore.dispatch).toHaveBeenCalledWith({
        payload: { id: 1, showDeleteConfirmation: false },
        type: 'massUploadSlice/onUpdateImportToDelete',
      });
    });

    it('should call deleteMassUpload on click of Delete and track event', async () => {
      const user = userEvent.setup();
      renderWithRedux(<SubmissionsTable {...mockProps} />, {
        useGlobalStore: false,
        preloadedState: {
          massUploadSlice: {
            deleteImport: {
              attachmentId: 1,
              isConfirmationModalOpen: true,
              submissionStatus: 'successful',
            },
          },
        },
      });

      await user.click(
        screen.getAllByRole('button', {
          name: 'Delete',
        })[0]
      );

      expect(mockDeleteMassUpload).toHaveBeenCalledWith({
        attachmentId: 1,
        importType: 'growth_and_maturation',
      });
      expect(mockTrackEvent).toHaveBeenCalledWith(
        'Forms - Growth and maturation - CSV Importer - Delete Import Confirmation Click',
        { SubmissionStatus: 'successful' }
      );
    });
  });
});
