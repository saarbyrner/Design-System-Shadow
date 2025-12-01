import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('../../containers/AppStatus', () =>
  jest.fn(() => <div data-testid="app-status">AppStatus</div>)
);
jest.mock('../../containers/GraphForm', () =>
  jest.fn((props) => (
    <div data-testid="graph-form" data-is-editing={props.isEditing}>
      GraphForm
    </div>
  ))
);
jest.mock('../../containers/GraphView', () =>
  jest.fn(() => <div data-testid="graph-view">GraphView</div>)
);
jest.mock('../../containers/DashboardSelectorModal', () =>
  jest.fn(() => (
    <div data-testid="dashboard-selector-modal">DashboardSelectorModal</div>
  ))
);
jest.mock('../Breadcrumb', () => ({
  BreadcrumbTranslated: jest.fn((props) => (
    <div
      data-testid="breadcrumb"
      data-editing-dashboard={props.isEditingDashboard}
      data-editing-graph={props.isEditingGraph}
      data-dashboard-id={props.currentDashboard?.id}
    >
      Breadcrumb
    </div>
  )),
}));

describe('Graph Composer <App /> component', () => {
  it('renders', () => {
    render(<App />);
    expect(screen.getByTestId('graph-view')).toBeInTheDocument();
  });

  it('renders a breadcrumb', () => {
    const currentDashboard = {
      id: 3,
      name: 'Dashboard Name',
    };

    render(
      <App
        isEditingDashboard
        isEditingGraph
        currentDashboard={currentDashboard}
      />
    );

    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toBeInTheDocument();
    expect(breadcrumb).toHaveAttribute('data-editing-dashboard', 'true');
    expect(breadcrumb).toHaveAttribute('data-editing-graph', 'true');
    expect(breadcrumb).toHaveAttribute('data-dashboard-id', '3');
  });

  describe('when the location hash change', () => {
    let originalHash;

    beforeEach(() => {
      originalHash = window.location.hash;
      window.location.hash = '';
    });

    afterEach(() => {
      window.location.hash = originalHash;
    });

    it('sets the correct view', () => {
      const mockCreateNewGraph = jest.fn();

      // Test initial state - should show GraphView
      let { unmount } = render(<App createNewGraph={mockCreateNewGraph} />);
      expect(screen.getByTestId('graph-view')).toBeInTheDocument();
      expect(screen.queryByTestId('graph-form')).not.toBeInTheDocument();
      unmount();

      // Test #edit hash - should show GraphForm with isEditing=true
      window.location.hash = '#edit';
      ({ unmount } = render(<App createNewGraph={mockCreateNewGraph} />));

      expect(screen.queryByTestId('graph-view')).not.toBeInTheDocument();
      const graphFormEdit = screen.getByTestId('graph-form');
      expect(graphFormEdit).toBeInTheDocument();
      expect(graphFormEdit).toHaveAttribute('data-is-editing', 'true');
      unmount();

      // Test #create hash - should show GraphForm and call createNewGraph
      window.location.hash = '#create';
      ({ unmount } = render(<App createNewGraph={mockCreateNewGraph} />));

      expect(screen.queryByTestId('graph-view')).not.toBeInTheDocument();
      expect(screen.getByTestId('graph-form')).toBeInTheDocument();
      expect(mockCreateNewGraph).toHaveBeenCalled();
      unmount();

      // Test #graphView hash - should show GraphView
      window.location.hash = '#graphView';
      render(<App createNewGraph={mockCreateNewGraph} />);

      expect(screen.getByTestId('graph-view')).toBeInTheDocument();
      expect(screen.queryByTestId('graph-form')).not.toBeInTheDocument();
      expect(screen.getByTestId('app-status')).toBeInTheDocument();
    });
  });

  it('renders DashboardSelectorModal', () => {
    render(<App />);
    expect(screen.getByTestId('dashboard-selector-modal')).toBeInTheDocument();
  });
});
