import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { useParams } from 'react-router-dom';
import { useGetDashboardGroupsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { data as mockDashboardGroups } from '@kitman/services/src/mocks/handlers/analysis/getDashboardGroups';
import { EMPTY_DASHBOARD } from '@kitman/modules/src/analysis/LookerDashboardGroup/constants';

import SingleDashboard from '..';

jest.mock('@kitman/common/src/redux/global/services/globalApi', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/services/globalApi'),
  useGetDashboardGroupsQuery: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('<SingleDashboard/>', () => {
  const renderComponent = () => renderWithRedux(<SingleDashboard />);

  describe('when no dashboards exist', () => {
    beforeEach(() => {
      useParams.mockReturnValue({
        dashboardId: 9887,
      });
      useGetDashboardGroupsQuery.mockReturnValue({
        data: {},
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('does not render iframe root element', () => {
      renderComponent();

      const lookerEmbed = document.getElementById('embed-dashboard');
      expect(lookerEmbed).not.toBeInTheDocument();
    });

    it('does render empty dashboard', () => {
      renderComponent();

      expect(screen.getByText(EMPTY_DASHBOARD)).toBeInTheDocument();
    });
  });

  describe('when dashboards exist', () => {
    beforeEach(() => {
      useParams.mockReturnValue({
        dashboardId: '135',
      });
      useGetDashboardGroupsQuery.mockReturnValue({
        data: mockDashboardGroups,
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('does render LookerEmbed root element', () => {
      renderComponent();

      const lookerEmbed = document.getElementById('embed-dashboard');
      expect(lookerEmbed).toBeInTheDocument();
    });
  });
});
