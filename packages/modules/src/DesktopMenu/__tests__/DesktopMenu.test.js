import { screen, waitFor } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import DesktopMenu from '..';

describe('MainNavBar <DesktopMenu /> component', () => {
  const i18nT = i18nextTranslateStub();

  let props;

  const defaultProps = {
    helpPath: 'dummy/help/path.html',
    permissions: {
      canViewDashboard: true,
      canViewAthleteAnalysis: true,
      canViewAthletes: true,
      canViewAthletesArea: true,
      canViewWorkload: true,
      canViewQuestionnaires: true,
      canViewAnalyticalDashboard: true,
      canViewAnalyticalGraphs: true,
      canViewSquadAnalysis: true,
      canManageAthletes: true,
      canManageGeneralSettings: true,
      canManageWorkload: true,
      canManageQuestionnaires: true,
      canManageOrgSettings: true,
      canViewActivityLog: true,
      canViewAssessments: true,
      canViewMessaging: true,
      canViewHomepage: true,
    },
    t: (key) => key,
  };

  describe('when ip-branding flag is on', () => {
    beforeEach(() => {
      window.setFlag('ip-login-branding', true);
      props = { ...defaultProps };
    });

    afterEach(() => {
      window.setFlag('ip-login-branding', false);
    });

    it('renders the ip-organisation logo', async () => {
      renderWithProviders(<DesktopMenu {...props} />);

      await waitFor(() => {
        expect(
          document.querySelector('.mainNavBarDesktop__logo')
        ).toBeInTheDocument();
      });

      expect(
        document.querySelector('.mainNavBarDesktop__logo')
      ).toHaveAttribute('href', '/');
      expect(document.querySelector('.ip-org-logo-icon')).toBeInTheDocument();
    });

    it('does not render the Kitman organisation logo', async () => {
      renderWithProviders(<DesktopMenu {...props} />);

      await waitFor(() => {
        expect(
          document.querySelector('.mainNavBarDesktop__logo')
        ).toBeInTheDocument();
      });

      expect(
        document.querySelector('.icon-kitman-logo')
      ).not.toBeInTheDocument();
    });

    it('renders org img w/alt tag equal to nickname from props', async () => {
      renderWithProviders(
        <DesktopMenu {...props} orgNickname="org-nickname" />
      );

      await waitFor(() => {
        const orgLogo = document.querySelector('.ip-org-logo-icon');
        expect(orgLogo).toBeInTheDocument();
        expect(orgLogo).toHaveAttribute('alt', "org-nickname's logo");
      });
    });
  });

  beforeEach(() => {
    window.setFlag('mls-emr-documents-area', true);
    window.setFlag('chat-web', true);
    window.setFlag('web-home-page', true);
    window.setFlag('admin-manage-fixtures-visibility', true);

    props = { ...defaultProps };
  });

  afterEach(async () => {
    window.setFlag('mls-emr-documents-area', false);
    window.setFlag('chat-web', false);
    window.setFlag('web-home-page', false);
    window.setFlag('admin-manage-fixtures-visibility', false);

    // Wait for any pending timers to complete
    await new Promise((resolve) => setTimeout(resolve, 10));
  });

  it('renders', async () => {
    renderWithProviders(<DesktopMenu {...props} />);

    await waitFor(() => {
      expect(document.querySelector('.mainNavBarDesktop')).toBeInTheDocument();
    });
  });

  it('renders the correct menu items', async () => {
    renderWithProviders(<DesktopMenu {...props} />);

    await waitFor(() => {
      // Check for menu items by their CSS classes
      const menuItems = document.querySelectorAll(
        '.mainNavBarDesktop__menuItem'
      );
      expect(menuItems.length).toBeGreaterThan(10);
    });

    // Check for specific menu items
    expect(
      document.querySelector('.mainNavBarDesktop__menuItem--metric_dashboard')
    ).toBeInTheDocument();
    expect(
      document.querySelector('.mainNavBarDesktop__menuItem--analysis')
    ).toBeInTheDocument();
  });

  it('renders the organisation logo', async () => {
    renderWithProviders(<DesktopMenu {...props} />);

    await waitFor(() => {
      expect(
        document.querySelector('.mainNavBarDesktop__logo')
      ).toBeInTheDocument();
    });

    expect(document.querySelector('.mainNavBarDesktop__logo')).toHaveAttribute(
      'href',
      '/'
    );
    expect(document.querySelector('.icon-kitman-logo')).toBeInTheDocument();
  });

  it('renders the setting item', async () => {
    renderWithProviders(<DesktopMenu {...props} />);

    await waitFor(() => {
      expect(
        document.querySelector('.mainNavBarDesktop__menuItem--settings')
      ).toBeInTheDocument();
    });
  });

  it('renders a help link', () => {
    renderWithProviders(<DesktopMenu {...props} />);

    const helpLink = screen.getByRole('link', { name: /help/i });
    expect(helpLink).toBeInTheDocument();
    expect(helpLink).toHaveAttribute('href', props.helpPath);
  });

  it('renders a secondary menu with the correct items', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DesktopMenu {...props} />);

    // Click on settings to open secondary menu
    const settingsButton = document.querySelector(
      '.mainNavBarDesktop__menuItem--settings .mainNavBarDesktop__menuItemBtn'
    );
    await user.click(settingsButton);

    await waitFor(() => {
      expect(
        document.querySelector('.mainNavBarDesktop__secondaryMenu--open')
      ).toBeInTheDocument();
    });

    expect(
      document.querySelector('.mainNavBarDesktop__secondaryMenuTitle')
    ).toHaveTextContent('Settings');
    const secondaryMenuItems = document.querySelectorAll(
      '.mainNavBarDesktop__secondaryMenuItem'
    );
    expect(secondaryMenuItems.length).toBeGreaterThan(0);
  });

  it('closes the secondary menu when clicking a secondary menu link', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DesktopMenu {...props} />);

    // Open secondary menu
    const settingsButton = document.querySelector(
      '.mainNavBarDesktop__menuItem--settings .mainNavBarDesktop__menuItemBtn'
    );
    await user.click(settingsButton);

    await waitFor(() => {
      expect(
        document.querySelector('.mainNavBarDesktop__secondaryMenu--open')
      ).toBeInTheDocument();
    });

    // Click on a secondary menu item
    const firstSecondaryItem = document.querySelector(
      '.mainNavBarDesktop__secondaryMenuItem'
    );
    expect(firstSecondaryItem).toBeInTheDocument();
    await user.click(firstSecondaryItem);

    await waitFor(() => {
      expect(
        document.querySelector('.mainNavBarDesktop__secondaryMenu--open')
      ).not.toBeInTheDocument();
    });
  });

  describe('when the secondary menu is open', () => {
    it('opens the correct secondary menu when another item is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DesktopMenu {...props} />);

      // Open settings menu
      const settingsButton = document.querySelector(
        '.mainNavBarDesktop__menuItem--settings .mainNavBarDesktop__menuItemBtn'
      );
      await user.click(settingsButton);

      await waitFor(() => {
        expect(
          document.querySelector('.mainNavBarDesktop__secondaryMenuTitle')
        ).toHaveTextContent('Settings');
      });

      // Click on analysis menu item
      const analysisButton = document.querySelector(
        '.mainNavBarDesktop__menuItem--analysis .mainNavBarDesktop__menuItemBtn'
      );
      await user.click(analysisButton);

      await waitFor(() => {
        expect(
          document.querySelector('.mainNavBarDesktop__secondaryMenuTitle')
        ).toHaveTextContent('Analysis');
      });
    });

    it('closes the secondary menu when the same item is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DesktopMenu {...props} />);

      // Open settings menu
      const settingsButton = document.querySelector(
        '.mainNavBarDesktop__menuItem--settings .mainNavBarDesktop__menuItemBtn'
      );
      await user.click(settingsButton);

      await waitFor(() => {
        expect(
          document.querySelector('.mainNavBarDesktop__secondaryMenu--open')
        ).toBeInTheDocument();
      });

      // Click settings again to close
      await user.click(settingsButton);

      await waitFor(() => {
        expect(
          document.querySelector('.mainNavBarDesktop__secondaryMenu--open')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('When the user does not have view dashboard permission', () => {
    beforeEach(() => {
      props = {
        ...defaultProps,
        permissions: {
          ...defaultProps.permissions,
          canViewDashboard: false,
        },
      };
    });

    it('does not render the metric dashboard menu item', () => {
      renderWithProviders(<DesktopMenu {...props} />);

      expect(
        document.querySelector('.mainNavBarDesktop__menuItem--metric_dashboard')
      ).not.toBeInTheDocument();
    });
  });

  describe('When the user does not have view activity log permission', () => {
    beforeEach(() => {
      props = {
        ...defaultProps,
        permissions: {
          ...defaultProps.permissions,
          canViewActivityLog: false,
        },
      };
    });

    it('does not render the activity menu item', () => {
      renderWithProviders(<DesktopMenu {...props} />);

      expect(
        document.querySelector('.mainNavBarDesktop__menuItem--activity')
      ).not.toBeInTheDocument();
    });
  });

  describe('When the user does not have view athlete area permission', () => {
    beforeEach(() => {
      props = {
        ...defaultProps,
        permissions: {
          ...defaultProps.permissions,
          canViewAthletesArea: false,
        },
      };
    });

    it('does not render the athletes menu item', () => {
      renderWithProviders(<DesktopMenu {...props} />);

      expect(
        document.querySelector('.mainNavBarDesktop__menuItem--athletes')
      ).not.toBeInTheDocument();
    });
  });

  describe('When the user does not have view workloads permission', () => {
    beforeEach(() => {
      props = {
        ...defaultProps,
        permissions: {
          ...defaultProps.permissions,
          canViewWorkload: false,
        },
      };
    });

    it('does not render the workloads menu item', () => {
      renderWithProviders(<DesktopMenu {...props} />);

      expect(
        document.querySelector('.mainNavBarDesktop__menuItem--workloads')
      ).not.toBeInTheDocument();
    });

    it('does not render the calendar menu item', () => {
      renderWithProviders(<DesktopMenu {...props} />);

      expect(
        document.querySelector('.mainNavBarDesktop__menuItem--calendar')
      ).not.toBeInTheDocument();
    });
  });

  describe('When the user does not have view Messaging permission', () => {
    beforeEach(() => {
      props = {
        ...defaultProps,
        permissions: {
          ...defaultProps.permissions,
          canViewMessaging: false,
        },
      };
    });

    it('does not render the messaging menu item', () => {
      renderWithProviders(<DesktopMenu {...props} />);

      expect(
        document.querySelector('.mainNavBarDesktop__menuItem--messaging')
      ).not.toBeInTheDocument();
    });
  });

  describe('When the user does not have view questionnaires and assessments permissions', () => {
    beforeEach(() => {
      props = {
        ...defaultProps,
        permissions: {
          ...defaultProps.permissions,
          canViewAssessments: false,
          canViewQuestionnaires: false,
        },
      };
    });

    it('does not render the questionnaires menu item', () => {
      renderWithProviders(<DesktopMenu {...props} />);

      expect(
        document.querySelector('.mainNavBarDesktop__menuItem--forms')
      ).not.toBeInTheDocument();
    });
  });

  describe('Main menu toggle functionality', () => {
    it('toggles the menu state when the toggle button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DesktopMenu {...props} />);

      // Find the toggle button and menu
      const toggleButton = document.querySelector(
        '.mainNavBarDesktop__menuItemBtn--toggleMainMenu'
      );
      const desktopMenu = document.querySelector('.mainNavBarDesktop');
      expect(toggleButton).toBeInTheDocument();
      expect(desktopMenu).toBeInTheDocument();

      // Get initial state
      const initialOpenState = desktopMenu.classList.contains(
        'mainNavBarDesktop--open'
      );

      // First click should toggle the menu
      await user.click(toggleButton);

      await waitFor(
        () => {
          const newOpenState = desktopMenu.classList.contains(
            'mainNavBarDesktop--open'
          );
          expect(newOpenState).toBe(!initialOpenState);
        },
        { timeout: 3000 }
      );

      // Second click should toggle it back
      await user.click(toggleButton);

      await waitFor(() => {
        const finalOpenState = desktopMenu.classList.contains(
          'mainNavBarDesktop--open'
        );
        expect(finalOpenState).toBe(initialOpenState);
      });
    });

    it('shows the correct toggle icon based on menu state', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DesktopMenu {...props} />);

      const toggleButton = document.querySelector(
        '.mainNavBarDesktop__menuItemBtn--toggleMainMenu'
      );

      // Check that the icon exists
      let toggleIcon = document.querySelector(
        '.mainNavBarDesktop__menuItemBtn--toggleMainMenu .mainNavBarDesktop__menuItemIcon'
      );
      expect(toggleIcon).toBeInTheDocument();

      // Get initial icon class
      const initialIconClass = toggleIcon.className;

      // Click to change state
      await user.click(toggleButton);

      await waitFor(() => {
        toggleIcon = document.querySelector(
          '.mainNavBarDesktop__menuItemBtn--toggleMainMenu .mainNavBarDesktop__menuItemIcon'
        );
        const newIconClass = toggleIcon.className;
        // The icon class should change when menu state changes
        expect(newIconClass).not.toBe(initialIconClass);
      });
    });
  });

  describe('when ip-branding FF is off', () => {
    it('does not render img tag', () => {
      renderWithProviders(<DesktopMenu {...props} />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  // Keep the existing planning tests
  describe('Planning menu tests', () => {
    const planningProps = {
      permissions: {
        canCreateImports: false,
        canCreateMetric: true,
        canEditMetrics: true,
        canEditSquad: false,
        canManageAthletes: true,
        canManageDashboard: true,
        canManageGeneralSettings: true,
        canManageOfficials: false,
        canManageScouts: false,
        canManageOrgSettings: true,
        canManageQuestionnaires: true,
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
      t: i18nT,
    };

    beforeEach(() => {
      window.setFlag('planning-session-planning', true);
      window.setFlag('collections-side-panel', true);
    });

    afterEach(() => {
      window.setFlag('planning-session-planning', false);
      window.setFlag(
        'cd-athlete-sharing-hide-athlete-and-squad-planning-options',
        false
      );
      window.setFlag('collections-side-panel', false);
    });

    it('displays squads & athletes in planning secondary menu', async () => {
      const user = userEvent.setup();
      renderWithProviders(<DesktopMenu {...planningProps} />);

      await user.click(screen.getByText(/planning/i));

      expect(
        screen.getByRole('link', { name: /schedule/i })
      ).toBeInTheDocument();
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
        const user = userEvent.setup();
        window.setFlag(
          'cd-athlete-sharing-hide-athlete-and-squad-planning-options',
          true
        );
        renderWithProviders(<DesktopMenu {...planningProps} />);

        await user.click(screen.getByText(/planning/i));

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
});
