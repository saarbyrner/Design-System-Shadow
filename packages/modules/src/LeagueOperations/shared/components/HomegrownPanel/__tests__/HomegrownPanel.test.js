import i18n from 'i18next';
import * as redux from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { setI18n } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import {
  getIsHomegrownPanelOpen,
  getHomegrownSubmission,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/homegrownSelectors';
import {
  REDUCER_KEY as HOMEGROWN_SLICE,
  initialState,
} from '@kitman/modules/src/LeagueOperations/shared/redux/slices/homegrownSlice';
import {
  mockSubmission,
  data,
} from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_homegrown_list';
import {
  useCreateHomegrownSubmissionMutation,
  useConfirmHomegrownFileUploadMutation,
  useUpdateHomegrownSubmissionMutation,
  useArchiveHomegrownSubmissionMutation,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import sendHomegrownSubmissionNotification from '@kitman/modules/src/LeagueOperations/shared/services/homegrown/sendHomegrownSubmissionNotification';
import { useGetCurrentUserQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { uploadFileToS3 } from '@kitman/services/src/services/documents/generic/redux/services/apis/uploadFileToS3';

import HomegrownPanel from '..';

const i18nT = i18nextTranslateStub();

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/selectors/homegrownSelectors',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/selectors/homegrownSelectors'
    ),
    getIsHomegrownPanelOpen: jest.fn(),
    getHomegrownSubmission: jest.fn(),
  })
);

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
    ),
    useCreateHomegrownSubmissionMutation: jest.fn(),
    useUpdateHomegrownSubmissionMutation: jest.fn(),
    useConfirmHomegrownFileUploadMutation: jest.fn(),
    useArchiveHomegrownSubmissionMutation: jest.fn(),
  })
);

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  useGetCurrentUserQuery: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/services/homegrown/sendHomegrownSubmissionNotification'
);

jest.mock(
  '@kitman/services/src/services/documents/generic/redux/services/apis/uploadFileToS3'
);

// Mock React useState to simulate files being selected
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((initialValue) => {
    if (initialValue === null) {
      // This is likely homegrownFile or certificationFile state
      // Create a mock file object without referencing File constructor
      const mockFile = {
        name: 'test.png',
        type: 'image/png',
        size: 1024,
        lastModified: Date.now(),
      };
      return [
        {
          file: mockFile,
        },
        jest.fn(),
      ];
    }
    return [initialValue, jest.fn()];
  }),
}));

const props = {
  t: i18nT,
};

const mockSelectors = ({
  isHomegrownPanelOpen = false,
  homegrownSubmission = initialState.homegrownSubmission,
}) => {
  getIsHomegrownPanelOpen.mockReturnValue(isHomegrownPanelOpen);
  getHomegrownSubmission.mockReturnValue(homegrownSubmission);
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  [HOMEGROWN_SLICE]: initialState,
  globalApi: {
    useGetCurrentUserQuery: jest.fn(),
  },
};

const renderComponent = () =>
  render(
    <Provider store={storeFake(defaultStore)}>
      <HomegrownPanel {...props} />
    </Provider>
  );

