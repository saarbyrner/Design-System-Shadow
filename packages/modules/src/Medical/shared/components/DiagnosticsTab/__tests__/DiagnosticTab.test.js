import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { medicalGlobalAddButtonMenuItems } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { data } from './mocks/getDiagnostics';
import DiagnosticsTab from '../index';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
  addDiagnosticSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addDiagnosticAttachmentSidePanel: {
    isOpen: false,
    diagnosticId: null,
  },
  medicalHistory: {},
  addMedicalNotePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addModificationSidePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addTreatmentsSidePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addAllergySidePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addMedicalAlertSidePanel: {
    isOpen: false,
    initialInfo: {},
  },
  addProcedureSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addConcussionTestResultsSidePanel: {
    isOpen: false,
    initialInfo: {
      testProtocol: 'NPC',
    },
  },
  addTUESidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: false,
    },
  },
  addWorkersCompSidePanel: {
    initialInfo: {},
    isOpen: false,
    page: 1,
    submitModal: {
      isOpen: true,
      formState: {},
    },
    claimInformation: {
      personName: null,
      contactNumber: null,
      policyNumber: null,
      lossDate: null,
      lossTime: null,
      lossCity: null,
      lossState: null,
      lossJurisdiction: null,
      lossDescription: null,
    },
    additionalInformation: {
      firstName: null,
      lastName: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zipCode: null,
      phoneNumber: null,
    },
    showPrintPreview: {
      card: false,
      sidePanel: false,
    },
  },
  addOshaFormSidePanel: {
    isOpen: false,
    page: 1,
    initialInformation: {},
    employeeDrInformation: {},
    caseInformation: {},
    showPrintPreview: {
      card: false,
      sidePanel: false,
    },
  },
});

const props = {
  diagnosticPermissions: {
    canEdit: true,
    canCreate: true,
    canView: true,
  },
  t: i18nextTranslateStub(),
};

const renderTestComponent = (passedProps = {}) => {
  return (
    <Provider store={store}>
      <DiagnosticsTab {...props} {...passedProps} />
    </Provider>
  );
};

describe('<DiagnosticsTab />', () => {
  beforeEach(() => {
    window.setFlag('pm-show-tue', true);
    usePermissions.mockReturnValue({
      permissions: {
        medical: {
          diagnostics: {
            canCreate: true,
          },
          documents: { canCreate: false },
          alerts: { canCreate: false },
          allergies: { canCreate: false },
          privateNotes: { canCreate: false },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
  });

  it('renders the correct content', async () => {
    act(() => {
      render(renderTestComponent());
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('DiagnosticCardList|Container')
      ).toBeInTheDocument();
    });
  });

  describe('when the initial request is successful', () => {
    it('renders the diagnostics tab', async () => {
      server.use(
        rest.post('/medical/diagnostics/search', (req, res, ctx) =>
          res(ctx.json(data))
        )
      );

      act(() => {
        render(renderTestComponent());
      });

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });
  });

  describe('when the initial request is successful and there are no diagnostics', () => {
    it('renders the no diagnostics text', async () => {
      // Stub the request to simulate an empty diagnostic response
      server.use(
        rest.post('/medical/diagnostics/search', (req, res, ctx) =>
          res(ctx.json({ diagnostics: [], meta: { next_page: null } }))
        )
      );

      act(() => {
        render(renderTestComponent());
      });

      await waitFor(() => {
        expect(
          screen.getByText('No diagnostics for this period')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when the initial request fails', () => {
    it('displays the error feedback when the request fails', async () => {
      // Stub the request to simulate a failing request
      server.use(
        rest.post('/medical/diagnostics/search', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      render(
        <Provider store={store}>
          <DiagnosticsTab {...props} />
        </Provider>
      );

      await waitFor(
        () => expect(screen.getByTestId('AppStatus-error')).toBeInTheDocument(),
        { timeout: 2000 }
      );
    });
  });

  describe('[feature-flag] medical-global-add-button-fix', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: {
            diagnostics: {
              canCreate: true,
            },
            documents: { canCreate: false },
            alerts: { canCreate: false },
            allergies: { canCreate: false },
            privateNotes: { canCreate: false },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
    });

    it('renders correctly when FF is off', () => {
      window.featureFlags['medical-global-add-button-fix'] = false;

      render(
        <Provider store={store}>
          <DiagnosticsTab {...props} scopeToLevel="issue" />
        </Provider>
      );

      medicalGlobalAddButtonMenuItems
        .filter((item) => !['diagnostic', 'document'].includes(item.id))
        .forEach((item) => {
          expect(screen.queryAllByText(item.modalTitle).length).toEqual(0);
        });
    });

    it('renders correctly when FF is on', async () => {
      window.featureFlags['medical-global-add-button-fix'] = true;

      render(
        <Provider store={store}>
          <DiagnosticsTab
            {...props}
            scopeToLevel="issue"
            athleteData={{ id: 1 }}
          />
        </Provider>
      );

      await waitFor(() => {
        medicalGlobalAddButtonMenuItems
          .filter((item) => item.id !== 'document')
          .forEach((item) => {
            expect(
              screen.getAllByText(item.modalTitle).length
            ).toBeGreaterThanOrEqual(1);
          });
      });

      window.featureFlags['medical-global-add-button-fix'] = false;
    });
  });
});
