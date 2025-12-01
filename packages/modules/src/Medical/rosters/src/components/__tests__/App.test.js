import { render, screen } from '@testing-library/react';
import {
  i18nextTranslateStub,
  renderWithProvider,
} from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import getDefaultAddIssuePanelStore from '@kitman/modules/src/Medical/shared/redux/stores/addIssuePanel';
import App from '../App';

const props = {
  t: i18nextTranslateStub(),
};

const mockSidePanelStores = {
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
      isOpen: false,
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
  addVaccinationSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: false,
    },
  },
};

const defaultStore = storeFake({
  ...DEFAULT_CONTEXT_VALUE,
  ...mockSidePanelStores,
  app: { requestStatus: 'SUCCESS' },
  addIssuePanel: getDefaultAddIssuePanelStore(),
  filters: {
    athlete_name: '',
    positions: [],
    squads: [],
    availabilities: [],
    issues: ['open_issues'],
  },
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetPreferencesQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
    useGetPresentationTypesQuery: jest.fn(),
  },
  grid: {
    columns: [],
    rows: [],
    next_id: null,
  },
  medicalApi: {
    useGetMedicationProvidersQuery: jest.fn(),
  },
  medicalHistory: {},
  permissions: mockedDefaultPermissionsContextValue.permissions,
  toasts: [],
});

const renderWithPermissions = (permissions) => {
  const updatedPermissions = {
    ...mockedDefaultPermissionsContextValue.permissions,
    ...permissions,
  };
  renderWithProvider(
    <MockedPermissionContextProvider
      permissionsContext={{
        permissions: updatedPermissions,
      }}
    >
      <App {...props} />
    </MockedPermissionContextProvider>,
    defaultStore
  );
};

const renderWithMedicalPermissions = (medicalPermissions) => {
  renderWithPermissions({
    medical: {
      ...mockedDefaultPermissionsContextValue.permissions.medical,
      ...medicalPermissions,
    },
  });
};

const assertHeaderRendered = () => {
  expect(
    screen.getByText('Medical', {
      selector: 'header[class$="-medicalHeader"] h2',
    })
  ).toBeInTheDocument();
};

describe('default flow', () => {
  it('renders the correct content with default permissions', async () => {
    render(
      <Provider store={defaultStore}>
        <App {...props} />
      </Provider>
    );

    assertHeaderRendered();

    expect(
      screen.getByRole('tab', { name: 'Team', selected: true })
    ).toBeInTheDocument();
  });

  it('renders the roster overview tab when the hash is #overview', async () => {
    window.location.hash = '#overview';
    render(
      <Provider store={defaultStore}>
        <App {...props} />
      </Provider>
    );

    expect(
      screen.getByRole('tab', { name: 'Team', selected: true })
    ).toBeInTheDocument();
  });
});