describe('<HomegrownPanel />', () => {
  const mockCreate = jest.fn(() => Promise.resolve({ data: data[0] }));
  const mockEdit = jest.fn(() => Promise.resolve({ data: data[0] }));
  const mockConfirm = jest.fn();
  const mockArchive = jest.fn();
  let useDispatchSpy;
  let mockDispatch;

  useGetCurrentUserQuery.mockReturnValue({
    isLoading: false,
    data: { id: 1 },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useCreateHomegrownSubmissionMutation.mockReturnValue([mockCreate, {}]);
    useUpdateHomegrownSubmissionMutation.mockReturnValue([mockEdit, {}]);
    useConfirmHomegrownFileUploadMutation.mockReturnValue([mockConfirm, {}]);
    useArchiveHomegrownSubmissionMutation.mockReturnValue([mockArchive, {}]);
    useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    mockDispatch = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatch);
  });

  describe('PANEL IS NOT OPEN', () => {
    beforeEach(() => {
      mockSelectors({ isHomegrownPanelOpen: false });
      renderComponent();
    });
    it('does not render', () => {
      expect(() =>
        screen.getByText('Upload homegrown document (Optional)')
      ).toThrow();
      expect(() => screen.getByTestId('CloseIcon')).toThrow();
    });
  });

  describe('PANEL IS OPEN', () => {
    describe('THE FORM IS EMPTY', () => {
      beforeEach(() => {
        mockSelectors({ isHomegrownPanelOpen: true });
        renderComponent();
      });
      it('renders the form', () => {
        expect(screen.getByLabelText('Title')).toBeInTheDocument();
        expect(screen.getByLabelText('Certified by')).toBeInTheDocument();
        expect(
          screen.getByText('Upload homegrown document (Optional)')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Upload the club certification form')
        ).toBeInTheDocument();
      });
    });
    describe('THE FORM IS COMPLETE', () => {
      beforeEach(() => {
        mockSelectors({
          isHomegrownPanelOpen: true,
          homegrownSubmission: mockSubmission,
        });
        renderComponent();
      });
      it('correctly maps submission to inputs', () => {
        expect(screen.getByLabelText('Title')).toHaveValue('Test Submission');
        expect(screen.getByLabelText('Certified by')).toHaveValue(
          'Louis van Gaal'
        );
      });
    });
    describe('A NEW SUBMISSION', () => {
      beforeEach(() => {
        mockSelectors({
          isHomegrownPanelOpen: true,
          homegrownSubmission: mockSubmission,
        });
        sendHomegrownSubmissionNotification.mockResolvedValue();
        renderComponent();
      });
      it('correctly calls the create submission endpoint', async () => {
        const user = userEvent.setup();
        const submitBtn = screen.getByRole('button', { name: 'Submit' });
        expect(submitBtn).toBeEnabled();
        await user.click(submitBtn);
        expect(mockCreate).toHaveBeenCalledTimes(1);
        expect(mockCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            certified_by: 'Louis van Gaal',
            certified_document: {
              attachment: {
                filesize: 82157,
                filetype: 'image/png',
                original_filename: 'certified.png',
              },
              title: 'Approval.pdf',
            },
            homegrown_document: {
              attachment: {
                filesize: 282562,
                filetype: 'image/png',
                original_filename: 'homegrown.png',
              },
              title: 'Homegrown.pdf',
            },
            submitted_by: 1,
            title: 'Test Submission',
          })
        );
        expect(sendHomegrownSubmissionNotification).toHaveBeenCalledWith(1);
      });
    });
    describe('A SUBMISSION IS EDITED', () => {
      beforeEach(() => {
        mockSelectors({
          isHomegrownPanelOpen: true,
          homegrownSubmission: { id: 1, ...mockSubmission },
        });
        sendHomegrownSubmissionNotification.mockResolvedValue();
        renderComponent();
      });
      it('correctly calls the edit submission endpoint', async () => {
        const user = userEvent.setup();
        const submitBtn = screen.getByRole('button', { name: 'Submit' });
        expect(submitBtn).toBeEnabled();
        await user.click(submitBtn);
        expect(mockEdit).toHaveBeenCalledTimes(1);
        expect(mockEdit).toHaveBeenCalledWith({
          id: 1,
          skipInvalidation: {
            attachment: {
              filesize: 82157,
              filetype: 'image/png',
              original_filename: 'certified.png',
            },
            title: 'Approval.pdf',
          },
          submission: {
            certified_by: 'Louis van Gaal',
            certified_document: {
              attachment: {
                filesize: 82157,
                filetype: 'image/png',
                original_filename: 'certified.png',
              },
              title: 'Approval.pdf',
            },
            homegrown_document: {
              attachment: {
                filesize: 282562,
                filetype: 'image/png',
                original_filename: 'homegrown.png',
              },
              title: 'Homegrown.pdf',
            },
            submitted_by: 1,
            title: 'Test Submission',
          },
        });
        expect(sendHomegrownSubmissionNotification).toHaveBeenCalledWith(1);
      });
    });
    describe('Email notifications fail', () => {
      beforeEach(() => {
        mockSelectors({
          isHomegrownPanelOpen: true,
          homegrownSubmission: mockSubmission,
        });
        sendHomegrownSubmissionNotification.mockRejectedValue();
        renderComponent();
      });
      it('Toast is dispatched', async () => {
        const user = userEvent.setup();
        const submitBtn = screen.getByRole('button', { name: 'Submit' });
        expect(submitBtn).toBeEnabled();
        await user.click(submitBtn);
        expect(mockCreate).toHaveBeenCalledTimes(1);
        expect(mockCreate).toHaveBeenCalledWith({
          certified_by: 'Louis van Gaal',
          certified_document: {
            attachment: {
              filesize: 82157,
              filetype: 'image/png',
              original_filename: 'certified.png',
            },
            title: 'Approval.pdf',
          },
          homegrown_document: {
            attachment: {
              filesize: 282562,
              filetype: 'image/png',
              original_filename: 'homegrown.png',
            },
            title: 'Homegrown.pdf',
          },
          submitted_by: 1,
          title: 'Test Submission',
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            status: 'ERROR',
            title: 'Error sending notification',
          },
          type: 'toasts/add',
        });
      });
    });
    describe('FORM VALIDATION', () => {
      beforeEach(() => {
        mockSelectors({
          isHomegrownPanelOpen: true,
          homegrownSubmission: {
            ...mockSubmission,
            id: 1,

            certified_document: null,
          },
        });
        renderComponent();
      });

      it('submit button becomes disabled when form is invalid', async () => {
        const submitBtn = screen.getByRole('button', { name: 'Submit' });
        expect(submitBtn).toBeDisabled();
      });

      it('submit button becomes enabled when form is valid', async () => {
        mockSelectors({
          isHomegrownPanelOpen: true,
          homegrownSubmission: {
            ...mockSubmission,
            id: 1,
          },
        });
        renderComponent();
        const submitBtn = screen.getByRole('button', { name: 'Submit' });
        expect(submitBtn).toBeEnabled();
      });
    });

    describe('SUBMISSION ERROR WHEN FILE UPLOAD FAILS', () => {
      let mockConfirmFileUpload;
      let mockArchiveSubmission;

      beforeEach(() => {
        // Create mock functions that will reject
        mockConfirmFileUpload = jest.fn(() =>
          Promise.reject(new Error('Confirm failed'))
        );
        mockArchiveSubmission = jest.fn();

        mockSelectors({
          isHomegrownPanelOpen: true,
          homegrownSubmission: {
            ...mockSubmission,
            id: 1,
            // Use the original mockSubmission which has file properties
            homegrown_document: {
              file: {
                filename: 'homegrown.png',
                fileType: 'image/png',
                fileSize: 282562,
                id: 'pu7c03icy',
              },
              state: 'SUCCESS',
              message: '282.6 kB • Complete',
            },
            certified_document: {
              file: {
                filename: 'certified.png',
                fileType: 'image/png',
                fileSize: 82157,
                id: 'dfutci5tr',
              },
              state: 'SUCCESS',
              message: '82.2 kB • Complete',
            },
          },
        });

        // Mock file upload to reject - this simulates the error when upload fails
        uploadFileToS3.mockRejectedValue(new Error('Upload failed'));
        useConfirmHomegrownFileUploadMutation.mockReturnValue([
          mockConfirmFileUpload,
          {},
        ]);
        useArchiveHomegrownSubmissionMutation.mockReturnValue([
          mockArchiveSubmission,
          {},
        ]);
        sendHomegrownSubmissionNotification.mockRejectedValue(
          new Error('Notification failed')
        );
        renderComponent();
      });

      it('handles submission error when file upload fails and calls archiveHomegrownSubmission', async () => {
        const user = userEvent.setup();
        const submitBtn = screen.getByRole('button', { name: 'Submit' });
        expect(submitBtn).toBeEnabled();

        await user.click(submitBtn);

        // Verify that the update mutation was called
        expect(mockEdit).toHaveBeenCalledTimes(1);

        // Verify that archiveHomegrownSubmission is called when upload fails
        expect(mockArchiveSubmission).toHaveBeenCalledWith(1);

        // Verify error toast is dispatched
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: {
            status: 'ERROR',
            title: 'There has been an issue uploading your submission',
          },
          type: 'toasts/add',
        });
      });
    });
  });
});
