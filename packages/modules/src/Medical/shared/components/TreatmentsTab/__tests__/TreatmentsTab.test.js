import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useCurrentUser from '@kitman/modules/src/Medical/shared/hooks/useGetCurrentUser';
import { medicalGlobalAddButtonMenuItems } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { axios } from '@kitman/common/src/utils/services';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import TreatmentsTab from '..';
import { data } from './mocks/getTreatmentSessions';

jest.mock('@kitman/modules/src/Medical/shared/hooks/useGetCurrentUser');
jest.mock('@kitman/common/src/contexts/PermissionsContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/PermissionsContext'),
  usePermissions: jest.fn(),
}));

const defaultProps = {
  t: i18nextTranslateStub(),
};

const props = {
  ...defaultProps,
  athleteData: {
    id: 1,
  },
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
    initialInfo: { isAthleteSelectable: true },
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
  treatmentCardList: {
    athleteTreatments: {},
    invalidEditTreatmentCards: [],
  },
  medicalHistory: {},
  medicalApi: {},
});

describe('TreatmentsTab', () => {
  beforeEach(() => {
    useCurrentUser.mockReturnValue({
      currentUser: {
        fullname: 'Name One',
        id: 1,
      },
      fetchCurrentUser: jest.fn(),
    });
    usePermissions.mockReturnValue({
      permissions: {
        medical: {
          treatments: {
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
  it('renders correctly', async () => {
    render(
      <Provider store={store}>
        <TreatmentsTab {...props} />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Treatments', level: 3 })
      ).toBeInTheDocument();
    });
  });

  describe('[feature-flag] medical-global-add-button-fix', () => {
    beforeEach(() => {
      usePermissions.mockReturnValue({
        permissions: {
          medical: {
            treatments: {
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
          <TreatmentsTab {...props} scopeToLevel="issue" />
        </Provider>
      );

      medicalGlobalAddButtonMenuItems
        .filter((item) => !['treatment', 'document'].includes(item.id))
        .forEach((item) => {
          expect(screen.queryAllByText(item.modalTitle).length).toEqual(0);
        });
    });

    it('renders correctly when FF is on', async () => {
      window.featureFlags['medical-global-add-button-fix'] = true;
      window.setFlag('pm-show-tue', true);

      render(
        <Provider store={store}>
          <TreatmentsTab {...props} scopeToLevel="issue" />
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
          <TreatmentsTab {...props} scopeToLevel="issue" />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.queryByText('Add TUE')).not.toBeInTheDocument();
      });

      window.featureFlags['medical-global-add-button-fix'] = false;
    });
  });

  describe('when the initial request is successful', () => {
    // Clone the original "localStorage"
    const originalLocalStorage = window.sessionStorage;

    beforeEach(() => {
      moment.tz.setDefault('UTC');
      jest.spyOn(axios, 'post').mockResolvedValue({ data });
    });

    afterEach(() => {
      moment.tz.setDefault();
      jest.restoreAllMocks();

      // Revert the fake sessionStorage in "beforeEach" block
      window.sessionStorage = originalLocalStorage;
    });

    it('renders the list of treatments', async () => {
      render(
        <Provider store={store}>
          <TreatmentsTab {...props} />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('TreatmentCard|Header')).toBeInTheDocument();
      });

      expect(screen.getByTestId('TreatmentCard|Content')).toBeInTheDocument();
      expect(
        screen.getByTestId('TreatmentCard|AthleteDetails')
      ).toBeInTheDocument();
    });
  });

  describe('when the initial request is successful and there are no treatments', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'post').mockResolvedValue({
        data: { treatment_sessions: [], meta: { next_page: null } },
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('renders the no treatments text', async () => {
      render(
        <Provider store={store}>
          <TreatmentsTab {...defaultProps} />
        </Provider>
      );

      await waitFor(() => {
        expect(
          screen.getByText('No treatments for this period')
        ).toBeInTheDocument();
      });
    });
  });

  describe('when the initial request fails', () => {
    beforeEach(() => {
      jest
        .spyOn(axios, 'post')
        .mockRejectedValue(new Error('Whoops not working'));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('shows an error message', async () => {
      render(
        <Provider store={store}>
          <TreatmentsTab {...props} />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
      });
    });
  });
});
