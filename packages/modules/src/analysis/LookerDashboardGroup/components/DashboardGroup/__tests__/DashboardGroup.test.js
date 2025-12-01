import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { useParams } from 'react-router-dom';
import { useGetDashboardGroupsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { data as mockDashboardGroups } from '@kitman/services/src/mocks/handlers/analysis/getDashboardGroups';

import DashboardGroup from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetDashboardGroupsQuery: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/analysis/LookerDashboardGroup/components/GroupTabs',
  () => jest.fn(() => <div data-testid="GroupTabs">GroupTabs</div>)
);

describe('<DashboardGroup/>', () => {
  const renderComponent = () => renderWithRedux(<DashboardGroup />);

  describe('when no dashboards exist', () => {
    beforeEach(() => {
      useParams.mockReturnValue({
        dashboardGroupSlug: 'group-1',
      });
      useGetDashboardGroupsQuery.mockReturnValue({
        data: {},
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('does not render tabs', () => {
      renderComponent();

      expect(screen.queryByTestId('GroupTabs')).not.toBeInTheDocument();
    });

    it('does not render iframe root element', () => {
      renderComponent();

      const lookerEmbed = document.getElementById('embed-dashboard');
      expect(lookerEmbed).not.toBeInTheDocument();
    });
  });

  describe('when dashboards exist', () => {
    beforeEach(() => {
      useParams.mockReturnValue({
        dashboardGroupSlug: 'workload_dashboards',
        dashboardId: '123',
      });
      useGetDashboardGroupsQuery.mockReturnValue({
        data: mockDashboardGroups,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('does render tabs', () => {
      renderComponent();

      expect(screen.queryByTestId('GroupTabs')).toBeInTheDocument();
    });

    it('does render LookerEmbed root element', () => {
      renderComponent();

      const lookerEmbed = document.getElementById('embed-dashboard');
      expect(lookerEmbed).toBeInTheDocument();
    });
  });
});
