import { screen, waitFor } from '@testing-library/react';
import selectEvent from 'react-select-event';

import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { server, rest } from '@kitman/services/src/mocks/server';

import AppHeader from '../index';

jest.mock('../resources/PHIAndPIICheck', () => ({
  __esModule: true,
  default: jest.fn(() => ({ isMedicalPage: true, isPHI: false, isPII: false })),
}));

jest.mock('@kitman/modules/src/DisclaimerPopupModal/utils/index', () => ({
  getDisclaimerContent: jest.fn(() => ({
    title: 'Disclaimer',
    content: <p>Disclaimer content</p>,
    footerButtonText: 'Agree',
  })),
  DISCLAIMER_TYPE: {
    NFL_PLAYER_DISCLAIMER: 'NFL_PLAYER_DISCLAIMER',
  },
}));

describe('<AppHeader /> component', () => {
  let props;

  describe('when ip-branding flag is on', () => {
    beforeEach(() => {
      window.featureFlags['ip-login-branding'] = true;
    });

    afterEach(() => {
      window.featureFlags['ip-login-branding'] = false;
    });

    it('Contains the organisation image', async () => {
      renderWithProviders(
        <AppHeader {...props} orgNickname="test-org-nickname" />
      );

      await waitFor(() =>
        expect(
          screen.getByRole('img', { name: `test-org-nickname's logo` })
        ).toBeInTheDocument()
      );
    });
  });

  beforeEach(() => {
    props = {
      logoPath: 'dummy/logo/path.png',
      currentUser: {
        firstname: 'Jon',
        lastname: 'Doe',
        athlete_id: null,
      },
      currentSquad: {
        created: '2013-10-17T16:10:14.000+01:00',
        created_by: null,
        duration: 80,
        id: 8,
        is_default: null,
        name: 'International Squad',
        updated: null,
      },
      availableSquads: [
        {
          created: '2015-09-07T13:29:54.000+01:00',
          created_by: null,
          duration: 80,
          id: 73,
          is_default: null,
          name: 'Academy Squad',
          updated: '2015-09-07T13:29:54.000+01:00',
        },
        {
          created: '2013-10-17T16:10:14.000+01:00',
          created_by: null,
          duration: 80,
          id: 8,
          is_default: null,
          name: 'International Squad',
          updated: null,
        },
        {
          created: '2016-04-22T21:56:44.000+01:00',
          created_by: null,
          duration: null,
          id: 262,
          is_default: null,
          name: 'Test',
          updated: '2016-04-22T21:56:44.000+01:00',
        },
      ],
    };
  });

  it('renders when the current squad is missing', () => {
    renderWithProviders(<AppHeader {...props} currentSquad={null} />);
    expect(screen.getByTestId('appHeader')).toBeInTheDocument();
  });

  it('renders the page name', () => {
    renderWithProviders(<AppHeader {...props} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('');
  });

  it('renders the squad selector', () => {
    renderWithProviders(<AppHeader {...props} />);
    expect(screen.getByTestId('squadSelector')).toBeInTheDocument();
  });

  it('renders the user menu', () => {
    renderWithProviders(<AppHeader {...props} />);
    expect(screen.getByTestId('profileTooltip')).toBeInTheDocument();
  });

  describe('when include_admin_bar true', () => {
    const renderComponent = () =>
      renderWithProviders(
        <AppHeader
          {...props}
          adminBar={{
            include_admin_bar: true,
            use_danger_style: false,
            organisation_list: [
              {
                label: 'Demo Accounts',
                options: [],
              },
              {
                label: 'Internal Accounts',
                options: [
                  {
                    value: 1,
                    label: 'Kitman Rugby Club',
                  },
                  {
                    value: 116,
                    label: 'KL Earthquakes',
                  },
                ],
              },
            ],
          }}
        />
      );

    const selectNewOrganisation = async () => {
      const OrganisationSelector = screen.getByTestId('OrganisationSelector');

      selectEvent.openMenu(
        OrganisationSelector.querySelector('.kitmanReactSelect input')
      );
      await selectEvent.select(
        OrganisationSelector.querySelector('.kitmanReactSelect'),
        'Kitman Rugby Club'
      );
    };

    beforeEach(() => {
      server.use(
        rest.put('/settings/organisation_switcher', (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );

      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost/href',
          pathname: '/href',
          hostname: 'localhost',
          reload: jest.fn(),
        },
        configurable: true,
        writable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          href: 'http://localhost/href',
          pathname: '/href',
          hostname: 'localhost',
          reload: jest.fn(),
        },
        configurable: true,
        writable: true,
      });
    });

    it('redirects to the root path if a new organisation is selected', async () => {
      renderComponent();

      await selectNewOrganisation();

      await waitFor(() => expect(window.location.href).toBe('/'));
    });

    it('doesnt’t reload the page if a new organisation is selected and isn’t connected to a custom target URL', async () => {
      Object.defineProperty(process, 'env', {
        value: {
          REACT_APP_TARGET: '',
        },
        configurable: true,
      });

      renderComponent();

      await selectNewOrganisation();

      await waitFor(() => expect(window.location.href).toBe('/'));
    });
  });

  describe('when iP for Commercial Use PHIAndPIIAlertBanner', () => {
    const bannerText =
      'Authorized Access Only: This page contains Protected Health Information (PHI). Use of this system is monitored. Unauthorized access or disclosure of PHI is prohibited and subject to legal action.';

    it('does not render a personal information warning banner', () => {
      renderWithProviders(<AppHeader {...props} />);
      expect(screen.queryByText(bannerText)).not.toBeInTheDocument();
    });
  });

  describe('when iP for Government Use PHIAndPIIAlertBanner', () => {
    beforeEach(() => {
      window.ipForGovernment = true;
    });

    afterEach(() => {
      window.ipForGovernment = false;
    });

    const bannerText =
      'Authorized Access Only: This page may contain Protected Health Information (PHI) and/or Personally Identifiable Information (PII). Use of this system is monitored. Unauthorized access or disclosure is prohibited and subject to legal action.';

    it('renders a personal information warning banner', async () => {
      renderWithProviders(<AppHeader {...props} />);
      await waitFor(() =>
        expect(screen.getByText(bannerText)).toBeInTheDocument()
      );
    });
  });

  describe('Displays the correct side-panel menu option', () => {
    describe('when player-selector flag is on', () => {
      beforeEach(() => {
        window.setFlag('player-selector-side-nav', true);
        window.setFlag('event-selector-side-nav', true);
      });

      afterEach(() => {
        window.setFlag('player-selector-side-nav', false);
        window.setFlag('event-selector-side-nav', false);
      });

      it('Contains the Player list button', async () => {
        renderWithProviders(
          <AppHeader
            {...props}
            orgNickname="test-org-nickname"
            permissions={{ medical: { issues: { canView: true } } }}
          />
        );

        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: 'Player list' })
          ).toBeInTheDocument()
        );
      });

      it('Contains the sessions button', async () => {
        Object.defineProperty(window, 'location', {
          value: {
            href: 'http://localhost/planning_hub/events/60731',
            pathname: '/planning_hub/events/60731',
            hostname: 'localhost',
            reload: jest.fn(),
          },
          configurable: true,
          writable: true,
        });

        window.history.pushState({}, 'Page Title', '');

        renderWithProviders(
          <AppHeader
            {...props}
            orgNickname="test-org-nickname"
            permissions={{ workloads: { canViewWorkload: true } }}
          />
        );

        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: 'Event list' })
          ).toBeInTheDocument()
        );
      });

      it('Contains the Player list button when event selector ff is off', async () => {
        window.setFlag('event-selector-side-nav', false);
        window.history.pushState(
          {},
          'Page Title',
          '/planning_hub/events/60731'
        );

        renderWithProviders(
          <AppHeader
            {...props}
            orgNickname="test-org-nickname"
            permissions={{ medical: { issues: { canView: true } } }}
          />
        );

        await waitFor(() =>
          expect(
            screen.getByRole('button', { name: 'Player list' })
          ).toBeInTheDocument()
        );
      });
    });
  });
});
