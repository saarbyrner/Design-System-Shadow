import { screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  storeFake,
  i18nextTranslateStub,
  renderWithUserEventSetup,
} from '@kitman/common/src/utils/test_utils';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetPreferencesQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { mockedDefaultPermissionsContextValue } from '@kitman/modules/src/Medical/shared/utils/testUtils';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import ReportManager from '../index';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetOrganisationQuery: jest.fn(),
  useGetPermissionsQuery: jest.fn(),
  useGetPreferencesQuery: jest.fn(),
}));

const defaultProps = {
  squads: [1],
  t: i18nextTranslateStub(),
};

describe('ReportManager', () => {
  beforeEach(() => {
    useGetOrganisationQuery.mockReturnValue({
      data: { coding_system_key: 'OSICS_10' },
      isLoading: false,
      error: false,
    });
    useGetPreferencesQuery.mockReturnValue({
      data: { osha_300_report: false },
      isLoading: false,
      error: false,
    });
  });

  const renderComponentWithDynamicMocks = (
    props = defaultProps,
    permissionsOverride = {},
    featureFlagsOverride = {}
  ) => {
    const finalPermissions = {
      ...mockedDefaultPermissionsContextValue.permissions,
      medical: {
        ...mockedDefaultPermissionsContextValue.permissions.medical,
        issues: { canExport: true },
        ...permissionsOverride.medical,
      },
      settings: {
        ...mockedDefaultPermissionsContextValue.permissions.settings,
        canViewSettingsAthletes: true,
        ...permissionsOverride.settings,
      },
      ...permissionsOverride,
    };

    const finalFeatureFlags = {
      'pm-player-detail-report': true,
      'nfl-injury-report': true,
      ...featureFlagsOverride,
    };

    Object.keys(finalFeatureFlags).forEach((flag) => {
      window.featureFlags[flag] = finalFeatureFlags[flag];
    });

    useGetPermissionsQuery.mockReturnValue({
      data: finalPermissions,
      isLoading: false,
      error: false,
    });

    return renderWithUserEventSetup(
      <Provider store={storeFake({ medicalApi: {}, globalApi: {} })}>
        <MockedPermissionContextProvider
          permissionsContext={{
            ...mockedDefaultPermissionsContextValue,
            permissions: finalPermissions,
          }}
        >
          <ReportManager {...props} />
        </MockedPermissionContextProvider>
      </Provider>
    );
  };

  it('renders the Download button', () => {
    renderComponentWithDynamicMocks();
    expect(
      screen.getByRole('button', { name: 'Download' })
    ).toBeInTheDocument();
  });

  describe('[feature-flag] pm-player-detail-report', () => {
    it('does not render Player Detail Report when feature flag is off', () => {
      renderComponentWithDynamicMocks(
        defaultProps,
        {},
        { 'pm-player-detail-report': false }
      );
      expect(
        screen.queryByText('Player Detail Report')
      ).not.toBeInTheDocument();
    });

    it('does not render Player Detail Report when medical issues canExport permission is off', () => {
      renderComponentWithDynamicMocks(defaultProps, {
        medical: { issues: { canExport: false } },
      });
      expect(
        screen.queryByText('Player Detail Report')
      ).not.toBeInTheDocument();
    });

    it('does not render Player Detail Report when settings canViewSettingsAthletes permission is off', () => {
      renderComponentWithDynamicMocks(defaultProps, {
        settings: { canViewSettingsAthletes: false },
      });
      expect(
        screen.queryByText('Player Detail Report')
      ).not.toBeInTheDocument();
    });

    it('renders Player Detail Report when feature flag is on and all permissions are granted', async () => {
      const { user } = renderComponentWithDynamicMocks(defaultProps, {
        medical: { issues: { canExport: true } },
        settings: { canViewSettingsAthletes: true },
      });

      await user.click(screen.getByRole('button', { name: 'Download' }));

      await user.click(screen.getByText('Player Detail Report'));

      const drawer = await screen.findByRole('presentation');
      expect(
        await within(drawer).findByText('Player Detail Report')
      ).toBeInTheDocument();
    });
  });
});
