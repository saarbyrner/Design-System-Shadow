import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { medicalGlobalAddButtonMenuItems } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import MedicalSidePanels from '../MedicalSidePanels';

jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

const props = {
  athleteData: {
    id: 1,
  },
  scopeToLevel: 'issue',
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
  medicalHistory: {},
});

describe('MedicalSidePanels', () => {
  beforeEach(() => {
    usePermissions.mockReturnValue({
      permissions: {
        medical: {
          documents: { canCreate: false },
          alerts: { canCreate: false },
          allergies: { canCreate: false },
          privateNotes: { canCreate: false },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    });
  });
  it('renders correctly', () => {
    window.setFlag('pm-show-tue', true);
    render(
      <Provider store={store}>
        <MedicalSidePanels {...props} />
      </Provider>
    );

    medicalGlobalAddButtonMenuItems
      .filter((item) => item.id !== 'document')
      .forEach((item) => {
        expect(
          screen.getAllByText(item.modalTitle).length
        ).toBeGreaterThanOrEqual(1);
      });
  });

  it('does not render Add TUE side panel when pm-show-tue flag is off', () => {
    window.setFlag('pm-show-tue', false);
    usePermissions.mockReturnValue({
      permissions: {
        medical: {
          tue: { canCreate: true },
          documents: { canCreate: false },
          alerts: { canCreate: false },
          allergies: { canCreate: false },
          privateNotes: { canCreate: false },
        },
      },
      permissionsRequestStatus: 'SUCCESS',
    });

    render(
      <Provider store={store}>
        <MedicalSidePanels {...props} />
      </Provider>
    );

    expect(screen.queryByText('Add TUE')).not.toBeInTheDocument();
  });

  describe('[permission] medical-documents-create', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: {
            documents: { canCreate: true },
            alerts: { canCreate: false },
            allergies: { canCreate: false },
            privateNotes: { canCreate: false },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
    });

  it('renders correctly', () => {
    window.setFlag('pm-show-tue', true);
    render(
      <Provider store={store}>
        <MedicalSidePanels {...props} />
      </Provider>
    );

    expect(screen.getAllByText('Add documents')).toHaveLength(2);
  });
  });
});
