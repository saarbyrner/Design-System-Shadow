import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppRoot from '@kitman/modules/src/AppRoot';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { server, rest } from '@kitman/services/src/mocks/server';
import userEvent from '@testing-library/user-event';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import {
  MockedManageAthletesContextProvider,
  mockedManageAthletesContextValue,
} from '../../contexts/mocks';
import PageHeader from '../PageHeader';

describe('<PageHeader />', () => {
  const getTooltipMenuButton = (container) => {
    return container.querySelector('.icon-more'); // this button doesn't have text
  };

  const props = {
    t: i18nextTranslateStub(),
  };

  it('displays the page title', () => {
    render(<PageHeader {...props} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Manage athletes'
    );
  });

  it('displays an Add Athlete button', () => {
    render(
      <MockedManageAthletesContextProvider
        manageAthletesContext={mockedManageAthletesContextValue}
      >
        <PageHeader {...props} />
      </MockedManageAthletesContextProvider>
    );

    expect(screen.getByRole('link', { name: 'New Athlete' })).toHaveAttribute(
      'href',
      '/settings/athletes/new'
    );
  });

  it('hides an Add Athlete button when hideCreateAthleteButton true', () => {
    render(
      <MockedManageAthletesContextProvider
        manageAthletesContext={{
          ...mockedManageAthletesContextValue,
          hideCreateAthleteButton: true,
        }}
      >
        <PageHeader {...props} />
      </MockedManageAthletesContextProvider>
    );

    expect(screen.queryByText('New Athlete')).not.toBeInTheDocument();
  });

  describe('when league-ops-mass-create-athlete-staff is enabled and the user has the create import permission', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = true;
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('displays a mass upload button', () => {
      renderWithProviders(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              settings: { canCreateImports: true },
              general: {},
            },
          }}
        >
          <MockedManageAthletesContextProvider
            manageAthletesContext={mockedManageAthletesContextValue}
          >
            <PageHeader {...props} />
          </MockedManageAthletesContextProvider>
        </MockedPermissionContextProvider>
      );

      expect(
        screen.getByRole('button', { name: /Upload Athletes/i })
      ).toBeInTheDocument();
    });

    it('displays a download csv button', () => {
      renderWithProviders(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              settings: { canCreateImports: true },
              general: {},
            },
          }}
        >
          <MockedManageAthletesContextProvider
            manageAthletesContext={mockedManageAthletesContextValue}
          >
            <PageHeader {...props} />
          </MockedManageAthletesContextProvider>
        </MockedPermissionContextProvider>
      );

      expect(
        screen.getByRole('button', { name: /Download CSV/i })
      ).toBeInTheDocument();
    });
  });

  describe('Training Session Reminder', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = true;
      server.use(
        rest.post('/settings/athlete_push', (req, res, ctx) =>
          res(ctx.status(200))
        )
      );
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('Shows the correct modal content when all athletes ar compliants', async () => {
      const component = renderWithProviders(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              settings: { canViewSettingsQuestionnaire: true },
              general: { canManageAbsence: true },
            },
          }}
        >
          <MockedManageAthletesContextProvider
            manageAthletesContext={{
              ...mockedManageAthletesContextValue,
              nonCompliantAthletes: {
                wellbeing: [],
                session: [],
              },
            }}
          >
            <PageHeader {...props} />{' '}
          </MockedManageAthletesContextProvider>
        </MockedPermissionContextProvider>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Training Session Reminder'));

      expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
        'All athletes have added a training session today.'
      );

      const NoSessionsEnteredbutton = screen.queryByRole('button', {
        name: 'No sessions entered',
      });
      expect(NoSessionsEnteredbutton).not.toBeInTheDocument();
    });

    it('sends notifications to athletes when clicking the Entire Squad button', async () => {
      const component = render(
        <AppRoot>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                settings: { canViewSettingsQuestionnaire: true },
                general: { canManageAbsence: true },
              },
            }}
          >
            <MockedManageAthletesContextProvider
              manageAthletesContext={{
                ...mockedManageAthletesContextValue,
                nonCompliantAthletes: {
                  wellbeing: [],
                  session: [1, 2, 3],
                },
              }}
            >
              <PageHeader {...props} />{' '}
            </MockedManageAthletesContextProvider>
          </MockedPermissionContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Training Session Reminder'));

      expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
        '3 athlete have not entered an RPE today.'
      );

      await userEvent.click(
        screen.getByRole('button', { name: 'Entire squad', hidden: true })
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Push Notifications Sent')
        ).toBeInTheDocument();
      });
    });

    it("sends notifications to non compliant athletes when clicking the 'No sessions entered' button", async () => {
      const component = render(
        <AppRoot>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                settings: { canViewSettingsQuestionnaire: true },
                general: { canManageAbsence: true },
              },
            }}
          >
            <MockedManageAthletesContextProvider
              manageAthletesContext={{
                ...mockedManageAthletesContextValue,
                nonCompliantAthletes: {
                  wellbeing: [],
                  session: [1, 2, 3],
                },
              }}
            >
              <PageHeader {...props} />{' '}
            </MockedManageAthletesContextProvider>
          </MockedPermissionContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Training Session Reminder'));

      expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
        '3 athlete have not entered an RPE today.'
      );

      await userEvent.click(
        screen.getByRole('button', {
          name: 'No sessions entered',
          hidden: true,
        })
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Push Notifications Sent')
        ).toBeInTheDocument();
      });
    });

    it('Shows an error when the request fails', async () => {
      server.use(
        rest.post('/settings/athlete_push', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      const component = render(
        <AppRoot>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                settings: { canViewSettingsQuestionnaire: true },
                general: { canManageAbsence: true },
              },
            }}
          >
            <MockedManageAthletesContextProvider
              manageAthletesContext={{
                ...mockedManageAthletesContextValue,
                nonCompliantAthletes: {
                  wellbeing: [],
                  session: [1, 2, 3],
                },
              }}
            >
              <PageHeader {...props} />{' '}
            </MockedManageAthletesContextProvider>
          </MockedPermissionContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Training Session Reminder'));

      await userEvent.click(
        screen.getByRole('button', { name: 'Entire squad', hidden: true })
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Error sending push notifications')
        ).toBeInTheDocument();
      });
    });

    it('closes the training session modal when clicking cancel', async () => {
      const component = renderWithProviders(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              settings: { canViewSettingsQuestionnaire: true },
              general: { canManageAbsence: true },
            },
          }}
        >
          <MockedManageAthletesContextProvider
            manageAthletesContext={{
              ...mockedManageAthletesContextValue,
              nonCompliantAthletes: {
                wellbeing: [],
                session: [1, 2, 3],
              },
            }}
          >
            <PageHeader {...props} />{' '}
          </MockedManageAthletesContextProvider>
        </MockedPermissionContextProvider>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Training Session Reminder'));

      await userEvent.click(
        screen.getByRole('button', { name: 'Cancel', hidden: true })
      );

      expect(screen.queryByTestId('Modal|Content')).not.toBeInTheDocument();
    });
  });

  describe('Well Being Reminder', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = true;
      server.use(
        rest.post('/settings/athlete_push', (req, res, ctx) =>
          res(ctx.status(200))
        )
      );
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('Shows the correct modal content when all athletes ar compliants', async () => {
      const component = renderWithProviders(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              settings: { canViewSettingsQuestionnaire: true },
              general: { canManageAbsence: true },
            },
          }}
        >
          <MockedManageAthletesContextProvider
            manageAthletesContext={{
              ...mockedManageAthletesContextValue,
              nonCompliantAthletes: {
                wellbeing: [],
                session: [],
              },
            }}
          >
            <PageHeader {...props} />{' '}
          </MockedManageAthletesContextProvider>
        </MockedPermissionContextProvider>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Well-being Reminder'));

      expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
        'All athletes have screened today'
      );
    });

    it('sends notifications to athletes when clicking send notification button', async () => {
      const component = render(
        <AppRoot>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                settings: { canViewSettingsQuestionnaire: true },
                general: { canManageAbsence: true },
              },
            }}
          >
            <MockedManageAthletesContextProvider
              manageAthletesContext={{
                ...mockedManageAthletesContextValue,
                nonCompliantAthletes: {
                  wellbeing: [1, 2, 3],
                  session: [],
                },
              }}
            >
              <PageHeader {...props} />{' '}
            </MockedManageAthletesContextProvider>
          </MockedPermissionContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Well-being Reminder'));

      expect(screen.getByTestId('Modal|Content')).toHaveTextContent(
        'Do you want to send a Well-being reminder notification to 3 athlete?'
      );

      await userEvent.click(
        screen.getByRole('button', { name: 'Send notification', hidden: true })
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Push Notifications Sent')
        ).toBeInTheDocument();
      });
    });

    it('Shows an error when the request fails', async () => {
      server.use(
        rest.post('/settings/athlete_push', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      const component = render(
        <AppRoot>
          <MockedPermissionContextProvider
            permissionsContext={{
              ...mockedDefaultPermissionsContextValue,
              permissions: {
                ...mockedDefaultPermissionsContextValue.permissions,
                settings: { canViewSettingsQuestionnaire: true },
                general: { canManageAbsence: true },
              },
            }}
          >
            <MockedManageAthletesContextProvider
              manageAthletesContext={{
                ...mockedManageAthletesContextValue,
                nonCompliantAthletes: {
                  wellbeing: [1, 2, 3],
                  session: [],
                },
              }}
            >
              <PageHeader {...props} />{' '}
            </MockedManageAthletesContextProvider>
          </MockedPermissionContextProvider>
        </AppRoot>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Well-being Reminder'));

      await userEvent.click(
        screen.getByRole('button', { name: 'Send notification', hidden: true })
      );

      await waitFor(() => {
        expect(
          screen.queryByText('Error sending push notifications')
        ).toBeInTheDocument();
      });
    });

    it('closes the well being modal when clicking cancel', async () => {
      const component = renderWithProviders(
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: {
              ...mockedDefaultPermissionsContextValue.permissions,
              settings: { canViewSettingsQuestionnaire: true },
              general: { canManageAbsence: true },
            },
          }}
        >
          <MockedManageAthletesContextProvider
            manageAthletesContext={{
              ...mockedManageAthletesContextValue,
              nonCompliantAthletes: {
                wellbeing: [1, 2, 3],
                session: [],
              },
            }}
          >
            <PageHeader {...props} />{' '}
          </MockedManageAthletesContextProvider>
        </MockedPermissionContextProvider>
      );

      await userEvent.click(getTooltipMenuButton(component.container));
      await userEvent.click(screen.getByText('Well-being Reminder'));

      await userEvent.click(
        screen.getByRole('button', { name: 'Cancel', hidden: true })
      );

      expect(screen.queryByTestId('Modal|Content')).not.toBeInTheDocument();
    });
  });
});
