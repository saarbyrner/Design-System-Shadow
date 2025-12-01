import { screen, render } from '@testing-library/react';
import { AppTranslated as App } from '@kitman/modules/src/OrganisationSettings/src/components/App';
import { Provider } from 'react-redux';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  orgSettings: {
    graphColourPalette: [],
    groupedWorkloadOptions: [],
    primaryWorkloadVariableId: 'kitman|workload',
    secondaryWorkloadVariableId: '',
    gameParticipationLevels: [],
    trainingParticipationLevels: [],
    gameRpeCollection: {
      kioskApp: false,
      athleteApp: false,
    },
    trainingRpeCollection: {
      kioskApp: false,
      athleteApp: false,
    },
    nameFormattings: {},
    integrations: {
      activeIntegrations: [],
      availableIntegrations: [],
      addIntegrationModal: {
        isOpen: false,
      },
      unlinkIntegrationModal: {
        isOpen: false,
        id: null,
        unlinkUrl: null,
      },
    },
    security: {
      privacyPolicy: {
        actionState: 'LOADING',
        isActive: undefined,
        updatedText: null,
        currentText: null,
      },
      updatePrivacyPolicyModal: {
        isOpen: false,
      },
    },
    legal: {
      termsOfUsePolicy: {
        actionState: 'LOADING',
        isActive: undefined,
        updatedText: null,
        currentText: null,
      },
      updateTermsOfUsePolicyModal: {
        isOpen: false,
      },
    },
    hasDevelopmentGoalsModule: false,
    isPlanningAdmin: false,
  },
  appStatus: {
    status: null,
    message: null,
  },
  coachingPrinciples: {
    isEnabled: false,
  },
  globalApi: {
    useGetPermissionsQuery: jest.fn(),
  },
  toastsSlice: {
    value: [],
  },
});

describe('OrganisationSettingsApp', () => {
  const props = {
    fetchPrivacyPolicy: jest.fn(),
    fetchTermsOfUsePolicy: jest.fn(),
    fetchPrivacyPolicyIsActive: jest.fn(),
    fetchTermsOfUsePolicyIsActive: jest.fn(),
    fetchCoachingPrinciplesEnabled: jest.fn(),
    privacyPolicyActionState: 'LOADING',
    termsOfUsePolicyActionState: 'LOADING',
    fetchGraphColours: jest.fn(),
    graphColourPalette: [],
    areCoachingPrinciplesEnabled: true,
    t: (key) => key,
  };

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: { settings: { canViewLabels: true } },
      isSuccess: true,
    });
  });

  const checkDefaultTabs = async () => {
    expect(await screen.findByText('Appearance')).toBeInTheDocument();
    expect(await screen.findByText('Workload')).toBeInTheDocument();
  };

  it('renders default tabs', async () => {
    render(
      <Provider store={defaultStore}>
        <App {...props} />
      </Provider>
    );
    await checkDefaultTabs();
  });

  describe('when the integrations-tab-organisation-settings is true', () => {
    beforeEach(() => {
      window.featureFlags['integrations-tab-organisation-settings'] = true;
    });

    afterEach(() => {
      window.featureFlags['integrations-tab-organisation-settings'] = false;
    });

    it('renders the correct tabs', async () => {
      render(
        <Provider store={defaultStore}>
          <App {...props} />
        </Provider>
      );

      await checkDefaultTabs();
      expect(await screen.findByText('Integrations')).toBeInTheDocument();
    });
  });

  describe('when the organisation-settings-terminology-updates flag is true', () => {
    beforeEach(() => {
      window.setFlag('organisation-settings-terminology-updates', true);
    });

    afterEach(() => {
      window.setFlag('organisation-settings-terminology-updates', false);
    });

    it('renders the correct tabs', async () => {
      render(
        <Provider store={defaultStore}>
          <App {...props} />
        </Provider>
      );

      await checkDefaultTabs();
      expect(await screen.findByText('Terminology')).toBeInTheDocument();
    });
  });

  describe('when the planning-session-planning flag and the isPlanningAdmin permission are true', () => {
    beforeEach(() => {
      window.setFlag('planning-session-planning', true);
    });

    afterEach(() => {
      window.setFlag('planning-session-planning', false);
    });

    it('renders the correct tabs when the permission is true', async () => {
      render(
        <Provider store={defaultStore}>
          <App {...props} isPlanningAdmin />
        </Provider>
      );

      await checkDefaultTabs();
      expect(await screen.findByText('Planning')).toBeInTheDocument();
    });
  });

  describe('when the integrations-tab-organisation-settings flag is true', () => {
    beforeEach(() => {
      window.featureFlags['integrations-tab-organisation-settings'] = true;
    });

    afterEach(() => {
      window.featureFlags['integrations-tab-organisation-settings'] = false;
    });

    it('renders the correct tabs', async () => {
      render(
        <Provider store={defaultStore}>
          <App {...props} />
        </Provider>
      );

      await checkDefaultTabs();
      expect(await screen.findByText('Integrations')).toBeInTheDocument();
    });
  });

  describe('when custom-privacy-policy is on and the permissions are true', () => {
    beforeEach(() => {
      window.featureFlags['custom-privacy-policy'] = true;
    });

    afterEach(() => {
      window.featureFlags['custom-privacy-policy'] = false;
    });

    it('renders the correct tab', async () => {
      render(
        <Provider store={defaultStore}>
          <App {...props} />
        </Provider>
      );

      await checkDefaultTabs();
      expect(
        await screen.findByText('Security and privacy')
      ).toBeInTheDocument();
    });
  });

  describe('when calendar-settings-ip FF is on', () => {
    beforeEach(() => {
      window.featureFlags['calendar-settings-ip'] = true;
    });
    afterEach(() => {
      window.featureFlags['calendar-settings-ip'] = false;
    });

    it('renders the correct tabs', async () => {
      render(
        <Provider store={defaultStore}>
          <App {...props} />
        </Provider>
      );
      await checkDefaultTabs();
      expect(await screen.findByText('Calendar')).toBeInTheDocument();
    });
  });

  describe('when location-settings-managements-on-i-p FF is on', () => {
    beforeEach(() => {
      window.featureFlags['location-settings-managements-on-i-p'] = true;
    });
    afterEach(() => {
      window.featureFlags['location-settings-managements-on-i-p'] = false;
    });

    it('renders the correct tabs', async () => {
      render(
        <Provider store={defaultStore}>
          <App {...props} />
        </Provider>
      );
      await checkDefaultTabs();
      expect(await screen.findByText('Locations')).toBeInTheDocument();
    });
  });

  describe('when event-notifications FF is on', () => {
    beforeEach(() => {
      window.featureFlags['event-notifications'] = true;
    });

    afterEach(() => {
      window.featureFlags['event-notifications'] = false;
    });

    it('renders the correct tab', async () => {
      render(
        <Provider store={defaultStore}>
          <App {...props} />
        </Provider>
      );

      await checkDefaultTabs();
      expect(await screen.findByText('Notifications')).toBeInTheDocument();
    });
  });
});
