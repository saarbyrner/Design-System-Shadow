import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  useGetPermissionsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import {
  useSearchPastAthletesQuery,
  useGetDocumentNoteCategoriesQuery,
  useGetMedicalAttachmentsFileTypesQuery,
  useSearchMedicalEntityAttachmentsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import {
  useFetchFavoriteContactsQuery,
  useGetUnreadCountQuery,
  useMakeContactFavoriteMutation,
  useDeleteContactFavoriteMutation,
  useCreatePresignedAttachmentsMutation,
  useUploadFileToS3Mutation,
  useConfirmFileUploadMutation,
  useSendElectronicFileMutation,
} from '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import SendDrawer from '@kitman/modules/src/ElectronicFiles/ListElectronicFiles/src/components/SendDrawer';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/Medical/shared/redux/services/medicalShared');
jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

let component;

const props = {
  t: i18nextTranslateStub(),
};

const mockMakeContactFavorite = jest.fn();
const mockDeleteContactFavorite = jest.fn();
const mockCreatePresignedAttachments = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({ attachments: [] }),
}));
const mockUploadFileToS3Mutation = jest.fn();
const mockConfirmFileUploadMutation = jest.fn();
const mockSendElectronicFileMutation = jest.fn().mockImplementation(() => ({
  unwrap: () => Promise.resolve({ attachments: [] }),
}));

let mockDispatch = jest.fn();
const initialState = { ...mockState.sendDrawerSlice, open: true };

const renderComponent = (state = initialState) => {
  const store = storeFake({
    sendDrawerSlice: state,
  });
  mockDispatch = store.dispatch;
  return render(
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <SendDrawer {...props} />
      </LocalizationProvider>
    </Provider>
  );
};

const rerenderComponent = (state = initialState) => {
  const store = storeFake({
    sendDrawerSlice: state,
  });
  mockDispatch = store.dispatch;
  return component.rerender(
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <SendDrawer {...props} />
      </LocalizationProvider>
    </Provider>
  );
};

describe('<SendDrawer />', () => {
  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        efile: {
          canManageContacts: true,
        },
        medical: {
          documents: {
            canView: false,
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
    useSearchPastAthletesQuery.mockReturnValue({
      data: { athletes: [] },
      error: false,
      isLoading: false,
    });
    useGetMedicalAttachmentsFileTypesQuery.mockReturnValue({
      data: [],
      error: false,
      isLoading: false,
    });
    useGetDocumentNoteCategoriesQuery.mockReturnValue({
      data: [],
      error: false,
      isLoading: false,
    });
    useSearchMedicalEntityAttachmentsQuery.mockReturnValue({
      data: {
        entity_attachments: [],
        meta: { pagination: { next_token: null } },
      },
      error: false,
      isLoading: false,
    });
    useFetchFavoriteContactsQuery.mockReturnValue({
      data: [],
      error: false,
      isLoading: false,
    });
    useGetUnreadCountQuery.mockReturnValue({
      data: { unread: 0 },
      isSuccess: true,
    });
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
  });

  it('renders correctly', () => {
    component = renderComponent();

    expect(screen.getByText('Send eFile')).toBeInTheDocument();
    expect(screen.getByText('Sending to')).toBeInTheDocument();
    expect(screen.getByLabelText('Saved contact')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject')).toBeInTheDocument();
    expect(screen.getByLabelText('Include cover page')).toBeInTheDocument();
    expect(screen.getByText('Attach file(s)')).toBeInTheDocument();
    expect(screen.getByText('From your computer')).toBeInTheDocument();
    expect(screen.queryByText('From documents')).not.toBeInTheDocument();
  });

  it('calls updateValidation when Send button is clicked', async () => {
    const user = userEvent.setup();

    component = renderComponent();

    const sendButton = screen.getByRole('button', { name: /send/i });

    await user.click(sendButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        savedContact: ['Contact is required'],
        message: ['Message is required'],
        files: ['At least one file is required'],
      },
      type: 'sendDrawerSlice/updateValidation',
    });

    rerenderComponent({
      ...initialState,
      validation: {
        ...initialState.validation,
        errors: {
          savedContact: ['Contact is required'],
          message: ['Message is required'],
          files: ['At least one file is required'],
        },
      },
    });

    expect(screen.getByText('Contact is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
    expect(
      screen.getByText('At least one file is required')
    ).toBeInTheDocument();
  });

  describe('Permissions', () => {
    describe('permissions.medical.documents.canView', () => {
      it('"From documents" section is hidden when permission is false', () => {
        renderComponent();
        expect(screen.queryByText('From documents')).not.toBeInTheDocument();
      });
      it('"From documents" section is shown when permission is true', () => {
        useGetPermissionsQuery.mockReturnValue({
          data: {
            general: {
              pastAthletes: {
                canView: false,
              },
            },
            efile: {
              canManageContacts: true,
            },
            medical: {
              documents: {
                canView: true,
              },
            },
          },
          isSuccess: true,
        });

        renderComponent();
        expect(screen.getByText('From documents')).toBeInTheDocument();
      });
    });
  });
});
