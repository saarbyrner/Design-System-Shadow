import { render, screen } from '@testing-library/react';
import DashboardControls from '../../components/DashboardControls';

// Mock NameFilter to focus on presence inside controls.
jest.mock(
  '@kitman/modules/src/MetricsDashboard/src/containers/NameFilter',
  () => () => <input role="searchbox" placeholder="Search Athletes" />
);

describe('<DashboardControls />', () => {
  it('renders NameFilter', () => {
    render(<DashboardControls />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
