import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { medicalGlobalAddButtonMenuItems } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import ProceduresTab from '..';

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
  addProcedureSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  medicalApi: {},
  medicalHistory: {},
  addDiagnosticSidePanel: {
    isOpen: false,
    initialInfo: {},
  },
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

describe('<ProceduresTab />', () => {
  const i18nT = i18nextTranslateStub();
  const props = {
    t: i18nT,
  };

  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        medical: {
          procedures: {
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

  it('renders the component', () => {
    render(
      <Provider store={store}>
        <ProceduresTab {...props} />{' '}
      </Provider>
    );
    expect(screen.getByTestId('ProceduresTab|Tab')).toBeInTheDocument();
  });

  it('opens the AddProcedureSidePanel when Add procedure button pressed', async () => {
    render(
      <Provider store={store}>
        <ProceduresTab {...props} />
      </Provider>
    );
    userEvent.click(screen.getAllByText('Add procedure')[0]);
    expect(
      screen.getByTestId('AddProcedureSidePanel|Parent')
    ).toBeInTheDocument();
  });

  describe('[feature-flag] medical-global-add-button-fix', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: {
            procedures: {
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
          <ProceduresTab {...props} scopeToLevel="issue" />
        </Provider>
      );

      medicalGlobalAddButtonMenuItems
        .filter((item) => !['procedure', 'document'].includes(item.id))
        .forEach((item) => {
          expect(screen.queryAllByText(item.modalTitle).length).toEqual(0);
        });
    });

    it('renders correctly when FF is on', async () => {
      window.featureFlags['medical-global-add-button-fix'] = true;
      window.setFlag('pm-show-tue', true);

      render(
        <Provider store={store}>
          <ProceduresTab
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

    it('renders correctly when FF is on and pm-show-tue is off', async () => {
      window.featureFlags['medical-global-add-button-fix'] = true;
      window.setFlag('pm-show-tue', false);

      render(
        <Provider store={store}>
          <ProceduresTab
            {...props}
            scopeToLevel="issue"
            athleteData={{ id: 1 }}
          />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.queryByText('Add TUE')).not.toBeInTheDocument();
      });

      window.featureFlags['medical-global-add-button-fix'] = false;
    });
  });
});
