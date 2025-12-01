import { screen } from '@testing-library/react';
import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import { server, rest } from '@kitman/services/src/mocks/server';
import '@testing-library/jest-dom';
import { mockPreferencesContext, cleanUpPreferencesContext } from './testUtils';
import { PreferencesProvider, usePreferences } from '../preferenceContext';

describe('PreferencesContext', () => {
  const TestingComponent = () => {
    const { preferences } = usePreferences();
    return (
      <>
        <p id="preferences">{JSON.stringify(preferences)}</p>
        <p>{`preferences.coaching_principles: ${preferences.coaching_principles}`}</p>
        <p>{`preferences.moved_players_in_organisation_at_event: ${preferences.moved_players_in_organisation_at_event}`}</p>
      </>
    );
  };

  const mockContext = {
    preferences: {
      coaching_principles: true,
      custom_privacy_policy: true,
      enable_activity_type_category: true,
      moved_players_in_organisation_at_event: true,
      use_custom_terms_of_use_policy: true,
    },
  };

  describe('Preferences Provider', () => {
    it('renders the provider correctly', () => {
      renderWithProviders(
        <PreferencesProvider>
          <div>Success</div>
        </PreferencesProvider>
      );

      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('renders with a failed api call', () => {
      server.use(
        rest.post('/organisation_preferences/fetch', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );
      renderWithProviders(
        <PreferencesProvider>
          <div>Failed</div>
        </PreferencesProvider>
      );
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });
  });

  describe('Preferences Context', () => {
    beforeEach(() => {
      mockPreferencesContext(mockContext);
    });

    afterEach(() => {
      cleanUpPreferencesContext();
    });

    it('sets the context correctly', () => {
      renderWithProviders(<TestingComponent />);
      expect(
        screen.getByText('preferences.coaching_principles: true')
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'preferences.moved_players_in_organisation_at_event: true'
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          '{"coaching_principles":true,"custom_privacy_policy":true,"enable_activity_type_category":true,"moved_players_in_organisation_at_event":true,"use_custom_terms_of_use_policy":true}'
        )
      ).toBeInTheDocument();
    });
  });
});
