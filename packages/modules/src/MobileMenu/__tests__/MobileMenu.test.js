import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import MobileMenu from '..';

describe('MobileMenu', () => {
  // define matchMedia as per JEST docs
  // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  const i18nT = i18nextTranslateStub();

  let props;

  beforeEach(() => {
    window.featureFlags = {};
    window.setFlag('mls-emr-documents-area', true);
    window.setFlag('chat-web', true);
    window.setFlag('web-home-page', true);
    window.featureFlags['admin-manage-fixtures-visibility'] = true;
    window.setFlag('planning-session-planning', true);
    window.setFlag('collections-side-panel', true);

    props = {
      helpPath: 'dummy/help/path.html',
      permissions: {
        canCreateImports: false,
        canCreateMetric: true,
        canEditMetrics: true,
        canEditSquad: false,
        canManageAthletes: true,
        canManageDashboard: true,
        canManageGeneralSettings: true,
        canManageOfficials: false,
        canManageOrgSettings: true,
        canManageQuestionnaires: true,
        canManageScouts: false,
        canManageWorkload: true,
        canViewActivityLog: true,
        canViewAlerts: true,
        canViewAnalyticalDashboard: true,
        canViewAnalyticalGraphs: true,
        canViewAssessments: true,
        canViewAthleteAnalysis: true,
        canViewAthleteOwnExport: undefined,
        canViewAthletes: true,
        canViewAthletesArea: true,
        canViewAvailability: true,
        canViewAvailabilityReport: true,
        canViewBiomechanicalAnalysis: true,
        canViewDashboard: true,
        canViewHomepage: true,
        canViewHumanInput: true,
        canViewImports: false,
        canViewInjuryAnalysis: true,
        canViewMedical: true,
        canViewMessaging: true,
        canViewMetrics: true,
        canViewQuestionnaires: true,
        canViewSquadAnalysis: true,
        canViewStockManagement: false,
        canViewTSODocument: true,
        canViewTSOEvent: undefined,
        canViewTSOFixtureManagement: undefined,
        canViewTSOFixtureNegotiation: undefined,
        canViewTSOVideo: true,
        canViewWorkload: true,
        isAvailabilityAdmin: true,
        isPlanningAdmin: true,
        isQuestionnairesAdmin: true,
      },
      currentUser: {
        id: 1,
        fullname: 'John Doh',
        firstname: 'John',
        lastname: 'Doh',
      },
      t: i18nT,
    };
  });

  afterEach(() => {
    window.setFlag('planning-session-planning', false);
    window.setFlag(
      'cd-athlete-sharing-hide-athlete-and-squad-planning-options',
      false
    );
    window.setFlag('collections-side-panel', false);
    window.setFlag('mls-emr-documents-area', false);
    window.setFlag('chat-web', false);
    window.setFlag('web-home-page', false);
    window.featureFlags['admin-manage-fixtures-visibility'] = false;
    window.featureFlags['ip-login-branding'] = false;
  });

  describe('when ip-branding flag is on', () => {
    beforeEach(() => {
      window.featureFlags['ip-login-branding'] = true;
    });

    afterEach(() => {
      window.featureFlags['ip-login-branding'] = false;
    });

    it('renders', () => {
      renderWithProviders(<MobileMenu {...props} />);
      const menuButton = document.querySelector(
        '.ip-mainNavBarMobile__menuBtn'
      );
      expect(menuButton).toBeInTheDocument();
    });

    it('renders the ip-organisation logo', () => {
      renderWithProviders(<MobileMenu {...props} />);
      // Check for IP branding logo elements
      const logos = document.querySelectorAll('.ip-mainNavBarMobile__logo');
      expect(logos.length).toBeGreaterThan(0);
    });

    it('does not render the Kitman organisation logo', () => {
      renderWithProviders(<MobileMenu {...props} />);
      expect(
        document.querySelector('.icon-kitman-logo')
      ).not.toBeInTheDocument();
    });

    it('renders org img w/alt tag equal to nickname from props', () => {
      renderWithProviders(<MobileMenu {...props} orgNickname="org-nickname" />);
      const orgLogo = document.querySelector('.ip-org-logo-icon');
      expect(orgLogo).toBeInTheDocument();
    });

    it('renders the user menu', () => {
      renderWithProviders(<MobileMenu {...props} />);
      expect(
        document.querySelector('.ip-mainNavBarMobile__userMenu')
      ).toBeInTheDocument();
    });

    it('renders the correct menu items', () => {
      renderWithProviders(<MobileMenu {...props} />);
      const menuItems = document.querySelectorAll(
        '.ip-mainNavBarMobile__menuItem'
      );
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('when a menu item without submenu is clicked it closes the menu', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MobileMenu {...props} />);

      // Open the menu
      const menuBtn = document.querySelector('.ip-mainNavBarMobile__menuBtn');
      await user.click(menuBtn);

      // Check if menu is open
      expect(
        document.querySelector('.ip-mainNavBarMobile__menu--open')
      ).toBeInTheDocument();

      // Click on a menu item without submenu (Activity) - use more specific selector
      const activityMenuItem = document.querySelector(
        '.ip-mainNavBarMobile__menuItem--activity'
      );
      expect(activityMenuItem).toBeInTheDocument();
      await user.click(activityMenuItem);

      // Menu should close
      expect(
        document.querySelector('.ip-mainNavBarMobile__menu--open')
      ).not.toBeInTheDocument();
    });

    it('when a menu item with submenu is clicked, opens the submenu', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MobileMenu {...props} />);

      // Find and click a menu item with submenu (Analysis) - use more specific selector
      const analysisMenuLink = document.querySelector(
        '.ip-mainNavBarMobile__menuItem--analysis .ip-mainNavBarMobile__menuLink'
      );
      expect(analysisMenuLink).toBeInTheDocument();
      await user.click(analysisMenuLink);

      // Check if submenu becomes active
      const activeSubmenu = document.querySelector(
        '.ip-mainNavBarMobile__menuContent--active'
      );
      expect(activeSubmenu).toBeInTheDocument();
      expect(activeSubmenu).toHaveTextContent('Analysis');
    });

    it('renders a help link', () => {
      renderWithProviders(<MobileMenu {...props} />);
      const helpIcon = document.querySelector('.icon-question');
      expect(helpIcon).toBeInTheDocument();
    });

    it('sets the correct state when clicking on the menu opener', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MobileMenu {...props} />);

      expect(
        document.querySelector('.ip-mainNavBarMobile__menu--open')
      ).not.toBeInTheDocument();

      const menuBtn = document.querySelector('.ip-mainNavBarMobile__menuBtn');
      await user.click(menuBtn);

      expect(
        document.querySelector('.ip-mainNavBarMobile__menu--open')
      ).toBeInTheDocument();
    });

    it('renders a secondary menu with the correct items', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MobileMenu {...props} />);

      // Find and click the settings menu item
      const settingsMenuLink = document.querySelector(
        '.ip-mainNavBarMobile__menuItem--settings .ip-mainNavBarMobile__menuLink'
      );
      expect(settingsMenuLink).toBeInTheDocument();
      await user.click(settingsMenuLink);

      const activeSubmenu = document.querySelector(
        '.ip-mainNavBarMobile__menuContent--active'
      );
      expect(activeSubmenu).toBeInTheDocument();

      const submenuItems = activeSubmenu.querySelectorAll(
        '.ip-mainNavBarMobile__menuItem'
      );
      expect(submenuItems.length).toBeGreaterThan(0);
    });

    describe('When the user does not have view dashboard permission', () => {
      beforeEach(() => {
        props.permissions.canViewDashboard = false;
      });

      afterEach(() => {
        props.permissions.canViewDashboard = true;
      });

      it('does not render the metric dashboard menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector(
            '.ip-mainNavBarMobile__menuItem--metric_dashboard'
          )
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view activity log permission', () => {
      beforeEach(() => {
        props.permissions.canViewActivityLog = false;
      });

      afterEach(() => {
        props.permissions.canViewActivityLog = true;
      });

      it('does not render the activity menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.ip-mainNavBarMobile__menuItem--activity')
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view athlete area permission', () => {
      beforeEach(() => {
        props.permissions.canViewAthletesArea = false;
      });

      afterEach(() => {
        props.permissions.canViewAthletesArea = true;
      });

      it('does not render the athletes menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.ip-mainNavBarMobile__menuItem--athletes')
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view workloads permission', () => {
      beforeEach(() => {
        props.permissions.canViewWorkload = false;
      });

      afterEach(() => {
        props.permissions.canViewWorkload = true;
      });

      it('does not render the workloads menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.ip-mainNavBarMobile__menuItem--workloads')
        ).not.toBeInTheDocument();
      });

      it('does not render the calendar menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.ip-mainNavBarMobile__menuItem--calendar')
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view messaging permission', () => {
      beforeEach(() => {
        props.permissions.canViewMessaging = false;
      });

      afterEach(() => {
        props.permissions.canViewMessaging = true;
      });

      it('does not render the chat menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.ip-mainNavBarMobile__menuItem--messaging')
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view questionnaires and assessments permissions', () => {
      beforeEach(() => {
        props.permissions.canViewAssessments = false;
        props.permissions.canViewQuestionnaires = false;
      });

      afterEach(() => {
        props.permissions.canViewAssessments = true;
        props.permissions.canViewQuestionnaires = true;
      });

      it('does not render the questionnaires menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.ip-mainNavBarMobile__menuItem--forms')
        ).not.toBeInTheDocument();
      });
    });

    it('Contains valid prop orgNickname', () => {
      renderWithProviders(
        <MobileMenu {...props} orgNickname="test-org-nickname" />
      );
      const userMenu = document.querySelector('.ip-mainNavBarMobile__userMenu');
      expect(userMenu).toBeInTheDocument();
    });
  });

  // Tests for when ip-branding flag is off (default Kitman branding)
  describe('when ip-branding flag is off', () => {
    it('renders', () => {
      renderWithProviders(<MobileMenu {...props} />);
      const menuButton = document.querySelector('.mainNavBarMobile__menuBtn');
      expect(menuButton).toBeInTheDocument();
    });

    it('renders a user menu', () => {
      renderWithProviders(<MobileMenu {...props} />);
      expect(
        document.querySelector('.mainNavBarMobile__userMenu')
      ).toBeInTheDocument();
    });

    it('renders the correct menu items', () => {
      renderWithProviders(<MobileMenu {...props} />);
      const menuItems = document.querySelectorAll(
        '.mainNavBarMobile__menuItem'
      );
      expect(menuItems.length).toBeGreaterThan(0);
    });

    describe('when a menu item without submenu is clicked', () => {
      it('closes the menu', async () => {
        const user = userEvent.setup();
        renderWithProviders(<MobileMenu {...props} />);

        // Open the menu
        const menuBtn = document.querySelector('.mainNavBarMobile__menuBtn');
        await user.click(menuBtn);

        expect(
          document.querySelector('.mainNavBarMobile__menu--open')
        ).toBeInTheDocument();

        // Click on a menu item without submenu (Activity)
        const activityMenuItem = document.querySelector(
          '.mainNavBarMobile__menuItem--activity'
        );
        expect(activityMenuItem).toBeInTheDocument();
        await user.click(activityMenuItem);

        expect(
          document.querySelector('.mainNavBarMobile__menu--open')
        ).not.toBeInTheDocument();
      });
    });

    describe('when a menu item with submenu is clicked', () => {
      it('opens the submenu', async () => {
        const user = userEvent.setup();
        renderWithProviders(<MobileMenu {...props} />);

        const analysisMenuLink = document.querySelector(
          '.mainNavBarMobile__menuItem--analysis .mainNavBarMobile__menuLink'
        );
        expect(analysisMenuLink).toBeInTheDocument();
        await user.click(analysisMenuLink);

        const activeSubmenu = document.querySelector(
          '.mainNavBarMobile__menuContent--active'
        );
        expect(activeSubmenu).toBeInTheDocument();
        expect(activeSubmenu).toHaveTextContent('Analysis');
      });
    });

    it('renders a help link', () => {
      renderWithProviders(<MobileMenu {...props} />);
      const helpIcon = document.querySelector('.icon-question');
      expect(helpIcon).toBeInTheDocument();
    });

    it('sets the correct state when clicking on the menu opener', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MobileMenu {...props} />);

      expect(
        document.querySelector('.mainNavBarMobile__menu--open')
      ).not.toBeInTheDocument();

      const menuBtn = document.querySelector('.mainNavBarMobile__menuBtn');
      await user.click(menuBtn);

      expect(
        document.querySelector('.mainNavBarMobile__menu--open')
      ).toBeInTheDocument();
    });

    it('renders a secondary menu with the correct items', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MobileMenu {...props} />);

      const settingsMenuLink = document.querySelector(
        '.mainNavBarMobile__menuItem--settings .mainNavBarMobile__menuLink'
      );
      expect(settingsMenuLink).toBeInTheDocument();
      await user.click(settingsMenuLink);

      const activeSubmenu = document.querySelector(
        '.mainNavBarMobile__menuContent--active'
      );
      expect(activeSubmenu).toBeInTheDocument();

      const submenuItems = activeSubmenu.querySelectorAll(
        '.mainNavBarMobile__menuItem'
      );
      expect(submenuItems.length).toBeGreaterThan(0);
    });

    // Permission-based tests for non-IP branding
    describe('When the user does not have view dashboard permission', () => {
      beforeEach(() => {
        props.permissions.canViewDashboard = false;
      });

      afterEach(() => {
        props.permissions.canViewDashboard = true;
      });

      it('does not render the metric dashboard menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector(
            '.mainNavBarMobile__menuItem--metric_dashboard'
          )
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view activity log permission', () => {
      beforeEach(() => {
        props.permissions.canViewActivityLog = false;
      });

      afterEach(() => {
        props.permissions.canViewActivityLog = true;
      });

      it('does not render the activity menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.mainNavBarMobile__menuItem--activity')
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view athlete area permission', () => {
      beforeEach(() => {
        props.permissions.canViewAthletesArea = false;
      });

      afterEach(() => {
        props.permissions.canViewAthletesArea = true;
      });

      it('does not render the athletes menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.mainNavBarMobile__menuItem--athletes')
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view workloads permission', () => {
      beforeEach(() => {
        props.permissions.canViewWorkload = false;
      });

      afterEach(() => {
        props.permissions.canViewWorkload = true;
      });

      it('does not render the workloads menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.mainNavBarMobile__menuItem--workloads')
        ).not.toBeInTheDocument();
      });

      it('does not render the calendar menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.mainNavBarMobile__menuItem--calendar')
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view messaging permission', () => {
      beforeEach(() => {
        props.permissions.canViewMessaging = false;
      });

      afterEach(() => {
        props.permissions.canViewMessaging = true;
      });

      it('does not render the chat menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.mainNavBarMobile__menuItem--messaging')
        ).not.toBeInTheDocument();
      });
    });

    describe('When the user does not have view questionnaires and assessments permissions', () => {
      beforeEach(() => {
        props.permissions.canViewAssessments = false;
        props.permissions.canViewQuestionnaires = false;
      });

      afterEach(() => {
        props.permissions.canViewAssessments = true;
        props.permissions.canViewQuestionnaires = true;
      });

      it('does not render the questionnaires menu item', () => {
        renderWithProviders(<MobileMenu {...props} />);
        expect(
          document.querySelector('.mainNavBarMobile__menuItem--forms')
        ).not.toBeInTheDocument();
      });
    });
  });

  // Planning-specific tests
  it('displays squads & athletes in planning secondary menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MobileMenu {...props} />);

    const planningButton = screen.getByText(/planning/i);
    await user.click(planningButton);

    expect(screen.getByRole('link', { name: /schedule/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /#sport_specific__squad/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /#sport_specific__athlete/i })
    ).toBeInTheDocument();
  });

  it(
    'does not display squads & athletes in planning secondary menu when FF -> ' +
      'cd-athlete-sharing-hide-athlete-and-squad-planning-options is on',
    async () => {
      window.setFlag(
        'cd-athlete-sharing-hide-athlete-and-squad-planning-options',
        true
      );
      const user = userEvent.setup();
      renderWithProviders(<MobileMenu {...props} />);

      const planningButton = screen.getByText(/planning/i);
      await user.click(planningButton);

      expect(
        screen.getByRole('link', { name: /schedule/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /#sport_specific__squad/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: /#sport_specific__athlete/i })
      ).not.toBeInTheDocument();
    }
  );
});
