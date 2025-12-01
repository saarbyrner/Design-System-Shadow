import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { MockedOrganisationContextProvider } from '@kitman/common/src/contexts/OrganisationContext/__tests__/testUtils';
import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import {
  mockedDiagnosticResultsContextValue,
  mockedDiagnosticRadiologyResultsContextValue,
  MockeddiagnosticResultsContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticResultsContext/utils/mocks';
import DiagnosticOverviewTab from '..';

describe('<DiagnosticOverviewTab />', () => {
  beforeEach(() => {
    // eslint-disable-next-line dot-notation
    window.featureFlags['redox'] = true;
    window.featureFlags['redox-iteration-1'] = true;
  });
  afterEach(() => {
    window.featureFlags = {};
  });
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    addDiagnosticAttachmentSidePanel: {
      isOpen: false,
    },
    addDiagnosticSidePanel: {
      isOpen: false,
    },
    addMedicalNotePanel: {
      isOpen: false,
      initialInfo: {
        isAthleteSelectable: true,
      },
    },
    medicalApi: {},
    toasts: [],
    medicalHistory: {},
  });

  const props = {
    currentDiagnostic: {
      annotation: null,
      attached_links: [],
      attachments: [
        {
          audio_file: false,
          confirmed: true,
          created_by: {
            firstname: 'Doctor',
            fullname: 'Doctor Kevorkian',
            id: 126841,
            lastname: 'Kevorkian',
          },
          download_url: 'http://s3:9000/some_awesome/download/url/',
          filename: 'filePond.png',
          filesize: 16170,
          filetype: 'image/png',
          id: 159875,
          presigned_post: null,
          url: 'https://s3:9000/some_awesome/url/',
        },
      ],
      created_by: {
        fullname: 'Dr. K',
        id: 950754,
      },
      diagnostic_date: '2022-05-15T23:00:00Z',
      id: 95730,
      is_medication: false,
      issue_occurrences: [
        {
          full_pathology: 'Adductor strain [Right]',
          id: 2,
          issue_type: 'Injury',
          occurrence_date: '2022-05-06T00:00:00+01:00',
        },
      ],
      medical_meta: {},
      restricted_to_doc: false,
      restricted_to_psych: false,
      type: '3D Analysis ',
      organisation_id: 37,
    },
    diagnosticId: 95730,
    t: i18nextTranslateStub(),
  };

  it('renders the component', () => {
    render(
      <Provider store={store}>
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { id: 37 },
          }}
        >
          <MockedDiagnosticContextProvider
            diagnosticContext={mockedDiagnosticContextValue}
          >
            <DiagnosticOverviewTab {...props} />
          </MockedDiagnosticContextProvider>
        </MockedOrganisationContextProvider>
      </Provider>
    );
    expect(screen.getByTestId('diagnosticOverviewTab')).toBeInTheDocument();
    expect(screen.getAllByTestId('AdditionalInfo|AuthorDetails')).toHaveLength(
      3
    );
    expect(
      screen.getByTestId('AddDiagnosticAttachmentSidePanel')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('Attachments|CurrentAttachmentList')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('LinkedIssue|LinkedIssueSummary')
    ).toBeInTheDocument();
  });

  it('renders the Radiology result component when flags and correct resultType value are present', () => {
    render(
      <Provider store={store}>
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { id: 37 },
          }}
        >
          <MockedDiagnosticContextProvider
            diagnosticContext={mockedDiagnosticContextValue}
          >
            <MockeddiagnosticResultsContextProvider
              diagnosticResultsContext={
                mockedDiagnosticRadiologyResultsContextValue
              }
            >
              <DiagnosticOverviewTab {...props} />
            </MockeddiagnosticResultsContextProvider>
          </MockedDiagnosticContextProvider>
        </MockedOrganisationContextProvider>
      </Provider>
    );
    expect(
      screen.getByRole('checkbox').parentNode.parentNode.querySelector('h2')
    ).toHaveTextContent('Results');
    expect(
      screen.getByTestId('DiagnosticOverviewTab|RadiologyReport')
    ).toBeInTheDocument();
  });

  it('renders the LabReport result component when flags and correct resultType value are present', () => {
    render(
      <Provider store={store}>
        <MockedDiagnosticContextProvider
          diagnosticContext={mockedDiagnosticContextValue}
        >
          <MockeddiagnosticResultsContextProvider
            diagnosticResultsContext={mockedDiagnosticResultsContextValue}
          >
            <DiagnosticOverviewTab {...props} />
          </MockeddiagnosticResultsContextProvider>
        </MockedDiagnosticContextProvider>
      </Provider>
    );
    expect(
      screen.getByRole('checkbox').parentNode.parentNode.querySelector('h2')
    ).toHaveTextContent('Results');
    expect(
      screen.getByTestId('DiagnosticOverviewTab|LabReport')
    ).toBeInTheDocument();
  });

  it('does not render a result component when flags are present but resultType value is not', () => {
    const reportLabType = Object.assign(
      {},
      mockedDiagnosticResultsContextValue.resultBlocks[0]
    );
    reportLabType.type = null;
    render(
      <Provider store={store}>
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { id: 37 },
          }}
        >
          <MockedDiagnosticContextProvider
            diagnosticContext={mockedDiagnosticContextValue}
          >
            <MockeddiagnosticResultsContextProvider
              diagnosticResultsContext={{
                resultBlocks: [reportLabType],
              }}
            >
              <DiagnosticOverviewTab {...props} />
            </MockeddiagnosticResultsContextProvider>
          </MockedDiagnosticContextProvider>
        </MockedOrganisationContextProvider>
      </Provider>
    );
    expect(
      screen.queryByTestId('DiagnosticOverviewTab|RadiologyReport')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('DiagnosticOverviewTab|LabReport')
    ).not.toBeInTheDocument();
  });

  it('does not render a result component when flags are not present but resultType value is', () => {
    window.featureFlags = {};
    render(
      <Provider store={store}>
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { id: 37 },
          }}
        >
          <MockedDiagnosticContextProvider
            diagnosticContext={mockedDiagnosticContextValue}
          >
            <MockeddiagnosticResultsContextProvider
              diagnosticResultsContext={mockedDiagnosticResultsContextValue}
            >
              <DiagnosticOverviewTab {...props} />
            </MockeddiagnosticResultsContextProvider>
          </MockedDiagnosticContextProvider>
        </MockedOrganisationContextProvider>
      </Provider>
    );
    expect(
      screen.queryByTestId('DiagnosticOverviewTab|RadiologyReport')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('DiagnosticOverviewTab|LabReport')
    ).not.toBeInTheDocument();
  });

  it('does not render a result component when no flags or a resultType value is present', () => {
    window.featureFlags = {};
    render(
      <Provider store={store}>
        <MockedOrganisationContextProvider
          organisationContext={{
            organisation: { id: 37 },
          }}
        >
          <MockedDiagnosticContextProvider
            diagnosticContext={mockedDiagnosticContextValue}
          >
            <MockeddiagnosticResultsContextProvider
              diagnosticResultsContext={{
                resultBlocks: null,
              }}
            >
              <DiagnosticOverviewTab {...props} />
            </MockeddiagnosticResultsContextProvider>
          </MockedDiagnosticContextProvider>
        </MockedOrganisationContextProvider>
      </Provider>
    );
    expect(
      screen.queryByTestId('DiagnosticOverviewTab|RadiologyReport')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('DiagnosticOverviewTab|LabReport')
    ).not.toBeInTheDocument();
  });
});
