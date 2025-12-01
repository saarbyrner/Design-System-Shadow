import { axios } from '@kitman/common/src/utils/services';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';
import {
  defaultMedicalPermissions,
  mockedDefaultPermissionsContextValue,
} from '@kitman/modules/src/Medical/shared/utils/testUtils';
import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import App from '../App';

describe('<App />', () => {
  const props = {
    currentDiagnostic: {
      attached_links: [],
      attachments: [
        {
          audio_file: false,
          confirmed: true,
          created_by: {
            id: 126841,
            firstname: 'Tom',
            lastname: 'Brady',
            fullname: 'Tom Brady',
          },
          download_url: 'http://s3:9000/awesomeURL',
          filename: 'awesome file name',
          filesize: 4402253,
          filetype: 'video/quicktime',
          id: 160790,
          presigned_post: null,
          url: 'http://s3:9000/injpro-staging/kitman/awesomeURL',
        },
      ],
      created_by: { id: 126841, fullname: 'Greg Levine-Rozenvayn' },
      diagnostic_date: '2022-06-02T23:00:00Z',
      id: 168870,
      is_medication: false,
      medical_meta: {},
      restricted_to_doc: false,
      restricted_to_psych: false,
      type: '3D Analysis ',
    },
    diagnosticId: 43214,
    t: i18nextTranslateStub(),
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });
  const store = storeFake({
    addDiagnosticSidePanel: {
      isOpen: false,
    },
    addDiagnosticAttachmentSidePanel: {
      isOpen: false,
    },
    addMedicalNotePanel: {
      isOpen: false,
      initialInfo: {
        isAthleteSelectable: true,
      },
    },
    medicalApi: {},
    medicalSharedApi: {},
    toasts: [],
    medicalHistory: {},
  });

  it('renders a loader initially', () => {
    render(
      <Provider store={store}>
        <MockedPermissionContextProvider
          permissionsContext={mockedDefaultPermissionsContextValue}
        >
          <MockedDiagnosticContextProvider
            diagnosticContext={mockedDiagnosticContextValue}
          >
            <App {...props} />
          </MockedDiagnosticContextProvider>
        </MockedPermissionContextProvider>
      </Provider>
    );

    expect(screen.getByTestId('DelayedLoadingFeedback')).toBeInTheDocument();
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'get').mockImplementation(() => Promise.reject());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('shows an error message', async () => {
      render(
        <Provider store={store}>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissionsRequestStatus: 'FAILURE',
            }}
          >
            <MockedDiagnosticContextProvider
              diagnosticContext={mockedDiagnosticContextValue}
            >
              <App {...props} />
            </MockedDiagnosticContextProvider>
          </MockedPermissionContextProvider>
        </Provider>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId('DelayedLoadingFeedback')
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    });
  });

  describe('when the initial request is successful', () => {
    beforeEach(() => {
      jest
        .spyOn(axios, 'get')
        .mockImplementation(() => Promise.resolve({ data: mockAthleteData }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('[permissions] diagnostics permissions', () => {
      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedDefaultPermissionsContextValue,
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...defaultMedicalPermissions,
                    diagnostics: {
                      canView: true,
                    },
                  },
                },
              }}
            >
              <MockedDiagnosticContextProvider
                diagnosticContext={mockedDiagnosticContextValue}
              >
                <App {...props} />
              </MockedDiagnosticContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitFor(() => {
          expect(
            screen.queryByTestId('DelayedLoadingFeedback')
          ).not.toBeInTheDocument();
        });

        // Title of app header
        expect(screen.getByText('John Doe - 3D Analysis')).toBeInTheDocument();

        expect(
          await screen.findByRole('tabpanel', { name: 'Diagnostic Overview' })
        ).toBeInTheDocument();
      });
    });
    describe('Notes', () => {
      it('renders the correct content', async () => {
        render(
          <Provider store={store}>
            <MockedPermissionContextProvider
              permissionsContext={{
                ...mockedDefaultPermissionsContextValue,
                permissions: {
                  ...mockedDefaultPermissionsContextValue.permissions,
                  medical: {
                    ...defaultMedicalPermissions,
                    diagnostics: {
                      canView: true,
                    },
                    issues: {
                      canView: true,
                    },
                  },
                },
              }}
            >
              <MockedDiagnosticContextProvider
                diagnosticContext={mockedDiagnosticContextValue}
              >
                <App {...props} />
              </MockedDiagnosticContextProvider>
            </MockedPermissionContextProvider>
          </Provider>
        );

        await waitFor(() => {
          expect(
            screen.queryByTestId('DelayedLoadingFeedback')
          ).not.toBeInTheDocument();
        });

        // Title of app header
        expect(screen.getByText('John Doe - 3D Analysis')).toBeInTheDocument();

        expect(
          await screen.findByRole('tabpanel', { name: 'Diagnostic Overview' })
        ).toBeInTheDocument();
      });
    });
  });
});
