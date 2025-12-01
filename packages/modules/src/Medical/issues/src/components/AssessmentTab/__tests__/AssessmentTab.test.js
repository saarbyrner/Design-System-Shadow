import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { medicalGlobalAddButtonMenuItems } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useIssue } from '@kitman/modules/src/Medical/shared/contexts/IssueContext';
import getAthleteConcussionAssessmentResults from '@kitman/services/src/services/medical/getAthleteConcussionAssessmentResults';

import AssessmentTab from '..';

jest.mock(
  '@kitman/services/src/services/medical/getAthleteConcussionAssessmentResults'
);
jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));
jest.mock('@kitman/modules/src/Medical/shared/contexts/IssueContext');

const props = {
  athleteData: {
    id: 1,
  },
  athleteId: 1,
  permissions: { canViewConcussionAssessments: true },
  reloadDataByType: [],
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
  selectAthletesSidePanel: {
    isOpen: false,
  },
  medicalHistory: {},
  medicalApi: {},
});

describe('AssessmentTab', () => {
  beforeEach(() => {
    getAthleteConcussionAssessmentResults.mockResolvedValue([]);

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
    useIssue.mockReturnValue({
      issue: {
        id: 1234,
      },
      issueType: 'Injury',
    });
  });
  it('renders correctly', async () => {
    render(
      <Provider store={store}>
        <AssessmentTab {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Concussion assessment results',
          level: 2,
        })
      ).toBeInTheDocument();
    });
  });

  describe('[feature-flag] medical-global-add-button-fix', () => {
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

    it('renders correctly when FF is off', () => {
      window.featureFlags['medical-global-add-button-fix'] = false;

      render(
        <Provider store={store}>
          <AssessmentTab {...props} scopeToLevel="issue" />
        </Provider>
      );

      medicalGlobalAddButtonMenuItems
        .filter((item) => !['document'].includes(item.id))
        .forEach((item) => {
          expect(screen.queryAllByText(item.modalTitle).length).toEqual(0);
        });
    });

    it('renders correctly when FF is on', async () => {
      window.featureFlags['medical-global-add-button-fix'] = true;
      window.setFlag('pm-show-tue', true);

      render(
        <Provider store={store}>
          <AssessmentTab {...props} scopeToLevel="issue" />
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
