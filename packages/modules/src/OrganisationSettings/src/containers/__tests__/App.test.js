import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { server, rest } from '@kitman/services/src/mocks/server';
import AppContainer from '../App';

describe('Organisation Settings App Container', () => {
  let user;
  let preloadedState;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    window.featureFlags = {};

    // Define a base preloaded state for the Redux store
    preloadedState = {
      toastsSlice: {
        value: [],
      },
      orgSettings: {
        graphColourPalette: [],
        groupedWorkloadOptions: [
          { name: 'Kitman', isGroupOption: true },
          { id: 'kitman|workload', name: 'RPE x Duration' },
        ],
        primaryWorkloadVariableId: 'kitman|workload',
        secondaryWorkloadVariableId: 'catapult|total_distance',
        gameRpeCollection: { kioskApp: true, athleteApp: true },
        trainingRpeCollection: { kioskApp: true, athleteApp: true },
        gameParticipationLevels: [],
        trainingParticipationLevels: [],
        nameFormattings: {
          display_name: {
            active: 1,
            options: [{ id: 1, title: 'First, Last' }],
          },
          shortened_name: { active: 1, options: [{ id: 1, title: 'F. Last' }] },
        },
        integrations: {
          activeIntegrations: [],
          availableIntegrations: [],
          addIntegrationModal: { isOpen: false },
          unlinkIntegrationModal: { isOpen: false, unlinkUrl: null },
        },
        security: {
          privacyPolicy: {
            editing: false,
            isActive: false,
            updatedText: '',
            currentText: '',
          },
          updatePrivacyPolicyModal: { isOpen: false },
        },
        legal: {
          termsOfUsePolicy: {
            editing: false,
            isActive: false,
            updatedText: '',
            currentText: '',
          },
          updateTermsOfUsePolicyModal: { isOpen: false },
        },
      },
      appStatus: { status: null, message: null },
      coachingPrinciples: { isEnabled: false },
    };

    // Mock API calls made on mount
    server.use(
      rest.get('/are_coaching_principles_enabled', (req, res, ctx) => {
        return res(ctx.json({ value: false }));
      }),
      rest.get('/permissions', (req, res, ctx) => {
        // Default to no special permissions
        return res(ctx.json({ settings: [] }));
      })
    );
  });

  it('renders the TabBar', () => {
    renderWithRedux(<AppContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Workload')).toBeInTheDocument();
  });

  it('switches to the "Workload" tab and displays its content on click', async () => {
    renderWithRedux(<AppContainer />, {
      useGlobalStore: false,
      preloadedState,
    });

    const workloadTab = screen.getByRole('tab', { name: 'Workload' });
    await user.click(workloadTab);

    // The Workload tab should now be selected
    expect(workloadTab).toHaveAttribute('aria-selected', 'true');
    // Content from the Workload tab should be visible
    expect(screen.getAllByText('RPE collection channels')).toHaveLength(2);
  });
});
