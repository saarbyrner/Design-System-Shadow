import { render, screen, within } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { DEFAULT_CONTEXT_VALUE } from '@kitman/common/src/contexts/PermissionsContext';
import { MockedPermissionContextProvider } from '@kitman/common/src/contexts/PermissionsContext/__tests__/testUtils';
import { defaultMedicalPermissions } from '@kitman/common/src/contexts/PermissionsContext/medical';
import Filters from '../Filters';

import {
  useGetPermittedSquadsQuery,
  useGetPositionGroupsQuery,
} from '../../../../../../shared/redux/services/medical';

jest.mock('../../../../../../shared/redux/services/medical');
jest.mock('@kitman/services');

describe('<Actions/>', () => {
  const defaultProps = {
    t: i18nextTranslateStub(),
    isDisabled: false,
    onUpdateFilters: jest.fn(),
    filters: {
      athlete_name: null,
      positions: [],
      squads: [],
      availabilities: [],
      issues: [],
    },
  };

  const defaultPermissions = {
    medical: {
      ...defaultMedicalPermissions,
    },
  };

  const renderTestComponent = (permissions = defaultPermissions, props) =>
    render(
      <MockedPermissionContextProvider
        permissionsContext={{ ...DEFAULT_CONTEXT_VALUE, permissions }}
      >
        <Filters {...{ ...defaultProps, ...props }} />
      </MockedPermissionContextProvider>
    );

  beforeEach(() => {
    useGetPermittedSquadsQuery.mockReturnValue([
      { id: 1, name: 'First Squad' },
      { id: 2, name: 'Second Squad' },
    ]);
    useGetPositionGroupsQuery.mockReturnValue([
      {
        id: 1,
        name: 'Position group 1',
        positions: [
          {
            id: 1,
            name: 'Position 1',
          },
        ],
      },
      {
        id: 2,
        name: 'Position group 2',
        positions: [
          {
            id: 2,
            name: 'Position 2',
          },
        ],
      },
    ]);
  });

  afterEach(() => {
    window.featureflags = {};
  });

  describe('Filters', () => {
    it('[DEFAULT] it renders the correct filters', () => {
      renderTestComponent();
      const mobileComponent = screen.getByTestId('Filters|MobileFilters');
      const desktopComponent = screen.getByTestId('Filters|DesktopFilters');

      expect(
        within(desktopComponent).getByPlaceholderText(/Search athletes/i)
      ).toBeInTheDocument();
      expect(
        within(mobileComponent).getByPlaceholderText(/Search athletes/i)
      ).toBeInTheDocument();
      expect(within(desktopComponent).getByText(/Squad/i)).toBeInTheDocument();
      expect(within(mobileComponent).getByText(/Squad/i)).toBeInTheDocument();
      expect(
        within(desktopComponent).getByText(/Position/i)
      ).toBeInTheDocument();
      expect(
        within(mobileComponent).getByText(/Position/i)
      ).toBeInTheDocument();
    });

    it('[FEATURE FLAG] availability-info-disabled', () => {
      window.featureFlags['availability-info-disabled'] = false;
      renderTestComponent({
        ...defaultPermissions,
        medical: {
          ...defaultPermissions.medical,
          availability: {
            canView: true,
          },
        },
      });
      const desktopComponent = screen.getByTestId('Filters|DesktopFilters');
      const mobileComponent = screen.getByTestId('Filters|MobileFilters');
      expect(
        within(desktopComponent).getByText(/Availability/i)
      ).toBeInTheDocument();
      expect(
        within(mobileComponent).getByText(/Availability/i)
      ).toBeInTheDocument();
    });

    it('[FEATURE FLAG] injured-filter-on-roster-page', () => {
      window.featureFlags['injured-filter-on-roster-page'] = true;
      renderTestComponent();
      const desktopComponent = screen.getByTestId('Filters|DesktopFilters');
      const mobileComponent = screen.getByTestId('Filters|MobileFilters');
      expect(
        within(desktopComponent).getByText(/Injured/i)
      ).toBeInTheDocument();
      expect(within(mobileComponent).getByText(/Injured/i)).toBeInTheDocument();
    });
  });
});
