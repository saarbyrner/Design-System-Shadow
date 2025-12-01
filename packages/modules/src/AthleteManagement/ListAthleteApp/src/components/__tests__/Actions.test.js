import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import userEvent from '@testing-library/user-event';

import Actions from '../Actions';

jest.mock(
  '@kitman/common/src/contexts/PreferenceContext/preferenceContext',
  () => ({
    usePreferences: jest.fn().mockReturnValue({
      preferences: {
        league_game_communications: false,
      },
    }),
  })
);

describe('<Actions/>', () => {
  beforeEach(() => {
    window.setFlag('league-ops-athlete-pdf-download', true);
  });

  afterEach(() => {
    window.setFlag('league-ops-athlete-pdf-download', false);
  });

  describe('New Athlete button', () => {
    const queriesState = {
      queries: {
        'getPermissions(undefined)': {
          data: {
            settings: {
              canCreateImports: false,
              canViewSettingsQuestionnaire: false,
            },
            general: {
              canManageAbsence: false,
            },
          },
        },
      },
    };
    it('does render the new athlete button when isActivityTypeCategoryEnabled is false', () => {
      const localState = {
        globalApi: {
          queries: {
            'getPermissions(undefined)': {
              data: {
                settings: {
                  canCreateImports: false,
                  canViewSettingsQuestionnaire: false,
                },
                general: {
                  canManageAbsence: false,
                },
              },
            },
            'fetchOrganisationPreference("enable_activity_type_category")': {
              data: {
                value: false,
              },
              isLoading: false,
              status: 'fulfilled',
            },
          },
        },
      };
      renderWithProviders(<Actions isAssociationAdmin />, {
        preloadedState: localState,
      });
      expect(
        screen.getByRole('button', { name: 'New Athlete' })
      ).toBeInTheDocument();
    });

    it('does not render the new athlete button when isActivityTypeCategoryEnabled is true', () => {
      const localState = {
        globalApi: {
          queries: {
            'getPermissions(undefined)': {
              data: {
                settings: {
                  canCreateImports: false,
                  canViewSettingsQuestionnaire: false,
                },
                general: {
                  canManageAbsence: false,
                },
              },
            },
            'fetchOrganisationPreference("enable_activity_type_category")': {
              data: {
                value: true,
              },
            },
          },
        },
      };
      renderWithProviders(<Actions isAssociationAdmin />, {
        preloadedState: localState,
      });
      expect(() =>
        screen.getByRole('button', { name: 'New Athlete' })
      ).toThrow();
    });

    it('does render the new athlete button when manage-athletes-grid-mui FF is on and shouldHideAthleteCreateButton is false', () => {
      window.featureFlags['manage-athletes-grid-mui'] = true;

      const localState = {
        globalApi: {
          queries: {
            ...queriesState.queries,
            'fetchOrganisationPreference("hide_athlete_create_button")': {
              data: {
                value: false,
              },
              isLoading: false,
              status: 'fulfilled',
            },
          },
        },
      };

      renderWithProviders(<Actions isAssociationAdmin />, {
        preloadedState: localState,
      });

      expect(
        screen.getByRole('button', { name: 'New Athlete' })
      ).toBeInTheDocument();

      window.featureFlags['manage-athletes-grid-mui'] = false;
    });

    it('does not render the new athlete button when manage-athletes-grid-mui FF is on and shouldHideAthleteCreateButton is true', () => {
      window.featureFlags['manage-athletes-grid-mui'] = true;

      const localState = {
        globalApi: {
          queries: {
            ...queriesState.queries,
            'fetchOrganisationPreference("hide_athlete_create_button")': {
              data: {
                value: true,
              },
              isLoading: false,
              status: 'fulfilled',
            },
          },
        },
      };

      renderWithProviders(<Actions isAssociationAdmin />, {
        preloadedState: localState,
      });

      expect(
        screen.queryByRole('button', { name: 'New Athlete' })
      ).not.toBeInTheDocument();

      window.featureFlags['manage-athletes-grid-mui'] = false;
    });
  });
  describe('[FEATURE FLAG] league-ops-mass-create-athlete-staff', () => {
    beforeEach(() => {
      window.featureFlags['league-ops-mass-create-athlete-staff'] = true;
    });
    afterEach(() => {
      window.featureFlags = {};
    });
    const localState = {
      globalApi: {
        queries: {
          'getPermissions(undefined)': {
            data: {
              settings: {
                canCreateImports: true,
                canViewSettingsQuestionnaire: false,
              },
              general: {
                canManageAbsence: false,
              },
            },
          },

          'fetchOrganisationPreference("enable_activity_type_category")': {
            data: {
              value: false,
            },
          },
        },
      },
    };
    it('shows the upload elements when enabled and the correct permission', () => {
      renderWithProviders(<Actions isAssociationAdmin />, {
        preloadedState: localState,
      });
      expect(
        screen.getByRole('button', { name: 'Upload Athletes' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Download csv' })
      ).toBeInTheDocument();
    });
  });
  describe('[PERMISSIONS] for reminder notifications', () => {
    const localState = {
      globalApi: {
        queries: {
          'getPermissions(undefined)': {
            data: {
              settings: {
                canCreateImports: false,
                canViewSettingsQuestionnaire: true,
              },
              general: {
                canManageAbsence: true,
              },
            },
          },

          'fetchOrganisationPreference("enable_activity_type_category")': {
            data: {
              value: false,
            },
          },
        },
      },
    };
    it('shows the tooltip menu', () => {
      const component = renderWithProviders(<Actions isAssociationAdmin />, {
        preloadedState: localState,
      });
      const tooltip = component.container.querySelector('.icon-more');

      expect(tooltip).toBeInTheDocument();
    });
  });

  describe('All Athletes PDF', () => {
    const localState = {
      globalApi: {
        queries: {
          'getPermissions(undefined)': {
            data: {
              settings: {
                canCreateImports: false,
                canViewSettingsQuestionnaire: true,
              },
              general: {
                canManageAbsence: true,
              },
            },
          },

          'fetchOrganisationPreference("enable_activity_type_category")': {
            data: {
              value: false,
            },
          },
        },
      },
    };

    beforeEach(() => {});

    it('renders the All Athletes PDF button when the preference is enabled at the club level', async () => {
      usePreferences.mockReturnValue({
        preferences: {
          league_game_communications: true,
        },
      });
      const user = userEvent.setup();
      renderWithProviders(
        <Actions isAssociationAdmin isLeagueStaffUser={false} />,
        {
          preloadedState: localState,
        }
      );
      const teamBtn = screen.getByRole('button', { name: 'Team' });
      await user.click(teamBtn);
      expect(teamBtn).toBeDisabled();
    });

    it('hides the All Athletes PDF button when the preference is disabled at the club level', async () => {
      usePreferences.mockReturnValue({
        preferences: {
          league_game_communications: false,
        },
      });

      renderWithProviders(
        <Actions isAssociationAdmin isLeagueStaffUser={false} />,
        {
          preloadedState: localState,
        }
      );
      expect(
        screen.queryByRole('button', { name: 'Team' })
      ).not.toBeInTheDocument();
    });
    it('hides the All Athletes PDF button when the feature flag is off', async () => {
      window.setFlag('league-ops-athlete-pdf-download', false);
      renderWithProviders(
        <Actions isAssociationAdmin isLeagueStaffUser={false} />,
        {
          preloadedState: localState,
        }
      );
      expect(
        screen.queryByRole('button', { name: 'Team' })
      ).not.toBeInTheDocument();
    });
  });
});
