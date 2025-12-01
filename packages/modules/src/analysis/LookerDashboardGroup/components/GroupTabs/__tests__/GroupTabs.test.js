import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import GroupTabs from '..';

jest.mock('@kitman/common/src/hooks/useLocationAssign');

const mockLocationAssign = jest.fn();
const mockDashboards = [
  {
    id: 0,
    looker_dashboard_id: 246,
    name: 'Dashboard 1',
  },
  {
    id: 1,
    looker_dashboard_id: 910,
    name: 'Dashboard 2',
  },
  {
    id: 2,
    looker_dashboard_id: 1246,
    name: 'Dashboard 3',
  },
];

describe('GroupTabs', () => {
  const defaultProps = {
    dashboardId: 0,
    slug: 'test_slug',
    dashboards: mockDashboards,
  };

  beforeEach(() => {
    useLocationAssign.mockReturnValue(mockLocationAssign);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders tabs with correct labels', () => {
    render(<GroupTabs {...defaultProps} />);

    mockDashboards.forEach((dashboard) => {
      expect(screen.getByText(dashboard.name)).toBeInTheDocument();
    });
  });

  it('calls locationAssign with correct URL when tab is changed', async () => {
    const user = userEvent.setup();
    render(<GroupTabs {...defaultProps} />);

    const secondTab = screen.getByRole('tab', { name: 'Dashboard 2' });
    await user.click(secondTab);

    expect(mockLocationAssign).toHaveBeenCalledWith('/report/test_slug/1');
  });
});
