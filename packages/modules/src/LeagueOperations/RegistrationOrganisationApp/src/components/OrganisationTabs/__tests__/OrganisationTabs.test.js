/* eslint-disable camelcase */
import * as reduxHooks from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import i18n from '@kitman/common/src/utils/i18n';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { useLeagueOperations } from '@kitman/common/src/hooks';
import useGridActions from '@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { usePreferences } from '@kitman/common/src/contexts/PreferenceContext/preferenceContext';
import OrganisationTabs from '../index';

jest.mock('@kitman/common/src/hooks/useLeagueOperations');
jest.mock('@kitman/common/src/contexts/PermissionsContext');
jest.mock('@kitman/common/src/contexts/PreferenceContext/preferenceContext');
jest.mock('@kitman/modules/src/LeagueOperations/shared/hooks/useGridActions');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetPreferencesQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
});

const renderTestComponentWithProviders = (
  {
    registrationPermissions,
    homegrownPermissions,
    organisation_id,
    currentUserType,
  },
  { isLeague, isOrgSupervised, isOfficial, isScout } = {},
  { viewKits = false, leagueGameKits = false, homegrown = false } = {}
) => {
  useLeagueOperations.mockReturnValue({
    isLeague,
    isOrgSupervised,
    isOfficial,
    isScout,
  });

  usePermissions.mockReturnValue({
    permissions: {
      leagueGame: {
        viewKits,
      },
    },
  });

  usePreferences.mockReturnValue({
    preferences: {
      league_game_kits: leagueGameKits,
      homegrown,
    },
  });
  useGridActions.mockReturnValue({});
  render(
    <Provider store={defaultStore}>
      <I18nextProvider i18n={i18n}>
        <OrganisationTabs
          registrationPermissions={registrationPermissions}
          homegrownPermissions={homegrownPermissions}
          organisation_id={organisation_id}
          currentUserType={currentUserType}
        />
      </I18nextProvider>
    </Provider>
  );
};

describe('OrganisationTabs Component', () => {
  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useSelector').mockImplementation(jest.fn());
  });

  it('renders correctly with all tabs', () => {
    const registrationPermissions = {
      organisation: { canView: true },
      athlete: { canView: true },
      staff: { canView: true },
    };
    const homegrownPermissions = {
      canViewHomegrown: true,
    };
    const organisation_id = 123;
    const currentUserType = 'association_admin';

    renderTestComponentWithProviders(
      {
        registrationPermissions,
        homegrownPermissions,
        organisation_id,
        currentUserType,
      },
      {},
      { homegrown: true }
    );
    expect(screen.getAllByRole('tab')).toHaveLength(5);
  });

  it('renders only permitted tabs', () => {
    const registrationPermissions = {
      organisation: { canView: false },
      athlete: { canView: true },
      staff: { canView: false },
    };
    const organisation_id = 456;
    const currentUserType = 'athlete';
    renderTestComponentWithProviders({
      registrationPermissions,
      organisation_id,
      currentUserType,
    });
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('switches tabs correctly', () => {
    const registrationPermissions = {
      organisation: { canView: true },
      athlete: { canView: true },
      staff: { canView: true },
    };
    const organisation_id = 789;
    const currentUserType = 'association_admin';

    renderTestComponentWithProviders({
      registrationPermissions,
      organisation_id,
      currentUserType,
    });

    fireEvent.click(screen.getAllByRole('tab')[1]);
    expect(screen.getByRole('tabpanel', { name: 'Teams' })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('tab')[2]);
    expect(
      screen.queryByRole('tabpanel', { name: 'Teams' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('tabpanel', { name: 'Players' })
    ).toBeInTheDocument();
  });

  describe('"Kits" tab', () => {
    const registrationPermissions = {
      organisation: { canView: true },
      athlete: { canView: true },
      staff: { canView: true },
    };
    const organisation_id = 123;
    const currentUserType = 'association_admin';

    it('renders for league users, when permission/preference is true', () => {
      renderTestComponentWithProviders(
        {
          registrationPermissions,
          organisation_id,
          currentUserType,
        },
        {
          isLeague: true,
          isOrgSupervised: false,
        },
        { viewKits: true, leagueGameKits: true }
      );

      expect(screen.getByRole('tab', { name: 'Kits' })).toBeInTheDocument();
    });

    it('does not renders for club league users, when preference is false', () => {
      renderTestComponentWithProviders(
        {
          registrationPermissions,
          organisation_id,
          currentUserType,
        },
        {
          isLeague: true,
          isOrgSupervised: false,
        },
        { viewKits: true, leagueGameKits: false }
      );

      expect(
        screen.queryByRole('tab', { name: 'Kits' })
      ).not.toBeInTheDocument();
    });

    it('renders for club admin users', () => {
      renderTestComponentWithProviders(
        {
          registrationPermissions,
          organisation_id,
          currentUserType,
        },
        {
          isLeague: false,
          isOrgSupervised: true,
        },
        { viewKits: true, leagueGameKits: true }
      );

      expect(screen.getByRole('tab', { name: 'Kits' })).toBeInTheDocument();
    });

    it('hides for officials', () => {
      renderTestComponentWithProviders(
        {
          registrationPermissions,
          organisation_id,
          currentUserType,
        },
        {
          isOfficial: true,
        },
        { viewKits: true, leagueGameKits: true }
      );

      expect(
        screen.queryByRole('tab', { name: 'Kits' })
      ).not.toBeInTheDocument();
    });

    it('hides for scouts', () => {
      renderTestComponentWithProviders(
        {
          registrationPermissions,
          organisation_id,
          currentUserType,
        },
        {
          isScout: true,
        },
        { viewKits: true, leagueGameKits: true }
      );

      expect(
        screen.queryByRole('tab', { name: 'Kits' })
      ).not.toBeInTheDocument();
    });
  });
});
