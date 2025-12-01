import { render, screen } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import EmptyDashboard from '..';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

describe('<EmptyDashboard /> component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const props = {
    dashboard: {},
    createGraphUrl: '/analysis/graph/builder?analytical_dashboard_id=4#create',
    onClickOpenHeaderWidgetModal: jest.fn(),
    isDashboardManager: false,
    isGraphBuilder: false,
    containerType: '',
    canViewNotes: false,
    hasDevelopmentGoalsModule: false,
  };

  it('shows the correct empty dashboard text', () => {
    render(<EmptyDashboard {...props} />);

    expect(
      screen.getByText('There are no widgets on this dashboard')
    ).toBeInTheDocument();
  });

  it('shows the correct empty dashboard text when the container is HomeDashboard', () => {
    render(<EmptyDashboard {...props} containerType="HomeDashboard" />);

    expect(
      screen.getByText('Start customising your home page by adding a widget')
    ).toBeInTheDocument();
  });

  it('shows the expected custom title', () => {
    render(<EmptyDashboard {...props} customTitle="Title test" />);

    expect(screen.getByText('Title test')).toBeInTheDocument();
  });

  it('hides the AddWidgetDropdown component when the user is not a dashboard manager', () => {
    render(
      <EmptyDashboard {...props} isDashboardManager={false} isGraphBuilder />
    );

    const addWidgetButton = screen.queryByText('Add widget');
    expect(addWidgetButton).not.toBeInTheDocument();

    expect(
      screen.queryByText('There are no widgets on this dashboard')
    ).toBeInTheDocument();
  });

  it('hides the AddWidgetDropdown component when the user is not a graph builder', () => {
    render(
      <EmptyDashboard {...props} isDashboardManager isGraphBuilder={false} />
    );

    const addWidgetButton = screen.queryByText('Add widget');
    expect(addWidgetButton).not.toBeInTheDocument();

    expect(
      screen.queryByText('There are no widgets on this dashboard')
    ).toBeInTheDocument();
  });
});