describe('FF medical-forms-tab-iteration-1 is ON', () => {
  beforeEach(() => {
    window.featureFlags['medical-forms-tab-iteration-1'] = true;
  });

  afterEach(() => {
    window.featureFlags['medical-forms-tab-iteration-1'] = false;
  });

  it('renders the correct content when medicalPermissions.forms.canView is ON', async () => {
    renderWithPermissions({
      medical: {
        ...mockedDefaultPermissionsContextValue.permissions.medical,
        forms: { canView: true },
      },
    });

    assertHeaderRendered();

    expect(screen.getByRole('tab', { name: 'Team' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Forms' })).toBeInTheDocument();
  });

  it('renders the correct content when medicalPermissions.forms.canView is OFF', async () => {
    renderWithMedicalPermissions({ forms: { canView: false } });

    assertHeaderRendered();

    expect(screen.queryByRole('Forms')).not.toBeInTheDocument();
  });
});

describe('FF medical-forms-tab-iteration-1 is OFF', () => {
  beforeEach(() => {
    window.featureFlags['medical-forms-tab-iteration-1'] = false;
  });

  afterEach(() => {
    window.featureFlags = [];
  });

  it('renders the correct content when medicalPermissions.forms.canView is ON', async () => {
    renderWithPermissions({
      medical: {
        ...mockedDefaultPermissionsContextValue.permissions.medical,
        forms: { canView: true },
      },
    });

    assertHeaderRendered();

    expect(
      screen.queryByRole('tab', { name: 'Forms' })
    ).not.toBeInTheDocument();
  });

  it('renders the correct content when medicalPermissions.forms.canView is OFF', async () => {
    renderWithMedicalPermissions({ forms: { canView: false } });

    assertHeaderRendered();

    expect(
      screen.queryByRole('tab', { name: 'Forms' })
    ).not.toBeInTheDocument();
  });
});

describe('permission medicalPermissions.treatments.canView', () => {
  it('renders the correct content when medicalPermissions.treatments.canView is ON', async () => {
    renderWithMedicalPermissions({ treatments: { canView: true } });

    assertHeaderRendered();

    expect(screen.getByRole('tab', { name: 'Treatments' })).toBeInTheDocument();
  });

  it('renders the correct content when medicalPermissions.treatments.canView is OFF', async () => {
    renderWithMedicalPermissions({ treatments: { canView: false } });

    assertHeaderRendered();

    expect(
      screen.queryByRole('tab', { name: 'Treatments' })
    ).not.toBeInTheDocument();
  });
});

describe('medicalPermissions.modifications.canView', () => {
  it('renders the correct content when medicalPermissions.modifications.canView is ON', async () => {
    renderWithMedicalPermissions({ modifications: { canView: true } });

    assertHeaderRendered();

    expect(
      screen.getByRole('tab', { name: 'Modifications' })
    ).toBeInTheDocument();
  });

  it('renders the correct content when medicalPermissions.modifications.canView is OFF', async () => {
    renderWithMedicalPermissions({ modifications: { canView: false } });

    assertHeaderRendered();

    expect(
      screen.queryByRole('tab', { name: 'Modifications' })
    ).not.toBeInTheDocument();
  });
});

// Coaches Report / Comments
describe('FF nfl-comments-tab is ON', () => {
  beforeEach(() => {
    window.featureFlags['nfl-comments-tab'] = true;
  });

  afterEach(() => {
    window.featureFlags['nfl-comments-tab'] = false;
  });

  it('renders the Coaches Report tab when FF nfl-comments-tab is ON and permission medical.notes.canView = true', async () => {
    renderWithMedicalPermissions({ notes: { canView: true } });

    assertHeaderRendered();

    expect(
      await screen.findByRole('tab', { name: 'Coaches Report' })
    ).toBeInTheDocument();
  });

  it('doesnt render the Coaches Report tab when FF nfl-comments-tab is ON and permission medical.notes.canView = false', async () => {
    renderWithMedicalPermissions({ notes: { canView: false } });

    assertHeaderRendered();

    expect(
      screen.queryByRole('tab', { name: 'Coaches Report' })
    ).not.toBeInTheDocument();
  });

  it('doesnt render the Coaches Report tab when FF nfl-comments-tab is OFF and permission medical.notes.canView = true', async () => {
    window.featureFlags['nfl-comments-tab'] = false;
    renderWithMedicalPermissions({ notes: { canView: true } });

    assertHeaderRendered();

    expect(
      screen.queryByRole('tab', { name: 'Coaches Report' })
    ).not.toBeInTheDocument();
  });
});

// Daily Status Report
describe('FF coaches-report-refactor is ON', () => {
  beforeEach(() => {
    window.featureFlags['coaches-report-refactor'] = true;
  });

  afterEach(() => {
    window.featureFlags['coaches-report-refactor'] = false;
  });

  it('renders the Daily Status Report tab when FF coaches-report-refactor is ON and permission medical.notes.canView = true', async () => {
    renderWithMedicalPermissions({ notes: { canView: true } });

    assertHeaderRendered();

    expect(
      await screen.findByRole('tab', { name: 'Daily Status Report' })
    ).toBeInTheDocument();
  });

  it('doesnt render the Daily Status Report tab when FF coaches-report-refactor is ON and permission medical.notes.canView = false', async () => {
    renderWithMedicalPermissions({ notes: { canView: false } });

    assertHeaderRendered();

    expect(
      screen.queryByRole('tab', { name: 'Daily Status Report' })
    ).not.toBeInTheDocument();
  });

  it('doesnt render the Daily Status Report tab when FF coaches-report-refactor is OFF and permission medical.notes.canView = true', async () => {
    window.featureFlags['coaches-report-refactor'] = false;
    renderWithMedicalPermissions({ notes: { canView: true } });

    assertHeaderRendered();

    expect(
      screen.queryByRole('tab', { name: 'Daily Status Report' })
    ).not.toBeInTheDocument();
  });
});

describe('when concussion.canViewConcussionAssessments is true', () => {
  beforeEach(() => {
    window.featureFlags['concussion-web-iteration-2'] = true;
    window.featureFlags['medical-forms-tab-iteration-1'] = true;
    window.featureFlags['concussion-web-team-tab'] = true;
  });
  afterEach(() => {
    window.featureFlags['concussion-web-iteration-2'] = false;
    window.featureFlags['medical-forms-tab-iteration-1'] = false;
    window.featureFlags['concussion-web-team-tab'] = false;
  });

  it('renders the correct content', () => {
    renderWithPermissions({
      concussion: {
        canViewConcussionAssessments: true,
      },
    });

    expect(
      screen.getByRole('tab', { name: 'Concussions' })
    ).toBeInTheDocument();
  });
});

describe('when concussion.canManageConcussionAssessments is true', () => {
  beforeEach(() => {
    window.featureFlags['concussion-web-iteration-2'] = true;
    window.featureFlags['medical-forms-tab-iteration-1'] = true;
    window.featureFlags['concussion-web-team-tab'] = true;
  });
  afterEach(() => {
    window.featureFlags['concussion-web-iteration-2'] = false;
    window.featureFlags['medical-forms-tab-iteration-1'] = false;
    window.featureFlags['concussion-web-team-tab'] = false;
  });

  it('renders the correct content', () => {
    renderWithPermissions({
      concussion: {
        canManageConcussionAssessments: true,
      },
    });

    expect(
      screen.getByRole('tab', { name: 'Concussions' })
    ).toBeInTheDocument();
  });
});

describe('[feature-flag] emr-show-latest-note-column', () => {
  beforeEach(() => {
    window.featureFlags['emr-show-latest-note-column'] = true;
  });

  afterEach(() => {
    window.featureFlags['emr-show-latest-note-column'] = false;
  });

  it('renders the latest note tab', () => {
    renderWithMedicalPermissions({ notes: { canView: true } });

    expect(screen.getByRole('tab', { name: 'Notes' })).toBeInTheDocument();
  });
});

describe('when quality-report-exports feature flag is true and permissions.medical.issues.canExport is true', () => {
  beforeEach(() => {
    window.setFlag('quality-report-exports', true);
  });
  afterEach(() => {
    window.setFlag('quality-report-exports', false);
  });

  it('renders the correct content', () => {
    renderWithMedicalPermissions({ issues: { canExport: true } });

    expect(screen.getByRole('tab', { name: 'Reports' })).toBeInTheDocument();
  });
});

describe('when permissions.medical.allergies.canView is true', () => {
  it('renders the correct content', () => {
    renderWithMedicalPermissions({ allergies: { canViewNewAllergy: true } });

    expect(
      screen.getByRole('tab', { name: 'Medical Flags' })
    ).toBeInTheDocument();
  });
});

describe('[feature-flag] nfl-player-movement-trade', () => {
  beforeEach(() => {
    window.featureFlags['nfl-player-movement-trade'] = true;
  });
  afterEach(() => {
    window.featureFlags['nfl-player-movement-trade'] = false;
  });

  it('renders the correct tabs', () => {
    renderWithPermissions({
      medical: {
        ...DEFAULT_CONTEXT_VALUE.permissions.medical,
        athletes: { canView: true },
      },
      general: {
        pastAthletes: {
          canView: true,
        },
      },
    });

    expect(
      screen.getByRole('tab', { name: 'Past Athletes' })
    ).toBeInTheDocument();
  });
});

describe('[feature-flag] nfl-player-tryout', () => {
  beforeEach(() => {
    window.featureFlags['nfl-player-tryout'] = true;
  });
  afterEach(() => {
    window.featureFlags['nfl-player-tryout'] = false;
  });

  it('renders the correct tabs', () => {
    renderWithPermissions({
      medical: {
        ...DEFAULT_CONTEXT_VALUE.permissions.medical,
        athletes: { canView: true },
      },
      general: {
        tryoutAthletes: {
          canView: true,
        },
      },
    });

    expect(
      screen.getByRole('tab', { name: 'Shared Players' })
    ).toBeInTheDocument();
  });
});

describe('[feature-flag] inactive-athletes-tab-perf-med', () => {
  beforeEach(() => {
    window.featureFlags['inactive-athletes-tab-perf-med'] = true;
  });
  afterEach(() => {
    window.featureFlags['inactive-athletes-tab-perf-med'] = false;
  });

  it('renders the correct tabs', () => {
    renderWithPermissions({
      medical: {
        ...DEFAULT_CONTEXT_VALUE.permissions.medical,
        athletes: { canView: true },
      },
      general: {
        inactiveAthletes: {
          canView: true,
        },
      },
    });

    expect(
      screen.getByRole('tab', { name: 'Inactive Athletes' })
    ).toBeInTheDocument();
  });
});
