import { waitFor, screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { useParams } from 'react-router-dom';
import * as PermissionsContext from '@kitman/common/src/contexts/PermissionsContext';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import { useGetDashboardGroupsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { data as mockDashboardGroups } from '@kitman/services/src/mocks/handlers/analysis/getDashboardGroups';

import LookerDashboardGroup from '../LookerDashboardGroup';

jest.mock('@kitman/common/src/hooks/useLocationAssign', () => jest.fn());

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetDashboardGroupsQuery: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('<LookerDashboardGroup />', () => {
  const mockLocationAssign = jest.fn();

  beforeEach(() => {
    useLocationAssign.mockReturnValue(mockLocationAssign);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when permissionsRequestStatus is PENDING', () => {
    beforeEach(() => {
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {},
        permissionsRequestStatus: 'PENDING',
      });
    });

    it('renders the DelayedLoadingFeedback component', async () => {
      renderWithRedux(<LookerDashboardGroup />);
      await waitFor(() =>
        expect(screen.getByText('Loading ...')).toBeInTheDocument()
      );
    });
  });

  describe('when lookerDashboardGroup canView permission is false', () => {
    beforeEach(() => {
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          analysis: {
            lookerDashboardGroup: { canView: false, canCreate: false },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
    });

    it('redirects to the base route', async () => {
      renderWithRedux(<LookerDashboardGroup />);
      await waitFor(() => {
        expect(mockLocationAssign).toHaveBeenCalledTimes(1);
        expect(mockLocationAssign).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('when lookerDashboardGroup canView permission is true', () => {
    beforeEach(() => {
      jest.spyOn(PermissionsContext, 'usePermissions').mockReturnValue({
        permissions: {
          analysis: {
            lookerDashboardGroup: { canView: true, canCreate: false },
          },
        },
        permissionsRequestStatus: 'SUCCESS',
      });
      useParams.mockReturnValue({
        dashboardGroupSlug: 'workload_dashboards',
        dashboardId: '123',
      });
      useGetDashboardGroupsQuery.mockReturnValue({
        data: mockDashboardGroups,
      });
    });

    it('renders the dashboard', async () => {
      renderWithRedux(<LookerDashboardGroup />);

      const rootElement = document.getElementById('embed-dashboard');

      expect(rootElement).toBeInTheDocument();
      expect(mockLocationAssign).not.toHaveBeenCalled();
    });
  });
});
